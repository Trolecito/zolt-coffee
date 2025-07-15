<?php
// Script para probar el registro de usuarios directamente
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>";
echo "<html><head><title>Debug Registro - Zolt Coffee</title></head><body>";
echo "<h2>🔧 Debug - Registro de Usuario</h2>";

// Configuración de la base de datos
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'zolt_coffee';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green; font-weight: bold;'>✅ Conexión a BD exitosa</p>";
    
    // Datos de prueba
    $test_name = 'Usuario Prueba ' . date('H:i:s');
    $test_email = 'test' . time() . '@example.com'; // Email único
    $test_password = 'password123';
    
    echo "<h3>🧪 Intentando registrar usuario de prueba:</h3>";
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><td><strong>Nombre:</strong></td><td>$test_name</td></tr>";
    echo "<tr><td><strong>Email:</strong></td><td>$test_email</td></tr>";
    echo "<tr><td><strong>Contraseña:</strong></td><td>$test_password</td></tr>";
    echo "</table>";
    
    // Crear usuario
    $hashed_password = password_hash($test_password, PASSWORD_DEFAULT);
    $default_avatar = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';
    
    echo "<p>🔐 Contraseña hasheada: " . substr($hashed_password, 0, 30) . "...</p>";
    
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)");
    $result = $stmt->execute([$test_name, $test_email, $hashed_password, $default_avatar]);
    
    if ($result) {
        $user_id = $pdo->lastInsertId();
        echo "<p style='color: green; font-weight: bold; font-size: 18px;'>✅ USUARIO CREADO EXITOSAMENTE con ID: $user_id</p>";
        
        // Verificar que se guardó correctamente
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "<h3>💾 Datos guardados en la BD:</h3>";
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr style='background-color: #f0f0f0;'><th>Campo</th><th>Valor</th></tr>";
            foreach ($user as $key => $value) {
                if ($key === 'password') {
                    $value = substr($value, 0, 30) . '...';
                }
                echo "<tr><td><strong>$key</strong></td><td>$value</td></tr>";
            }
            echo "</table>";
        }
        
        // Crear sesión de prueba
        echo "<h3>🔑 Creando sesión...</h3>";
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        $stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
        $session_result = $stmt->execute([$user_id, $session_token, $expires_at]);
        
        if ($session_result) {
            echo "<p style='color: green; font-weight: bold;'>✅ Sesión creada exitosamente</p>";
            echo "<p>🔑 Token de sesión: " . substr($session_token, 0, 30) . "...</p>";
            echo "<p>⏰ Expira: $expires_at</p>";
        } else {
            echo "<p style='color: red;'>❌ Error al crear sesión</p>";
        }
        
        // Mostrar conteo total de usuarios
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p style='font-size: 18px; color: blue;'>📊 <strong>Total de usuarios en la BD: {$count['total']}</strong></p>";
        
    } else {
        echo "<p style='color: red; font-weight: bold;'>❌ Error al insertar usuario</p>";
    }
    
} catch(PDOException $e) {
    echo "<p style='color: red; font-weight: bold; font-size: 18px;'>❌ ERROR: " . $e->getMessage() . "</p>";
    
    if (strpos($e->getMessage(), "doesn't exist") !== false) {
        echo "<h3>🚨 La base de datos o tabla no existe</h3>";
        echo "<ol>";
        echo "<li>Ve a <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
        echo "<li>Crea la base de datos 'zolt_coffee' si no existe</li>";
        echo "<li>Importa el archivo zolt_coffee.sql</li>";
        echo "</ol>";
    }
}

echo "<hr>";
echo "<h3>📋 Próximos pasos para probar:</h3>";
echo "<ol>";
echo "<li><strong>Si este script funciona:</strong> El problema está en la comunicación entre React y PHP</li>";
echo "<li><strong>Prueba el registro desde React:</strong> Ve a tu aplicación y registra un usuario</li>";
echo "<li><strong>Revisa logs de errores:</strong> <code>C:\\xampp\\apache\\logs\\error.log</code></li>";
echo "<li><strong>Verifica CORS:</strong> Asegúrate de que React esté en <code>http://localhost:5173</code></li>";
echo "</ol>";

echo "<h3>🔗 Enlaces útiles:</h3>";
echo "<ul>";
echo "<li><a href='http://localhost/zolt_coffee/database/test_connection.php'>Test de Conexión</a></li>";
echo "<li><a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>";
echo "<li><a href='http://localhost/zolt_coffee/api/auth.php'>API de Autenticación</a> (POST request)</li>";
echo "</ul>";

echo "<h3>🧪 Simular llamada a la API:</h3>";
echo "<p>Para probar la API desde JavaScript (consola del navegador):</p>";
echo "<pre style='background-color: #f0f0f0; padding: 10px;'>";
echo "fetch('http://localhost/zolt_coffee/api/auth.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'register',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));";
echo "</pre>";

echo "</body></html>";
?>