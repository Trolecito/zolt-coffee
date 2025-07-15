# Configuración de Base de Datos - Zolt Coffee

## Requisitos Previos
- XAMPP instalado y funcionando
- MySQL/MariaDB activo en XAMPP
- phpMyAdmin accesible

## Pasos de Instalación

### 1. Importar la Base de Datos

#### Opción A: Usando phpMyAdmin
1. Abre XAMPP Control Panel
2. Inicia Apache y MySQL
3. Ve a `http://localhost/phpmyadmin`
4. Haz clic en "Nuevo" para crear una nueva base de datos
5. Importa el archivo `zolt_coffee.sql`

#### Opción B: Usando línea de comandos
```bash
# Navega al directorio de MySQL en XAMPP
cd C:\xampp\mysql\bin

# Ejecuta el script SQL
mysql -u root -p < ruta/al/archivo/zolt_coffee.sql
```

### 2. Configurar Carpeta de Imágenes de Perfil

#### Crear estructura de carpetas:
```
C:\xampp\htdocs\zolt_coffee\
├── uploads\
│   ├── profiles\          # Fotos de perfil de usuarios
│   ├── products\          # Imágenes de productos
│   └── gift_cards\        # Imágenes de gift cards
└── api\                   # Scripts PHP para la API
```

#### Crear carpetas manualmente:
1. Ve a `C:\xampp\htdocs\`
2. Crea la carpeta `zolt_coffee`
3. Dentro crea las subcarpetas: `uploads`, `uploads/profiles`, `uploads/products`, `uploads/gift_cards`, `api`

### 3. Configurar Permisos (Windows)
1. Clic derecho en la carpeta `uploads`
2. Propiedades → Seguridad
3. Dar permisos de escritura completos a "Usuarios"

### 4. Configuración de PHP para Subida de Archivos

Edita `C:\xampp\php\php.ini`:
```ini
file_uploads = On
upload_max_filesize = 10M
post_max_size = 10M
max_file_uploads = 20
upload_tmp_dir = "C:\xampp\tmp"
```

Reinicia Apache después de los cambios.

### 5. Estructura de la Base de Datos

#### Tablas Principales:
- **users**: Información de usuarios y rutas de avatares
- **products**: Catálogo de productos
- **categories**: Categorías de productos
- **stores**: Sedes/tiendas
- **orders**: Pedidos realizados
- **order_items**: Detalles de productos en pedidos
- **payment_info**: Información de pago (sin datos sensibles)
- **gift_cards**: Catálogo de gift cards
- **gift_card_orders**: Órdenes de gift cards
- **user_sessions**: Manejo de sesiones

#### Campos Importantes:
- `users.avatar`: Ruta relativa a la imagen de perfil
- `products.image`: URL o ruta de imagen del producto
- `orders.ticket_number`: Número único de ticket
- `orders.status`: Estado del pedido

### 6. URLs de Acceso

#### Desarrollo Local:
- **Base de datos**: `http://localhost/phpmyadmin`
- **Imágenes de perfil**: `http://localhost/zolt_coffee/uploads/profiles/`
- **API endpoints**: `http://localhost/zolt_coffee/api/`

#### Estructura de URLs de Imágenes:
```
http://localhost/zolt_coffee/uploads/profiles/user_123.jpg
http://localhost/zolt_coffee/uploads/products/product_456.jpg
http://localhost/zolt_coffee/uploads/gift_cards/card_789.jpg
```

### 7. Configuración de Conexión

#### Datos de conexión por defecto (XAMPP):
```php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'zolt_coffee';
$port = 3306;
```

### 8. Verificación de Instalación

#### Verificar base de datos:
1. Ve a phpMyAdmin
2. Selecciona la base de datos `zolt_coffee`
3. Verifica que todas las tablas estén creadas
4. Revisa que los datos de ejemplo estén insertados

#### Verificar carpetas:
1. Confirma que las carpetas de uploads existan
2. Verifica permisos de escritura
3. Prueba subir un archivo de prueba

### 9. Seguridad

#### Recomendaciones:
- Cambiar la contraseña de root de MySQL
- Configurar .htaccess para proteger carpetas sensibles
- Validar tipos de archivo en uploads
- Limitar tamaño de archivos
- Sanitizar nombres de archivos

#### Archivo .htaccess para uploads:
```apache
# En uploads/.htaccess
<Files ~ "\.php$">
    Order allow,deny
    Deny from all
</Files>

# Permitir solo imágenes
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Order allow,deny
    Allow from all
</FilesMatch>
```

### 10. Backup y Mantenimiento

#### Backup automático:
```sql
-- Crear backup
mysqldump -u root -p zolt_coffee > backup_zolt_coffee.sql

-- Restaurar backup
mysql -u root -p zolt_coffee < backup_zolt_coffee.sql
```

#### Limpieza periódica:
- Eliminar sesiones expiradas
- Limpiar archivos de upload huérfanos
- Optimizar tablas

## Solución de Problemas Comunes

### Error de conexión a MySQL:
1. Verificar que MySQL esté iniciado en XAMPP
2. Revisar puerto (por defecto 3306)
3. Verificar credenciales

### Error de permisos de archivo:
1. Verificar permisos de carpeta uploads
2. Revisar configuración de php.ini
3. Reiniciar Apache

### Imágenes no se muestran:
1. Verificar ruta de archivo
2. Confirmar permisos de lectura
3. Revisar configuración de .htaccess

## Contacto y Soporte

Para problemas específicos de configuración, revisar:
1. Logs de Apache: `C:\xampp\apache\logs\error.log`
2. Logs de MySQL: `C:\xampp\mysql\data\mysql_error.log`
3. Logs de PHP: Configurar en php.ini