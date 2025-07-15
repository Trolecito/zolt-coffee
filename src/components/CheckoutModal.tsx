import React, { useState } from 'react';
import { X, CreditCard, MapPin, User, Calendar, Lock, Mail } from 'lucide-react';
import { CartItem, PaymentForm, Store } from '../types';
import { mexicoStates, mexicoCities } from '../data/mexicoStates';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedStore: Store;
  onConfirmOrder: (paymentInfo: PaymentForm) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedStore,
  onConfirmOrder
}) => {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    pickupPersonName: '',
    ticketEmail: '',
    billingAddress: {
      street: '',
      city: '',
      state: 'CDMX',
      zipCode: '',
      country: 'México'
    }
  });
  const [selectedStateCode, setSelectedStateCode] = useState('CDMX');

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPaymentForm(prev => {
        const parentObj = prev[parent as keyof PaymentForm];
        if (typeof parentObj === 'object' && parentObj !== null) {
          // Si cambia el estado, resetear la ciudad
          if (child === 'state') {
            setSelectedStateCode(value);
            return {
              ...prev,
              [parent]: {
                ...parentObj,
                [child]: value,
                city: '' // Resetear ciudad cuando cambia el estado
              }
            };
          }
          return {
        ...prev,
            [parent]: {
              ...parentObj,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setPaymentForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmOrder(paymentForm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-[#9C8355]" />
            <h2 className="text-2xl font-bold text-[#5D3A1A]">Finalizar Compra</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Order Summary */}
          <div>
            <h3 className="text-xl font-bold text-[#5D3A1A] mb-4">Resumen del Pedido</h3>
            
            {/* Store Information */}
            <div className="bg-[#9C8355]/10 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-[#5D3A1A] mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Sede de Recogida
              </h4>
              <p className="font-medium text-[#5D3A1A]">{selectedStore.name}</p>
              <p className="text-sm text-gray-600">{selectedStore.address}</p>
              <p className="text-sm text-gray-600">{selectedStore.phone}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-[#5D3A1A]">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-[#9C8355]">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-[#5D3A1A]">Total:</span>
                <span className="text-2xl font-bold text-[#9C8355]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h3 className="text-xl font-bold text-[#5D3A1A] mb-4">Información de Pago</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Persona que Recogerá el Pedido
                  </label>
                  <input
                    type="text"
                    value={paymentForm.pickupPersonName}
                    onChange={(e) => handleInputChange('pickupPersonName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                    placeholder="Nombre completo de quien recogerá"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Correo para Recibir el Ticket *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Se enviará una copia digital del ticket a este correo
                  </p>
                  <input
                    type="email"
                    value={paymentForm.ticketEmail}
                    onChange={(e) => handleInputChange('ticketEmail', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                    placeholder="tu-email@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                    placeholder="Nombre como aparece en la tarjeta"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    * Los datos de tarjeta están deshabilitados para esta demo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="text"
                      value={paymentForm.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                      placeholder="MM/AA"
                      maxLength={5}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                      placeholder="123"
                      maxLength={4}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-[#5D3A1A] mb-3">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Dirección de Facturación
                </h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={paymentForm.billingAddress.street}
                    onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                    placeholder="Calle y número"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={paymentForm.billingAddress.city}
                      onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona una ciudad</option>
                      {mexicoCities[selectedStateCode as keyof typeof mexicoCities]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <select
                      value={paymentForm.billingAddress.state}
                      onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                      required
                    >
                      {mexicoStates.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={paymentForm.billingAddress.zipCode}
                      onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                      placeholder="Código Postal"
                      required
                    />
                    <input
                      type="text"
                      value={paymentForm.billingAddress.country}
                      onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                      placeholder="México"
                      defaultValue="México"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#9C8355] text-white py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors mt-6"
              >
                Confirmar Pedido - ${total.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;