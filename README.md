# Zolt Coffee - Sistema de Pedidos

Una aplicación web moderna para pedidos de café con sistema de tickets y notificaciones por email.

## Características

- 🛒 Sistema de carrito de compras
- 📧 Envío de tickets por email
- 🏪 Selección de sedes para recogida
- 💳 Procesamiento de pagos
- 🎫 Generación de tickets de recogida
- 👤 Sistema de autenticación de usuarios
- 🎁 Sistema de gift cards

## Configuración de EmailJS

Para habilitar el envío de emails, necesitas configurar EmailJS:

### 1. Crear cuenta en EmailJS
1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Crea un nuevo servicio (Gmail, Outlook, etc.)

### 2. Configurar el template de email
Crea un template con los siguientes parámetros:

```
Asunto: Ticket de Recogida - Zolt Coffee #{{ticket_number}}

Hola,

Tu pedido ha sido confirmado exitosamente. Aquí están los detalles:

INFORMACIÓN DEL PEDIDO:
- Número de Ticket: {{ticket_number}}
- Fecha del Pedido: {{order_date}}
- Tiempo Estimado: {{estimated_time}}

PERSONA QUE RECOGE:
{{pickup_person}}

SEDE SELECCIONADA:
{{store_name}}
{{store_address}}
Teléfono: {{store_phone}}
Horarios: {{store_hours}}

PRODUCTOS:
{{items_list}}

TOTAL: ${{total_amount}}

INSTRUCCIONES:
- Presenta este email al llegar a la sede
- La persona indicada debe presentar identificación
- El pedido estará listo en el tiempo estimado

¡Gracias por elegir {{company_name}}!
```

### 3. Actualizar configuración
Edita el archivo `src/services/emailService.ts` y reemplaza:

```typescript
const EMAILJS_SERVICE_ID = 'tu_service_id';
const EMAILJS_TEMPLATE_ID = 'tu_template_id'; 
const EMAILJS_PUBLIC_KEY = 'tu_public_key';
```

### 4. Variables de entorno (Opcional)
Para mayor seguridad, puedes usar variables de entorno:

```bash
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

## Instalación

```bash
npm install
npm run dev
```

## Tecnologías Utilizadas

- React + TypeScript
- Tailwind CSS
- Lucide React (iconos)
- EmailJS (envío de emails)
- Vite (build tool)

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales
├── data/               # Datos mock
├── services/           # Servicios (email, etc.)
├── types/              # Definiciones de TypeScript
└── App.tsx             # Componente principal
```

## Funcionalidades Principales

### Sistema de Pedidos
1. Selección de productos
2. Gestión de carrito
3. Selección de sede
4. Procesamiento de pago
5. Generación de ticket
6. Envío por email

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Perfil de usuario
- Gestión de cuenta

### Gift Cards
- Selección de diseños
- Personalización
- Envío por email

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
