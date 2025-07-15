import { useState, useEffect } from 'react';
import { CartItem } from '../types';

export const useCartPersistence = (userId?: string) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    if (userId) {
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log('🛒 Carrito cargado para usuario:', userId, parsedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('❌ Error al cargar carrito:', error);
          localStorage.removeItem(`cart_${userId}`);
        }
      }
    } else {
      // Si no hay usuario, cargar carrito temporal
      const tempCart = localStorage.getItem('temp_cart');
      if (tempCart) {
        try {
          const parsedCart = JSON.parse(tempCart);
          console.log('🛒 Carrito temporal cargado:', parsedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('❌ Error al cargar carrito temporal:', error);
          localStorage.removeItem('temp_cart');
        }
      }
    }
  }, [userId]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (userId) {
      // Guardar carrito del usuario autenticado
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
      console.log('💾 Carrito guardado para usuario:', userId);
      
      // Limpiar carrito temporal si existe
      localStorage.removeItem('temp_cart');
    } else {
      // Guardar carrito temporal para usuarios no autenticados
      localStorage.setItem('temp_cart', JSON.stringify(cartItems));
      console.log('💾 Carrito temporal guardado');
    }
  }, [cartItems, userId]);

  // Transferir carrito temporal al usuario cuando se autentique
  const transferTempCart = (newUserId: string) => {
    const tempCart = localStorage.getItem('temp_cart');
    if (tempCart && newUserId) {
      try {
        const parsedTempCart = JSON.parse(tempCart);
        
        // Combinar con carrito existente del usuario si lo hay
        const userCart = localStorage.getItem(`cart_${newUserId}`);
        let combinedCart = parsedTempCart;
        
        if (userCart) {
          const parsedUserCart = JSON.parse(userCart);
          // Combinar carritos evitando duplicados
          combinedCart = [...parsedUserCart];
          
          parsedTempCart.forEach((tempItem: CartItem) => {
            const existingItem = combinedCart.find(
              (item: CartItem) => item.product.id === tempItem.product.id
            );
            
            if (existingItem) {
              existingItem.quantity += tempItem.quantity;
            } else {
              combinedCart.push(tempItem);
            }
          });
        }
        
        setCartItems(combinedCart);
        localStorage.setItem(`cart_${newUserId}`, JSON.stringify(combinedCart));
        localStorage.removeItem('temp_cart');
        
        console.log('🔄 Carrito temporal transferido al usuario:', newUserId);
      } catch (error) {
        console.error('❌ Error al transferir carrito temporal:', error);
      }
    }
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    } else {
      localStorage.removeItem('temp_cart');
    }
    console.log('🗑️ Carrito limpiado');
  };

  return {
    cartItems,
    setCartItems,
    transferTempCart,
    clearCart
  };
};