<?php
// Script para debuggear problemas con órdenes
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>";
echo "<html><head><title>Debug Órdenes - Zolt Coffee</title></head><body>";
echo "<h2>🔧 Debug - Sistema de Órdenes</h2>";

// Configuración de la base de datos
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'zolt_coffee';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green; font-weight: bold;'>✅ Conexión a BD exitosa</p>";
    
    // Verificar estructura de tablas
    echo "<h3>📊 Verificación de Tablas</h3>";
    $tables = ['orders', 'order_items', 'payment_info', 'users', 'user_sessions', 'stores', 'products'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "<p style='color: green;'>✅ Tabla '$table' existe</p>";
            
            // Mostrar estructura de tabla orders
            if ($table === 'orders') {
                $stmt = $pdo->query("DESCRIBE orders");
                $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo "<h4>Estructura de tabla 'orders':</h4>";
                echo "<table border='1' style='border-collapse: collapse;'>";
                echo "<tr style='background-color: #f0f0f0;'><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Clave</th><th>Default</th></tr>";
                foreach ($columns as $column) {
                    echo "<tr>";
                    echo "<td>{$column['Field']}</td>";
                    echo "<td>{$column['Type']}</td>";
                    echo "<td>{$column['Null']}</td>";
                    echo "<td>{$column['Key']}</td>";
                    echo "<td>" . ($column['Default'] ?? 'NULL') . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        } else {
            echo "<p style='color: red;'>❌ Tabla '$table' NO existe</p>";
        }
    }
    
    // Verificar datos de prueba
    echo "<h3>📋 Datos de Prueba</h3>";
    
    // Contar usuarios
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>👥 <strong>Usuarios:</strong> {$count['total']}</p>";
    
    // Contar sedes
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM stores");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>🏪 <strong>Sedes:</strong> {$count['total']}</p>";
    
    // Contar productos
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM products");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>☕ <strong>Productos:</strong> {$count['total']}</p>";
    
    // Contar órdenes
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>📦 <strong>Órdenes:</strong> {$count['total']}</p>";
    
    // Mostrar últimas órdenes
    if ($count['total'] > 0) {
        echo "<h4>Últimas órdenes:</h4>";
        $stmt = $pdo->query("SELECT o.*, u.name as user_name, s.name as store_name FROM orders o JOIN users u ON o.user_id = u.id JOIN stores s ON o.store_id = s.id ORDER BY o.created_at DESC LIMIT 5");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr style='background-color: #f0f0f0;'><th>ID</th><th>Ticket</th><th>Usuario</th><th>Sede</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>";
        foreach ($orders as $order) {
            echo "<tr>";
            echo "<td>{$order['id']}</td>";
            echo "<td>{$order['ticket_number']}</td>";
            echo "<td>{$order['user_name']}</td>";
            echo "<td>{$order['store_name']}</td>";
            echo "<td>\${$order['total']}</td>";
            echo "<td>{$order['status']}</td>";
            echo "<td>{$order['created_at']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    // Test de creación de orden
    echo "<h3>🧪 Test de Creación de Orden</h3>";
    
    // Verificar si hay usuarios y sedes para hacer el test
    $stmt = $pdo->query("SELECT id FROM users LIMIT 1");
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $stmt = $pdo->query("SELECT id FROM stores LIMIT 1");
    $store = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $stmt = $pdo->query("SELECT id FROM products LIMIT 1");
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && $store && $product) {
        echo "<p style='color: blue;'>🔄 Intentando crear orden de prueba...</p>";
        
        try {
            $pdo->beginTransaction();
            
            // Crear orden de prueba
            $ticket_number = 'TEST' . time();
            $stmt = $pdo->prepare("
                INSERT INTO orders (user_id, store_id, ticket_number, pickup_person_name, 
                                  ticket_email, total, estimated_time, status, payment_method, payment_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'credit_card', 'completed')
            ");
            $result = $stmt->execute([
                $user['id'],
                $store['id'],
                $ticket_number,
                'Test User',
                'test@example.com',
                50.00,
                '15-20 minutos'
            ]);
            
            if ($result) {
                $order_id = $pdo->lastInsertId();
                echo "<p style='color: green;'>✅ Orden de prueba creada con ID: $order_id</p>";
                
                // Crear item de prueba
                $stmt = $pdo->prepare("
                    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) 
                    VALUES (?, ?, ?, ?, ?)
                ");
                $result = $stmt->execute([
                    $order_id,
                    $product['id'],
                    1,
                    50.00,
                    50.00
                ]);
                
                if ($result) {
                    echo "<p style='color: green;'>✅ Item de orden creado exitosamente</p>";
                } else {
                    echo "<p style='color: red;'>❌ Error al crear item de orden</p>";
                }
                
                // Crear info de pago de prueba
                $stmt = $pdo->prepare("
                    INSERT INTO payment_info (order_id, cardholder_name, card_last_four, 
                                            billing_street, billing_city, billing_state, 
                                            billing_zip_code, billing_country) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $result = $stmt->execute([
                    $order_id,
                    'Test User',
                    '1234',
                    'Test Street 123',
                    'Test City',
                    'Test State',
                    '12345',
                    'México'
                ]);
                
                if ($result) {
                    echo "<p style='color: green;'>✅ Información de pago creada exitosamente</p>";
                } else {
                    echo "<p style='color: red;'>❌ Error al crear información de pago</p>";
                }
                
                $pdo->commit();
                echo "<p style='color: green; font-weight: bold; font-size: 18px;'>✅ TEST COMPLETADO EXITOSAMENTE</p>";
                
            } else {
                echo "<p style='color: red;'>❌ Error al crear orden de prueba</p>";
                $pdo->rollBack();
            }
            
        } catch(Exception $e) {
            $pdo->rollBack();
            echo "<p style='color: red; font-weight: bold;'>❌ ERROR EN TEST: " . $e->getMessage() . "</p>";
        }
    } else {
        echo "<p style='color: orange;'>⚠️ No hay datos suficientes para hacer el test (necesita usuarios, sedes y productos)</p>";
    }
    
} catch(PDOException $e) {
    echo "<p style='color: red; font-weight: bold; font-size: 18px;'>❌ ERROR: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h3>🔗 Enlaces útiles:</h3>";
echo "<ul>";
echo "<li><a href='http://localhost/zolt_coffee/database/test_connection.php'>Test de Conexión</a></li>";
echo "<li><a href='http://localhost/zolt_coffee/database/debug_registration.php'>Debug de Registro</a></li>";
echo "<li><a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
echo "</ul>";

echo "<h3>📝 Logs de Apache:</h3>";
echo "<p>Para ver logs detallados, revisa: <code>C:\\xampp\\apache\\logs\\error.log</code></p>";

echo "</body></html>";
?>