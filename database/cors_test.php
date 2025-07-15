<?php
// Archivo para probar CORS y comunicación con React
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['message' => 'CORS preflight OK']);
    exit();
}

// Log de la petición
error_log("=== CORS TEST ===");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);
error_log("Headers: " . json_encode(getallheaders()));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    error_log("Datos recibidos: " . json_encode($input));
    
    echo json_encode([
        'success' => true,
        'message' => 'Comunicación exitosa con React',
        'received_data' => $input,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => 'CORS test endpoint funcionando',
        'method' => $_SERVER['REQUEST_METHOD'],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>