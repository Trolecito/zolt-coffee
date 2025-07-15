import React, { useState } from 'react';
import { Gift, ArrowLeft, Mail, User, DollarSign } from 'lucide-react';
import { GiftCard, GiftCardOrder } from '../types';
import { sendGiftCardEmail, sendGiftCardCopyToSender, validateGiftCardEmailConfig } from '../services/giftCardEmailService';

const GiftCards: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Partial<GiftCardOrder>>({
    amount: 100,
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: ''
  });

  const amounts = [50, 100, 200, 300, 500];

  // Cargar gift cards al montar el componente
  React.useEffect(() => {
    loadGiftCards();
  }, []);

  const loadGiftCards = async () => {
    try {
      const response = await fetch('http://localhost/zolt_coffee/api/gift_cards.php');
      const data = await response.json();
      
      if (data.success) {
        setGiftCards(data.gift_cards);
      } else {
        console.error('Error al cargar gift cards:', data.message);
        // Fallback a datos locales si falla la API
        const { giftCards: localGiftCards } = await import('../data/giftCards');
        setGiftCards(localGiftCards);
      }
    } catch (error) {
      console.error('Error al cargar gift cards:', error);
      // Fallback a datos locales si falla la API
      const { giftCards: localGiftCards } = await import('../data/giftCards');
      setGiftCards(localGiftCards);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCard && order.amount && order.recipientName && order.recipientEmail && order.senderName && order.senderEmail) {
      submitGiftCardOrder();
    }
  };

  const submitGiftCardOrder = async () => {
    try {
      console.log('🎁 Enviando gift card order...');
      
      const orderData = {
        gift_card_id: parseInt(selectedCard!.id),
        amount: order.amount,
        recipient_name: order.recipientName,
        recipient_email: order.recipientEmail,
        sender_name: order.senderName,
        sender_email: order.senderEmail
      };

      console.log('📦 Datos de la gift card order:', orderData);

      const response = await fetch('http://localhost/zolt_coffee/api/gift_cards.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      console.log('📥 Status de respuesta:', response.status);
      const data = await response.json();
      console.log('📥 Respuesta de la API:', data);

      if (data.success) {
        console.log('🎁 Gift Card creada, enviando por email...');
        
        // Enviar Gift Card por email
        if (validateGiftCardEmailConfig()) {
          try {
            // Enviar al destinatario
            const emailSent = await sendGiftCardEmail(
              data.gift_card, 
              {
                ...order,
                id: data.order_id,
                giftCardId: selectedCard!.id,
                giftCode: data.gift_code,
                status: 'sent',
                createdAt: new Date().toISOString()
              } as GiftCardOrder, 
              data.gift_code
            );
            
            // Enviar copia al remitente
            const copySent = await sendGiftCardCopyToSender(
              data.gift_card,
              {
                ...order,
                id: data.order_id,
                giftCardId: selectedCard!.id,
                giftCode: data.gift_code,
                status: 'sent',
                createdAt: new Date().toISOString()
              } as GiftCardOrder,
              data.gift_code
            );
            
            if (emailSent) {
              alert(`✅ ¡Gift Card enviada exitosamente!\n\n🎁 Código: ${data.gift_code}\n📧 Enviada por email a: ${order.recipientEmail}\n📋 Copia enviada a: ${order.senderEmail}`);
            } else {
              alert(`✅ ¡Gift Card creada exitosamente!\n\n🎁 Código: ${data.gift_code}\n⚠️ Error al enviar email, pero la Gift Card está lista para usar.`);
            }
          } catch (emailError) {
            console.error('❌ Error en envío de email:', emailError);
            alert(`✅ ¡Gift Card creada exitosamente!\n\n🎁 Código: ${data.gift_code}\n⚠️ Error al enviar email, pero la Gift Card está lista para usar.`);
          }
        } else {
          alert(`✅ ¡Gift Card creada exitosamente!\n\n🎁 Código: ${data.gift_code}\n⚠️ Servicio de email no configurado.`);
        }
        
        // Limpiar formulario
        setSelectedCard(null);
        setOrder({
          amount: 100,
          recipientName: '',
          recipientEmail: '',
          senderName: '',
          senderEmail: ''
        });
      } else {
        console.error('❌ Error de la API:', data);
        alert(`❌ Error al enviar gift card: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al enviar gift card:', error);
      alert('❌ Error al enviar gift card. Por favor intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C8355] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Gift Cards...</p>
        </div>
      </div>
    );
  }

  if (selectedCard) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setSelectedCard(null)}
            className="flex items-center space-x-2 text-[#9C8355] hover:text-[#5D3A1A] mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Gift Cards</span>
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gift Card Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#5D3A1A] mb-4">Vista Previa</h2>
                <div className="relative">
                  <img
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{selectedCard.title}</h3>
                    <p className="text-sm">{selectedCard.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#9C8355] text-white px-3 py-1 rounded-full font-semibold">
                    ${order.amount}
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#5D3A1A] mb-6">Personalizar Gift Card</h2>
                
                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Monto del Regalo
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {amounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setOrder({ ...order, amount })}
                          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                            order.amount === amount
                              ? 'bg-[#9C8355] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Para:</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Nombre/Apodo
                        </label>
                        <input
                          type="text"
                          value={order.recipientName}
                          onChange={(e) => setOrder({ ...order, recipientName: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          value={order.recipientEmail}
                          onChange={(e) => setOrder({ ...order, recipientEmail: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sender Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">De parte de:</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Nombre/Apodo
                        </label>
                        <input
                          type="text"
                          value={order.senderName}
                          onChange={(e) => setOrder({ ...order, senderName: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          value={order.senderEmail}
                          onChange={(e) => setOrder({ ...order, senderEmail: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#9C8355] text-white py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors"
                  >
                    Enviar Gift Card
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#9C8355] rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#5D3A1A] mb-4">Gift Cards</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comparte la experiencia Zolt Coffee con tus seres queridos. 
            Elige la ocasión perfecta y sorpréndelos con el regalo del mejor café.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => setSelectedCard(card)}
            >
              <div className="relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-200">{card.description}</p>
                </div>
              </div>
              <div className="p-6">
                <button className="w-full bg-[#9C8355] text-white py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors">
                  Personalizar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftCards;