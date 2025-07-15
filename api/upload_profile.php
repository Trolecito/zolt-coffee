<?php
// Habilitar reporte de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la base de datos
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'zolt_coffee';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_log("✅ Conexión a BD exitosa para upload");
} catch(PDOException $e) {
    error_log("❌ Error de conexión a BD: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit();
}

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Verificar que se haya enviado un archivo
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    error_log("❌ No se recibió archivo válido");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No se recibió ningún archivo válido']);
    exit();
}

// Verificar que se haya enviado el user_id
if (!isset($_POST['user_id']) || empty($_POST['user_id'])) {
    error_log("❌ No se recibió user_id");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
    exit();
}

$user_id = intval($_POST['user_id']);
$file = $_FILES['avatar'];

error_log("📤 Procesando upload para usuario: $user_id");
error_log("📁 Archivo recibido: " . $file['name'] . " (" . $file['size'] . " bytes)");

// Validaciones del archivo
$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$max_size = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowed_types)) {
    error_log("❌ Tipo de archivo no permitido: " . $file['type']);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WEBP']);
    exit();
}

if ($file['size'] > $max_size) {
    error_log("❌ Archivo demasiado grande: " . $file['size'] . " bytes");
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El archivo es demasiado grande. Máximo 5MB']);
    exit();
}

// Crear directorio si no existe
$upload_dir = '../uploads/profiles/';
if (!file_exists($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        error_log("❌ Error al crear directorio: $upload_dir");
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear directorio de uploads']);
        exit();
    }
    error_log("📁 Directorio creado: $upload_dir");
}

// Verificar si el usuario existe y obtener avatar anterior
try {
    $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        error_log("❌ Usuario no encontrado: $user_id");
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        exit();
    }
    
    $old_avatar = $user['avatar'];
    error_log("👤 Usuario encontrado, avatar anterior: $old_avatar");
} catch(PDOException $e) {
    error_log("❌ Error al verificar usuario: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al verificar usuario']);
    exit();
}

// Generar nombre único para el archivo
$file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$new_filename = 'user_' . $user_id . '_' . time() . '.' . $file_extension;
$upload_path = $upload_dir . $new_filename;

error_log("📝 Nuevo nombre de archivo: $new_filename");
error_log("📍 Ruta de destino: $upload_path");

// Mover el archivo subido
if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
    error_log("❌ Error al mover archivo de " . $file['tmp_name'] . " a $upload_path");
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al guardar el archivo']);
    exit();
}

error_log("✅ Archivo movido exitosamente a: $upload_path");

// Actualizar la base de datos
$avatar_url = 'http://localhost/zolt_coffee/uploads/profiles/' . $new_filename;

try {
    $stmt = $pdo->prepare("UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?");
    $result = $stmt->execute([$avatar_url, $user_id]);
    
    if (!$result) {
        error_log("❌ Error al actualizar BD");
        throw new Exception("Error al actualizar la base de datos");
    }
    
    error_log("✅ Base de datos actualizada con nueva URL: $avatar_url");
    
    // Eliminar avatar anterior si existe y no es la imagen por defecto
    if ($old_avatar && $old_avatar !== $avatar_url && strpos($old_avatar, 'localhost/zolt_coffee/uploads/profiles/') !== false) {
        $old_file_path = str_replace('http://localhost/zolt_coffee/uploads/profiles/', $upload_dir, $old_avatar);
        if (file_exists($old_file_path)) {
            if (unlink($old_file_path)) {
                error_log("🗑️ Avatar anterior eliminado: $old_file_path");
            } else {
                error_log("⚠️ No se pudo eliminar avatar anterior: $old_file_path");
            }
        }
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Avatar actualizado correctamente',
        'avatar_url' => $avatar_url
    ]);
    
    error_log("✅ Upload completado exitosamente para usuario $user_id");
    
} catch(Exception $e) {
    error_log("❌ Error al actualizar BD: " . $e->getMessage());
    
    // Si falla la actualización de BD, eliminar el archivo subido
    if (file_exists($upload_path)) {
        unlink($upload_path);
        error_log("🗑️ Archivo eliminado por error en BD: $upload_path");
    }
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al actualizar la base de datos: ' . $e->getMessage()]);
}
?>