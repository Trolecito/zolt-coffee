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
    error_log("✅ Conexión a BD exitosa para orders.php");
} catch(PDOException $e) {
    error_log("❌ Error de conexión a BD: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit();
}

// Función para verificar sesión
function verifySession($pdo, $session_token) {
    error_log("🔍 Verificando sesión con token: " . substr($session_token, 0, 10) . "...");
    if (!$session_token) return false;
    
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email 
        FROM users u 
        JOIN user_sessions s ON u.id = s.user_id 
        WHERE s.session_token = ? AND s.expires_at > NOW()
    ");
    $stmt->execute([$session_token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        error_log("✅ Usuario verificado: " . $user['name'] . " (ID: " . $user['id'] . ")");
    } else {
        error_log("❌ Sesión inválida o expirada");
    }
    return $user;
}

// Obtener token de sesión del header Authorization
$headers = getallheaders();
$session_token = null;
if (isset($headers['Authorization'])) {
    $session_token = str_replace('Bearer ', '', $headers['Authorization']);
    error_log("🔑 Token recibido: " . substr($session_token, 0, 10) . "...");
} else {
    error_log("❌ No se recibió token de autorización");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("=== INICIANDO CREACIÓN DE PEDIDO ===");
    // Crear nuevo pedido
    $input = json_decode(file_get_contents('php://input'), true);
    
    error_log("📥 Datos recibidos: " . json_encode($input));
    
    if (!$input) {
        error_log("❌ Datos JSON inválidos");
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos']);
        exit();
    }
    
    // Verificar sesión
    $user = verifySession($pdo, $session_token);
    if (!$user) {
        error_log("❌ Sesión inválida - usuario no autenticado");
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Sesión inválida']);
        exit();
    }
    
    // Validar datos requeridos
    $required_fields = ['store_id', 'ticket_number', 'pickup_person_name', 'ticket_email', 'total', 'items'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || (is_array($input[$field]) ? empty($input[$field]) : trim($input[$field]) === '')) {
            error_log("❌ Campo requerido faltante: $field");
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Campo requerido faltante: $field"]);
            exit();
        }
    }
    
    error_log("✅ Validaciones pasadas, creando pedido...");
    
    try {
        $pdo->beginTransaction();
        error_log("🔄 Transacción iniciada");
        
        // Generar número de ticket único
        $ticket_number = $input['ticket_number'];
        error_log("🎫 Número de ticket: $ticket_number");
        
        // Verificar que el ticket sea único
        $stmt = $pdo->prepare("SELECT id FROM orders WHERE ticket_number = ?");
        $stmt->execute([$ticket_number]);
        while ($stmt->fetch()) {
            $ticket_number = 'ZC' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
            error_log("🔄 Generando nuevo ticket: $ticket_number");
            $stmt->execute([$ticket_number]);
        }
        
        // Crear pedido
        error_log("📝 Insertando pedido en BD...");
        $stmt = $pdo->prepare("
            INSERT INTO orders (user_id, store_id, ticket_number, pickup_person_name, 
                              ticket_email, total, estimated_time, status, payment_method, payment_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'credit_card', 'completed')
        ");
        $result = $stmt->execute([
            $user['id'],
            $input['store_id'],
            $ticket_number,
            $input['pickup_person_name'],
            $input['ticket_email'],
            $input['total'],
            $input['estimated_time'] ?? '15-20 minutos'
        ]);
        
        if (!$result) {
            throw new Exception("Error al insertar pedido");
        }
        
        $order_id = $pdo->lastInsertId();
        error_log("✅ Pedido creado con ID: $order_id");
        
        // Insertar items del pedido
        error_log("📦 Insertando items del pedido...");
        $stmt = $pdo->prepare("
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) 
            VALUES (?, ?, ?, ?, ?)
        ");
        
        foreach ($input['items'] as $item) {
            error_log("📦 Item: " . json_encode($item));
            $result = $stmt->execute([
                $order_id,
                $item['product_id'],
                $item['quantity'],
                $item['unit_price'],
                $item['total_price']
            ]);
            if (!$result) {
                throw new Exception("Error al insertar item del pedido");
            }
        }
        
        error_log("✅ Items insertados correctamente");
        
        // Insertar información de pago (sin datos sensibles)
        if (isset($input['payment']) && is_array($input['payment'])) {
            error_log("💳 Insertando información de pago...");
            
            // Validar que billing_address existe
            $billing_address = $input['payment']['billing_address'] ?? [];
            
            $stmt = $pdo->prepare("
                INSERT INTO payment_info (order_id, cardholder_name, card_last_four, 
                                        billing_street, billing_city, billing_state, 
                                        billing_zip_code, billing_country) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $result = $stmt->execute([
                $order_id,
                $input['payment']['cardholder_name'] ?? 'Demo User',
                isset($input['payment']['card_number']) && !empty(trim($input['payment']['card_number'])) ? substr(trim($input['payment']['card_number']), -4) : '****',
                $billing_address['street'] ?? '',
                $billing_address['city'] ?? '',
                $billing_address['state'] ?? '',
                $billing_address['zipCode'] ?? $billing_address['zip_code'] ?? '',
                $billing_address['country'] ?? 'México'
            ]);
            if (!$result) {
                throw new Exception("Error al insertar información de pago");
            }
            error_log("✅ Información de pago insertada");
        }
        
        $pdo->commit();
        error_log("✅ Transacción completada exitosamente");
        
        echo json_encode([
            'success' => true,
            'message' => 'Pedido creado exitosamente',
            'order_id' => $order_id,
            'ticket_number' => $ticket_number,
            'status' => 'confirmed'
        ]);
        
    } catch(PDOException $e) {
        $pdo->rollBack();
        error_log("❌ Error de BD al crear pedido: " . $e->getMessage());
        error_log("❌ SQL State: " . $e->getCode());
        error_log("❌ Trace: " . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear pedido: ' . $e->getMessage()]);
    } catch(Exception $e) {
        $pdo->rollBack();
        error_log("❌ Error general al crear pedido: " . $e->getMessage());
        error_log("❌ Trace: " . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear pedido: ' . $e->getMessage()]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("=== OBTENIENDO PEDIDOS DEL USUARIO ===");
    // Obtener pedidos del usuario
    $user = verifySession($pdo, $session_token);
    if (!$user) {
        error_log("❌ Sesión inválida para obtener pedidos");
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Sesión inválida']);
        exit();
    }
    
    try {
        error_log("📋 Obteniendo pedidos para usuario: " . $user['id']);
        $stmt = $pdo->prepare("
            SELECT o.id, o.ticket_number, o.pickup_person_name, o.ticket_email, 
                   o.total, o.status, o.estimated_time, o.created_at,
                   s.name as store_name, s.address as store_address, 
                   s.phone as store_phone, s.hours as store_hours
            FROM orders o
            JOIN stores s ON o.store_id = s.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        ");
        $stmt->execute([$user['id']]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        error_log("📋 Encontrados " . count($orders) . " pedidos");
        
        // Obtener items para cada pedido
        foreach ($orders as &$order) {
            $stmt = $pdo->prepare("
                SELECT oi.quantity, oi.unit_price, oi.total_price,
                       p.name as product_name, p.description as product_description,
                       p.image as product_image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            ");
            $stmt->execute([$order['id']]);
            $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        error_log("✅ Pedidos obtenidos exitosamente");
        echo json_encode([
            'success' => true,
            'message' => 'Pedidos obtenidos exitosamente',
            'orders' => $orders
        ]);
        
    } catch(PDOException $e) {
        error_log("❌ Error al obtener pedidos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al obtener pedidos: ' . $e->getMessage()]);
    }
} else {
    error_log("❌ Método HTTP no permitido: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>