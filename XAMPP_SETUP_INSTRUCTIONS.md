# 🚀 Configuración Completa de XAMPP para Zolt Coffee

## 📁 **PASO 1: Crear Estructura de Carpetas**

### Ubicación correcta en XAMPP:
```
C:\xampp\htdocs\zolt_coffee\
├── api\
│   ├── auth.php
│   ├── orders.php
│   └── upload_profile.php
├── database\
│   ├── test_connection.php
│   ├── debug_registration.php
│   └── zolt_coffee.sql
└── uploads\
    ├── profiles\
    ├── products\
    └── gift_cards\
```

### **Crear las carpetas manualmente:**

1. **Abre el Explorador de Windows**
2. **Navega a:** `C:\xampp\htdocs\`
3. **Crea la carpeta:** `zolt_coffee`
4. **Dentro de `zolt_coffee`, crea:**
   - Carpeta `api`
   - Carpeta `database` 
   - Carpeta `uploads`
5. **Dentro de `uploads`, crea:**
   - Carpeta `profiles`
   - Carpeta `products`
   - Carpeta `gift_cards`

## 📋 **PASO 2: Copiar Archivos**

### **Copiar archivos de la API:**
Copia estos archivos desde tu proyecto a `C:\xampp\htdocs\zolt_coffee\api\`:
- `api/auth.php`
- `api/orders.php` 
- `api/upload_profile.php`

### **Copiar archivos de la base de datos:**
Copia estos archivos desde tu proyecto a `C:\xampp\htdocs\zolt_coffee\database\`:
- `supabase/migrations/20250709171022_mellow_union.sql` (renómbralo a `zolt_coffee.sql`)

## 🗄️ **PASO 3: Configurar Base de Datos**

### **Opción A: Usando phpMyAdmin (Recomendado)**
1. Abre XAMPP Control Panel
2. Inicia **Apache** y **MySQL**
3. Ve a: `http://localhost/phpmyadmin`
4. Haz clic en **"Nuevo"** (lado izquierdo)
5. Nombre de la base de datos: `zolt_coffee`
6. Haz clic en **"Crear"**
7. Ve a la pestaña **"Importar"**
8. Selecciona el archivo `C:\xampp\htdocs\zolt_coffee\database\zolt_coffee.sql`
9. Haz clic en **"Continuar"**

### **Opción B: Línea de comandos**
```bash
# Abre CMD como administrador
cd C:\xampp\mysql\bin
mysql -u root -p
CREATE DATABASE zolt_coffee;
USE zolt_coffee;
SOURCE C:\xampp\htdocs\zolt_coffee\database\zolt_coffee.sql;
```

## 🔧 **PASO 4: Verificar Configuración**

### **URLs de prueba:**
- **Test de conexión:** `http://localhost/zolt_coffee/database/test_connection.php`
- **Debug de registro:** `http://localhost/zolt_coffee/database/debug_registration.php`
- **phpMyAdmin:** `http://localhost/phpmyadmin`

## ⚠️ **PASO 5: Solución de Problemas**

### **Error "Not Found":**
- ✅ Verifica que XAMPP esté ejecutándose
- ✅ Verifica que Apache esté iniciado
- ✅ Verifica que las carpetas estén en `C:\xampp\htdocs\zolt_coffee\`
- ✅ Verifica que los archivos PHP estén copiados correctamente

### **Error de conexión a BD:**
- ✅ Verifica que MySQL esté iniciado en XAMPP
- ✅ Verifica que la base de datos `zolt_coffee` exista
- ✅ Importa el archivo SQL si no existe

### **Error de permisos:**
- ✅ Ejecuta XAMPP como administrador
- ✅ Verifica permisos de la carpeta `uploads`

## 📝 **PASO 6: Configurar PHP (Opcional)**

Edita `C:\xampp\php\php.ini`:
```ini
display_errors = On
error_reporting = E_ALL
log_errors = On
error_log = "C:\xampp\apache\logs\php_error.log"
file_uploads = On
upload_max_filesize = 10M
post_max_size = 10M
```

**Reinicia Apache después de cambiar php.ini**

## 🎯 **PASO 7: Probar Todo**

1. **Verifica estructura:** Las carpetas deben existir en `C:\xampp\htdocs\zolt_coffee\`
2. **Verifica BD:** `http://localhost/phpmyadmin` → Base de datos `zolt_coffee`
3. **Test conexión:** `http://localhost/zolt_coffee/database/test_connection.php`
4. **Test registro:** `http://localhost/zolt_coffee/database/debug_registration.php`
5. **Prueba la app:** Registra un usuario desde React

## 📞 **Si Sigues Teniendo Problemas:**

1. **Toma captura de pantalla** de la estructura de carpetas en `C:\xampp\htdocs\`
2. **Verifica** que XAMPP esté ejecutándose (Apache y MySQL en verde)
3. **Revisa logs** en `C:\xampp\apache\logs\error.log`
4. **Comparte** el error específico que ves

---

**¿Necesitas ayuda?** Sigue estos pasos en orden y comparte en qué paso tienes problemas.