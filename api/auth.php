<?php
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
} catch(PDOException $e) {
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

// Obtener datos JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
    exit();
}

$action = $input['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegister($pdo, $input);
        break;
    case 'login':
        handleLogin($pdo, $input);
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}

function handleRegister($pdo, $data) {
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    // Validaciones
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email no válido']);
        return;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
        return;
    }
    
    try {
        // Verificar si el email ya existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
            return;
        }
        
        // Crear usuario
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $default_avatar = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';
        
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $hashed_password, $default_avatar]);
        
        $user_id = $pdo->lastInsertId();
        
        // Crear sesión
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        $stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $session_token, $expires_at]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'user' => [
                'id' => $user_id,
                'name' => $name,
                'email' => $email,
                'avatar' => $default_avatar,
                'joinDate' => date('d \d\e F \d\e Y')
            ],
            'session_token' => $session_token
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear usuario']);
    }
}

function handleLogin($pdo, $data) {
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    // Validaciones
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email y contraseña son requeridos']);
        return;
    }
    
    try {
        // Buscar usuario
        $stmt = $pdo->prepare("SELECT id, name, email, password, avatar, join_date FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
            return;
        }
        
        // Limpiar sesiones expiradas
        $stmt = $pdo->prepare("DELETE FROM user_sessions WHERE user_id = ? AND expires_at < NOW()");
        $stmt->execute([$user['id']]);
        
        // Crear nueva sesión
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        $stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$user['id'], $session_token, $expires_at]);
        
        // Formatear fecha de registro
        $join_date = date('d \d\e F \d\e Y', strtotime($user['join_date']));
        
        echo json_encode([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'joinDate' => $join_date
            ],
            'session_token' => $session_token
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
    }
}
?>