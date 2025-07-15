<?php
// Habilitar reporte de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
    error_log("✅ Conexión a BD exitosa para gift_cards.php");
} catch(PDOException $e) {
    error_log("❌ Error de conexión a BD: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("=== INICIANDO CREACIÓN DE GIFT CARD ===");
    
    // Obtener datos JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    error_log("📥 Datos recibidos: " . json_encode($input));
    
    if (!$input) {
        error_log("❌ Datos JSON inválidos");
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
        exit();
    }
    
    // Validar datos requeridos
    $required_fields = ['gift_card_id', 'amount', 'recipient_name', 'recipient_email', 'sender_name', 'sender_email'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || trim($input[$field]) === '') {
            error_log("❌ Campo requerido faltante: $field");
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Campo requerido faltante: $field"]);
            exit();
        }
    }
    
    error_log("✅ Validaciones pasadas, creando gift card order...");
    
    try {
        $pdo->beginTransaction();
        error_log("🔄 Transacción iniciada");
        
        // Verificar que la gift card existe
        $stmt = $pdo->prepare("SELECT * FROM gift_cards WHERE id = ? AND active = TRUE");
        $stmt->execute([$input['gift_card_id']]);
        $gift_card = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$gift_card) {
            throw new Exception("Gift card no encontrada o inactiva");
        }
        
        error_log("✅ Gift card encontrada: " . $gift_card['title']);
        
        // Generar código único para la gift card
        $gift_code = 'GC' . strtoupper(substr(md5(uniqid()), 0, 8));
        
        // Crear orden de gift card
        error_log("📝 Insertando gift card order en BD...");
        $stmt = $pdo->prepare("
            INSERT INTO gift_card_orders (gift_card_id, amount, recipient_name, recipient_email, 
                                        sender_name, sender_email, gift_code, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        ");
        $result = $stmt->execute([
            $input['gift_card_id'],
            $input['amount'],
            $input['recipient_name'],
            $input['recipient_email'],
            $input['sender_name'],
            $input['sender_email'],
            $gift_code
        ]);
        
        if (!$result) {
            throw new Exception("Error al insertar gift card order");
        }
        
        $order_id = $pdo->lastInsertId();
        error_log("✅ Gift card order creada con ID: $order_id");
        
        // Actualizar el status a 'sent' para simular envío
        $stmt = $pdo->prepare("UPDATE gift_card_orders SET status = 'sent' WHERE id = ?");
        $stmt->execute([$order_id]);
        
        $pdo->commit();
        error_log("✅ Transacción completada exitosamente");
        
        error_log("📧 Gift card marcada como enviada");
        
        echo json_encode([
            'success' => true,
            'message' => 'Gift card enviada exitosamente',
            'order_id' => $order_id,
            'gift_code' => $gift_code,
            'gift_card' => $gift_card,
            'status' => 'sent'
        ]);
        
    } catch(PDOException $e) {
        $pdo->rollBack();
        error_log("❌ Error de BD al crear gift card: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear gift card: ' . $e->getMessage()]);
    } catch(Exception $e) {
        $pdo->rollBack();
        error_log("❌ Error general al crear gift card: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear gift card: ' . $e->getMessage()]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("=== OBTENIENDO GIFT CARDS ===");
    
    try {
        // Obtener todas las gift cards activas
        $stmt = $pdo->prepare("SELECT * FROM gift_cards WHERE active = TRUE ORDER BY created_at DESC");
        $stmt->execute();
        $gift_cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        error_log("📋 Encontradas " . count($gift_cards) . " gift cards");
        
        echo json_encode([
            'success' => true,
            'message' => 'Gift cards obtenidas exitosamente',
            'gift_cards' => $gift_cards
        ]);
        
    } catch(PDOException $e) {
        error_log("❌ Error al obtener gift cards: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al obtener gift cards: ' . $e->getMessage()]);
    }
} else {
    error_log("❌ Método HTTP no permitido: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>