import React, { useEffect, useState } from 'react';

interface CartAnimationProps {
  isVisible: boolean;
  productImage: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

const CartAnimation: React.FC<CartAnimationProps> = ({
  isVisible,
  productImage,
  startPosition,
  endPosition,
  onComplete
}) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimationClass('animate-cart-fly');
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const deltaX = endPosition.x - startPosition.x;
  const deltaY = endPosition.y - startPosition.y;

  return (
    <>
      <style>{`
        @keyframes cart-fly-${Date.now()} {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(${deltaX * 0.5}px, ${deltaY * 0.5}px) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(${deltaX}px, ${deltaY}px) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
      
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          width: '80px',
          height: '80px',
          animation: `cart-fly-${Date.now()} 0.8s ease-in-out forwards`
        }}
      >
        <img
          src={productImage}
          alt="Product flying to cart"
          className="w-full h-full object-cover rounded-full border-4 border-[#9C8355] shadow-2xl"
        />
      </div>
    </>
  );
};

export default CartAnimation;