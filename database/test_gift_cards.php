<?php
// Script para probar la funcionalidad de Gift Cards
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>";
echo "<html><head><title>Test Gift Cards - Zolt Coffee</title></head><body>";
echo "<h2>🎁 Test - Sistema de Gift Cards</h2>";

// Configuración de la base de datos
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'zolt_coffee';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green; font-weight: bold;'>✅ Conexión a BD exitosa</p>";
    
    // Verificar estructura de tabla gift_card_orders
    echo "<h3>📊 Verificación de Tabla gift_card_orders</h3>";
    $stmt = $pdo->query("DESCRIBE gift_card_orders");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
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
    
    // Verificar si existe la columna gift_code
    $hasGiftCode = false;
    foreach ($columns as $column) {
        if ($column['Field'] === 'gift_code') {
            $hasGiftCode = true;
            break;
        }
    }
    
    if ($hasGiftCode) {
        echo "<p style='color: green; font-weight: bold;'>✅ Columna 'gift_code' existe</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>❌ Columna 'gift_code' NO existe</p>";
        echo "<p style='color: red;'>🚨 NECESITAS EJECUTAR EL SCRIPT SQL PARA AGREGAR LA COLUMNA</p>";
    }
    
    // Contar gift cards disponibles
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM gift_cards WHERE active = TRUE");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>🎁 <strong>Gift Cards disponibles:</strong> {$count['total']}</p>";
    
    // Contar órdenes de gift cards
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM gift_card_orders");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>📦 <strong>Órdenes de Gift Cards:</strong> {$count['total']}</p>";
    
    // Mostrar gift cards disponibles
    if ($hasGiftCode) {
        echo "<h3>🎁 Gift Cards Disponibles:</h3>";
        $stmt = $pdo->query("SELECT * FROM gift_cards WHERE active = TRUE ORDER BY created_at DESC");
        $giftCards = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($giftCards) > 0) {
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr style='background-color: #f0f0f0;'><th>ID</th><th>Título</th><th>Ocasión</th><th>Descripción</th></tr>";
            foreach ($giftCards as $card) {
                echo "<tr>";
                echo "<td>{$card['id']}</td>";
                echo "<td>{$card['title']}</td>";
                echo "<td>{$card['occasion']}</td>";
                echo "<td>{$card['description']}</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
        
        // Test de creación de gift card order
        echo "<h3>🧪 Test de Creación de Gift Card Order</h3>";
        
        if (count($giftCards) > 0) {
            try {
                $gift_code = 'GC' . strtoupper(substr(md5(uniqid()), 0, 8));
                
                $stmt = $pdo->prepare("
                    INSERT INTO gift_card_orders (gift_card_id, amount, recipient_name, recipient_email, 
                                                sender_name, sender_email, gift_code, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                ");
                $result = $stmt->execute([
                    $giftCards[0]['id'],
                    100.00,
                    'Test Recipient',
                    'recipient@test.com',
                    'Test Sender',
                    'sender@test.com',
                    $gift_code
                ]);
                
                if ($result) {
                    $order_id = $pdo->lastInsertId();
                    echo "<p style='color: green; font-weight: bold;'>✅ Gift Card Order creada exitosamente con ID: $order_id</p>";
                    echo "<p style='color: blue;'>🎁 Código generado: <strong>$gift_code</strong></p>";
                } else {
                    echo "<p style='color: red;'>❌ Error al crear Gift Card Order</p>";
                }
            } catch(Exception $e) {
                echo "<p style='color: red; font-weight: bold;'>❌ ERROR: " . $e->getMessage() . "</p>";
            }
        }
    }
    
} catch(PDOException $e) {
    echo "<p style='color: red; font-weight: bold; font-size: 18px;'>❌ ERROR: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h3>📋 Instrucciones:</h3>";
echo "<ol>";
echo "<li><strong>Si la columna 'gift_code' NO existe:</strong> Ejecuta el script SQL en phpMyAdmin</li>";
echo "<li><strong>Ve a phpMyAdmin:</strong> <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>";
echo "<li><strong>Selecciona la base de datos:</strong> zolt_coffee</li>";
echo "<li><strong>Ve a la pestaña SQL</strong> y ejecuta el script</li>";
echo "<li><strong>Recarga esta página</strong> para verificar</li>";
echo "</ol>";

echo "<h3>🔗 Enlaces útiles:</h3>";
echo "<ul>";
echo "<li><a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
echo "<li><a href='http://localhost/zolt_coffee/database/test_connection.php'>Test de Conexión</a></li>";
echo "<li><a href='http://localhost:5173'>Aplicación React</a></li>";
echo "</ul>";

echo "</body></html>";
?>