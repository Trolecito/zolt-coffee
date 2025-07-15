-- Base de datos para Zolt Coffee
-- Creado para MySQL/MariaDB con XAMPP

CREATE DATABASE IF NOT EXISTS zolt_coffee;
USE zolt_coffee;

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de categorías de productos
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla de sedes/tiendas
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    hours TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    pickup_person_name VARCHAR(100) NOT NULL,
    ticket_email VARCHAR(150) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    estimated_time VARCHAR(50),
    payment_method VARCHAR(50) DEFAULT 'credit_card',
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE RESTRICT
);

-- Tabla de items del pedido
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabla de información de pago
CREATE TABLE payment_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    cardholder_name VARCHAR(100) NOT NULL,
    card_last_four VARCHAR(4) NOT NULL,
    billing_street VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_zip_code VARCHAR(20),
    billing_country VARCHAR(100) DEFAULT 'México',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Tabla de gift cards
CREATE TABLE gift_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes de gift cards
CREATE TABLE gift_card_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gift_card_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(150) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    status ENUM('pending', 'sent', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gift_card_id) REFERENCES gift_cards(id) ON DELETE RESTRICT
);

-- Tabla de sesiones de usuario (opcional para manejo de sesiones)
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar categorías por defecto
INSERT INTO categories (name, slug, description, icon) VALUES
('Café', 'cafe', 'Bebidas de café calientes y tradicionales', 'Coffee'),
('Frappes', 'frappes', 'Bebidas de café frías y refrescantes', 'Zap'),
('Malteadas', 'malteadas', 'Malteadas cremosas y deliciosas', 'IceCream'),
('Snacks', 'snacks', 'Acompañamientos y bocadillos', 'Cookie');

-- Insertar sedes por defecto
INSERT INTO stores (name, address, phone, hours) VALUES
('Zolt Coffee Centro', 'Av. Juárez 123, Centro Histórico, Ciudad de México', '+52 555 123 4567', 'Lun-Vie: 7:00-22:00, Sáb-Dom: 8:00-23:00'),
('Zolt Coffee Polanco', 'Av. Presidente Masaryk 456, Polanco, Ciudad de México', '+52 555 234 5678', 'Lun-Vie: 6:30-23:00, Sáb-Dom: 7:00-23:30'),
('Zolt Coffee Roma Norte', 'Av. Álvaro Obregón 789, Roma Norte, Ciudad de México', '+52 555 345 6789', 'Lun-Dom: 7:00-22:30'),
('Zolt Coffee Condesa', 'Av. Michoacán 321, Condesa, Ciudad de México', '+52 555 456 7890', 'Lun-Vie: 7:30-22:00, Sáb-Dom: 8:00-23:00'),
('Zolt Coffee Santa Fe', 'Av. Santa Fe 654, Santa Fe, Ciudad de México', '+52 555 567 8901', 'Lun-Vie: 6:00-22:00, Sáb-Dom: 8:00-21:00'),
('Zolt Coffee Coyoacán', 'Av. Universidad 987, Coyoacán, Ciudad de México', '+52 555 678 9012', 'Lun-Dom: 8:00-22:00');

-- Insertar productos por defecto
INSERT INTO products (name, description, price, image, category_id, featured) VALUES
-- Café
('Cappuccino Clásico', 'Espresso con leche vaporizada y espuma cremosa', 45.00, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 1, TRUE),
('Americano', 'Espresso doble con agua caliente', 35.00, 'https://images.pexels.com/photos/1338776/pexels-photo-1338776.jpeg?auto=compress&cs=tinysrgb&w=400', 1, FALSE),
('Latte Vainilla', 'Espresso con leche vaporizada y jarabe de vainilla', 50.00, 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=400', 1, TRUE),
('Espresso Doble', 'Doble shot de espresso puro', 30.00, 'https://images.pexels.com/photos/1340863/pexels-photo-1340863.jpeg?auto=compress&cs=tinysrgb&w=400', 1, FALSE),

-- Frappes
('Frappe Caramelo', 'Café helado con caramelo y crema batida', 65.00, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 2, TRUE),
('Frappe Moca', 'Café helado con chocolate y crema', 70.00, 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400', 2, FALSE),
('Frappe Vainilla', 'Café helado con vainilla y crema batida', 60.00, 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400', 2, FALSE),

-- Malteadas
('Malteada Chocolate', 'Cremosa malteada de chocolate con crema', 75.00, 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400', 3, TRUE),
('Malteada Fresa', 'Malteada de fresa natural con crema', 70.00, 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400', 3, FALSE),
('Malteada Vainilla', 'Clásica malteada de vainilla', 65.00, 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400', 3, FALSE),

-- Snacks
('Croissant Jamón y Queso', 'Croissant horneado con jamón y queso', 55.00, 'https://images.pexels.com/photos/1003923/pexels-photo-1003923.jpeg?auto=compress&cs=tinysrgb&w=400', 4, FALSE),
('Muffin Arándanos', 'Muffin casero con arándanos frescos', 40.00, 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=400', 4, FALSE),
('Sandwich Club', 'Sandwich de pollo, tocino y verduras', 85.00, 'https://images.pexels.com/photos/1209029/pexels-photo-1209029.jpeg?auto=compress&cs=tinysrgb&w=400', 4, FALSE),
('Cheesecake', 'Rebanada de cheesecake con frutos rojos', 60.00, 'https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&w=400', 4, FALSE);

-- Insertar gift cards por defecto
INSERT INTO gift_cards (title, occasion, image, description) VALUES
('Tarjeta Cumpleaños', 'cumpleanos', 'https://images.pexels.com/photos/1857157/pexels-photo-1857157.jpeg?auto=compress&cs=tinysrgb&w=400', 'Celebra con el mejor café en su día especial'),
('Tarjeta Buen Día', 'buendia', 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=400', 'Comparte un momento especial con café de calidad'),
('Tarjeta Festejo', 'festejo', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400', 'Para celebrar los momentos más importantes'),
('Tarjeta Agradecimiento', 'agradecimiento', 'https://images.pexels.com/photos/1634279/pexels-photo-1634279.jpeg?auto=compress&cs=tinysrgb&w=400', 'Expresa tu gratitud con un delicioso café'),
('Tarjeta Felicitaciones', 'felicitaciones', 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400', 'Celebra sus logros con el mejor café'),
('Tarjeta Amor', 'amor', 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400', 'Comparte un momento romántico con café especial');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_ticket ON orders(ticket_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);