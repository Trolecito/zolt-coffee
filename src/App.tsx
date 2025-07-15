import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import CartModal from './components/CartModal';
import StoreSelectionModal from './components/StoreSelectionModal';
import CheckoutModal from './components/CheckoutModal';
import OrderTicketModal from './components/OrderTicketModal';
import ProductModal from './components/ProductModal';
import CartAnimation from './components/CartAnimation';
import Home from './pages/Home';
import Menu from './pages/Menu';
import GiftCards from './pages/GiftCards';
import { sendTicketEmail, validateEmailJSConfig } from './services/emailService';
import { useCartPersistence } from './hooks/useCartPersistence';
import { User, PaymentForm, Product, Store, OrderTicket } from './types';

interface ProductOptions {
  [key: string]: string | string[];
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });
  const [profileModal, setProfileModal] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [storeSelectionModal, setStoreSelectionModal] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentTicket, setCurrentTicket] = useState<OrderTicket | null>(null);
  
  // Animation states
  const [cartAnimation, setCartAnimation] = useState({
    isVisible: false,
    productImage: '',
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 }
  });

  // Hook para persistencia del carrito
  const { cartItems, setCartItems, transferTempCart, clearCart } = useCartPersistence(user?.id);

  // Cargar usuario desde localStorage al iniciar
  React.useEffect(() => {
    console.log('🔄 Cargando usuario desde localStorage...');
    const sessionToken = localStorage.getItem('session_token');
    const userData = localStorage.getItem('user_data');
    
    if (sessionToken && userData) {
      console.log('📄 Datos encontrados en localStorage');
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ Usuario cargado:', parsedUser.name);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Error al cargar datos del usuario:', error);
        localStorage.removeItem('session_token');
        localStorage.removeItem('user_data');
      }
    } else {
      console.log('ℹ️ No hay datos de usuario en localStorage');
    }
  }, []);

  const handleAuthRequired = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const handleAuthAction = (action: 'login' | 'register' | 'profile') => {
    if (action === 'profile') {
      setProfileModal(true);
    } else {
      setAuthModal({ isOpen: true, mode: action });
    }
  };

  const handleAuthSubmit = (userData: User) => {
    // Guardar datos del usuario en localStorage
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // Transferir carrito temporal si existe
    if (userData.id) {
      transferTempCart(userData.id);
    }
    
    setUser(userData);
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    // Limpiar datos del localStorage
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
    
    // Limpiar carrito del usuario
    if (user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    
    setUser(null);
    setCartItems([]);
    setProfileModal(false);
  };

  const handleDeleteAccount = () => {
    // Limpiar datos del localStorage
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
    
    // Limpiar carrito del usuario
    if (user?.id) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    
    setUser(null);
    setCartItems([]);
    setProfileModal(false);
  };

  const addToCart = (product: Product, options?: ProductOptions, quantity: number = 1) => {
    // Trigger cart animation
    const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
    const cartElement = document.querySelector('.cart-icon > div');
    
    if (productElement && cartElement) {
      const productRect = productElement.getBoundingClientRect();
      const cartRect = cartElement.getBoundingClientRect();
      
      setCartAnimation({
        isVisible: true,
        productImage: product.image,
        startPosition: {
          x: productRect.left + productRect.width / 2 - 40,
          y: productRect.top + productRect.height / 2 - 40
        },
        endPosition: {
          x: cartRect.left + cartRect.width / 2 - 40,
          y: cartRect.top + cartRect.height / 2 - 40
        }
      });
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { id: Date.now().toString(), product, quantity }];
      }
    });

    // Trigger cart bounce animation
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
      cartBadge.classList.remove('animate-bounce');
      setTimeout(() => {
        cartBadge.classList.add('animate-bounce');
      }, 100);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductModal(true);
  };

  const handleCartAnimationComplete = () => {
    setCartAnimation(prev => ({ ...prev, isVisible: false }));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // Validar que el usuario esté autenticado
    if (!user) {
      alert('⚠️ Debes iniciar sesión para realizar una compra');
      setCartModal(false);
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    
    setCartModal(false);
    setStoreSelectionModal(true);
  };

  const handleStoreSelection = (store: Store) => {
    setSelectedStore(store);
    setStoreSelectionModal(false);
    setCheckoutModal(true);
  };

  const handleConfirmOrder = (paymentInfo: PaymentForm) => {
    if (!selectedStore) return;
    
    // Validar que el usuario esté autenticado
    if (!user) {
      alert('⚠️ Debes iniciar sesión para realizar una compra');
      return;
    }

    // Generate ticket
    const ticketNumber = `ZC${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const estimatedTime = '15-20 minutos';
    
    const ticket: OrderTicket = {
      ticketNumber,
      orderDate,
      pickupPersonName: paymentInfo.pickupPersonName,
      store: selectedStore,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      estimatedTime
    };
    
    setCurrentTicket(ticket);
    
    // Guardar orden en la base de datos
    saveOrderToDatabase(ticket, paymentInfo)
      .then((success) => {
        if (success) {
          console.log('✅ Orden guardada en la base de datos');
          
          // Enviar ticket por email
          if (validateEmailJSConfig()) {
            sendTicketEmail(ticket, paymentInfo.ticketEmail)
              .then((emailSuccess) => {
                if (emailSuccess) {
                  alert(`✅ Pedido confirmado y ticket enviado a: ${paymentInfo.ticketEmail}`);
                } else {
                  alert(`✅ Pedido confirmado. Error al enviar email, pero puedes descargar el ticket.`);
                }
                
                clearCart();
                setCheckoutModal(false);
                setTicketModal(true);
              });
          } else {
            alert(`✅ Pedido confirmado. Servicio de email no configurado.`);
            clearCart();
            setCheckoutModal(false);
            setTicketModal(true);
          }
        } else {
          alert(`❌ Error al procesar el pedido. Por favor intenta nuevamente.`);
        }
      })
      .catch((error) => {
        console.error('❌ Error al guardar orden:', error);
        alert(`❌ Error al procesar el pedido. Por favor intenta nuevamente.`);
      });
  };

  const saveOrderToDatabase = async (ticket: OrderTicket, paymentInfo: PaymentForm): Promise<boolean> => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        throw new Error('No hay sesión activa');
      }

      const orderData = {
        store_id: ticket.store.id,
        ticket_number: ticket.ticketNumber,
        pickup_person_name: ticket.pickupPersonName,
        ticket_email: paymentInfo.ticketEmail,
        total: ticket.total,
        estimated_time: ticket.estimatedTime,
        items: ticket.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        })),
        payment: {
          cardholder_name: paymentInfo.cardholderName,
          card_number: paymentInfo.cardNumber,
          billing_address: paymentInfo.billingAddress
        }
      };

      console.log('📡 Enviando orden a la base de datos...', orderData);

      const response = await fetch('http://localhost/zolt_coffee/api/orders.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('📥 Respuesta de la API:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error del servidor');
      }

      return data.success;
    } catch (error) {
      console.error('❌ Error al guardar orden:', error);
      return false;
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} onAddToCart={addToCart} onViewProduct={handleViewProduct} user={user} onAuthRequired={handleAuthRequired} />;
      case 'menu':
        return <Menu onAddToCart={addToCart} onViewProduct={handleViewProduct} user={user} onAuthRequired={handleAuthRequired} />;
      case 'gift-cards':
        return <GiftCards />;
      default:
        return <Home onPageChange={setCurrentPage} onAddToCart={addToCart} onViewProduct={handleViewProduct} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        user={user}
        onAuthAction={handleAuthAction}
        cartItemsCount={cartItemsCount}
        onCartClick={() => setCartModal(true)}
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
      
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSubmit={handleAuthSubmit}
        onSwitchMode={() => setAuthModal({ 
          ...authModal, 
          mode: authModal.mode === 'login' ? 'register' : 'login' 
        })}
      />
      
      {user && (
        <UserProfile
          isOpen={profileModal}
          user={user}
          onClose={() => setProfileModal(false)}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onUserUpdate={handleUserUpdate}
        />
      )}
      
      <CartModal
        isOpen={cartModal}
        onClose={() => setCartModal(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      <StoreSelectionModal
        isOpen={storeSelectionModal}
        onClose={() => setStoreSelectionModal(false)}
        onSelectStore={handleStoreSelection}
      />
      
      <CheckoutModal
        isOpen={checkoutModal}
        onClose={() => setCheckoutModal(false)}
        items={cartItems}
        selectedStore={selectedStore!}
        onConfirmOrder={handleConfirmOrder}
      />
      
      <OrderTicketModal
        isOpen={ticketModal}
        onClose={() => setTicketModal(false)}
        ticket={currentTicket}
      />
      
      <ProductModal
        isOpen={productModal}
        product={selectedProduct}
        onClose={() => {
          setProductModal(false);
          setSelectedProduct(null);
        }}
        onAddToCart={addToCart}
        user={user}
        onAuthRequired={handleAuthRequired}
      />
      
      <CartAnimation
        isVisible={cartAnimation.isVisible}
        productImage={cartAnimation.productImage}
        startPosition={cartAnimation.startPosition}
        endPosition={cartAnimation.endPosition}
        onComplete={handleCartAnimationComplete}
      />
    </div>
  );
}

export default App;