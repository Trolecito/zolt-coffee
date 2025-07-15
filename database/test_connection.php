<?php
// Archivo para probar la conexión a la base de datos
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>";
echo "<html><head><title>Test de Conexión - Zolt Coffee</title></head><body>";
echo "<h2>🔧 Prueba de Conexión a Base de Datos - Zolt Coffee</h2>";

// Configuración de la base de datos
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'zolt_coffee';

echo "<h3>📋 Información del Sistema:</h3>";
echo "<ul>";
echo "<li><strong>Servidor:</strong> $host</li>";
echo "<li><strong>Usuario:</strong> $username</li>";
echo "<li><strong>Base de datos:</strong> $database</li>";
echo "<li><strong>PHP Version:</strong> " . phpversion() . "</li>";
echo "<li><strong>Fecha/Hora:</strong> " . date('Y-m-d H:i:s') . "</li>";
echo "</ul>";

try {
    // Intentar conexión
    echo "<h3>🔌 Probando conexión...</h3>";
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color: green; font-weight: bold;'>✅ CONEXIÓN EXITOSA a la base de datos</p>";
    
    // Verificar que la tabla users existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Tabla 'users' encontrada</p>";
        
        // Mostrar estructura de la tabla
        $stmt = $pdo->query("DESCRIBE users");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<h3>📊 Estructura de la tabla 'users':</h3>";
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
        
        // Contar usuarios existentes
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p style='font-size: 18px;'>📊 <strong>Total de usuarios en la base de datos: {$count['total']}</strong></p>";
        
        // Mostrar últimos usuarios registrados
        $stmt = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($users) > 0) {
            echo "<h3>👥 Últimos usuarios registrados:</h3>";
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr style='background-color: #f0f0f0;'><th>ID</th><th>Nombre</th><th>Email</th><th>Fecha de Registro</th></tr>";
            foreach ($users as $user) {
                echo "<tr>";
                echo "<td>{$user['id']}</td>";
                echo "<td>{$user['name']}</td>";
                echo "<td>{$user['email']}</td>";
                echo "<td>{$user['created_at']}</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p style='color: orange; font-weight: bold;'>⚠️ No hay usuarios registrados aún</p>";
        }
        
    } else {
        echo "<p style='color: red; font-weight: bold;'>❌ Tabla 'users' NO ENCONTRADA</p>";
        echo "<p style='color: red;'>🚨 NECESITAS IMPORTAR EL ARCHIVO SQL</p>";
        echo "<ol>";
        echo "<li>Ve a <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
        echo "<li>Selecciona la base de datos 'zolt_coffee'</li>";
        echo "<li>Ve a la pestaña 'Importar'</li>";
        echo "<li>Selecciona el archivo zolt_coffee.sql</li>";
        echo "<li>Haz clic en 'Continuar'</li>";
        echo "</ol>";
    }
    
    // Verificar otras tablas importantes
    $tables = ['categories', 'products', 'stores', 'orders', 'user_sessions'];
    echo "<h3>🗂️ Verificación de otras tablas:</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "<li style='color: green;'>✅ Tabla '$table' existe</li>";
        } else {
            echo "<li style='color: red;'>❌ Tabla '$table' no existe</li>";
        }
    }
    echo "</ul>";
    
} catch(PDOException $e) {
    echo "<p style='color: red; font-weight: bold; font-size: 18px;'>❌ ERROR DE CONEXIÓN</p>";
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    
    // Sugerencias de solución
    echo "<h3>🔧 Posibles soluciones:</h3>";
    echo "<ol>";
    echo "<li><strong>Verifica que XAMPP esté ejecutándose</strong> (Apache y MySQL en verde)</li>";
    echo "<li><strong>Verifica que MySQL esté iniciado</strong> en XAMPP Control Panel</li>";
    echo "<li><strong>Crea la base de datos:</strong> Ve a <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a> y crea 'zolt_coffee'</li>";
    echo "<li><strong>Importa el archivo SQL</strong> en phpMyAdmin</li>";
    echo "<li><strong>Verifica las credenciales</strong> de conexión (usuario: root, sin contraseña)</li>";
    echo "</ol>";
}

echo "<hr>";
echo "<h3>🔗 Enlaces útiles:</h3>";
echo "<ul>";
echo "<li><a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
echo "<li><a href='http://localhost/zolt_coffee/database/debug_registration.php'>Debug de Registro</a></li>";
echo "<li><a href='http://localhost/zolt_coffee/api/auth.php'>API de Autenticación</a></li>";
echo "</ul>";

echo "<h3>📁 Estructura de archivos esperada:</h3>";
echo "<pre>";
echo "C:\\xampp\\htdocs\\zolt_coffee\\
├── api\\
│   ├── auth.php
│   ├── orders.php
│   └── upload_profile.php
├── database\\
│   ├── test_connection.php (este archivo)
│   ├── debug_registration.php
│   └── zolt_coffee.sql
└── uploads\\
    ├── profiles\\
    ├── products\\
    └── gift_cards\\";
echo "</pre>";

echo "</body></html>";
?>