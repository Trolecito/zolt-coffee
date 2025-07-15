import emailjs from '@emailjs/browser';
import { GiftCard, GiftCardOrder } from '../types';

// Configuración de EmailJS (mismas credenciales que emailService.ts)
const EMAILJS_SERVICE_ID = 'service_os378p7';
const EMAILJS_GIFT_CARD_TEMPLATE_ID = 'template_mdwh2oh'; // Necesitas crear este template
const EMAILJS_PUBLIC_KEY = 'HKztzb485ojZ3EhhL';

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendGiftCardEmail = async (
  giftCard: GiftCard, 
  order: GiftCardOrder, 
  giftCode: string
): Promise<boolean> => {
  try {
    console.log('📧 Enviando Gift Card por email...');
    console.log('🎁 Datos:', { giftCard, order, giftCode });

    // Parámetros del template para Gift Card
    const templateParams = {
      // Datos del destinatario
      to_email: order.recipientEmail,
      recipient_name: order.recipientName,
      
      // Datos del remitente
      sender_name: order.senderName,
      sender_email: order.senderEmail,
      
      // Datos de la Gift Card
      gift_card_title: giftCard.title,
      gift_card_description: giftCard.description,
      gift_card_image: giftCard.image,
      gift_card_occasion: giftCard.occasion,
      
      // Datos del pedido
      gift_code: giftCode,
      amount: order.amount.toFixed(2),
      order_date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      
      // Datos de la empresa
      company_name: 'Zolt Coffee',
      company_website: 'www.zoltcoffee.com',
      
      // Mensaje personalizado
      personal_message: `¡Hola ${order.recipientName}! ${order.senderName} te ha enviado una Gift Card de Zolt Coffee para ${giftCard.occasion}. ¡Disfruta del mejor café!`
    };

    console.log('📤 Enviando email con parámetros:', templateParams);

    // Enviar el email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_GIFT_CARD_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Gift Card enviada por email exitosamente:', response);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar Gift Card por email:', error);
    return false;
  }
};

// Función para validar la configuración de EmailJS para Gift Cards
export const validateGiftCardEmailConfig = (): boolean => {
  const isValid = EMAILJS_SERVICE_ID === 'service_os378p7' &&
                  EMAILJS_GIFT_CARD_TEMPLATE_ID === 'template_mdwh2oh' &&
                  EMAILJS_PUBLIC_KEY === 'HKztzb485ojZ3EhhL';
  
  if (!isValid) {
    console.warn('⚠️ EmailJS no está configurado para Gift Cards. Necesitas crear el template template_mdwh2oh');
    console.log('🔍 Valores actuales:', {
      EMAILJS_SERVICE_ID,
      EMAILJS_GIFT_CARD_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY
    });
  }
  
  return isValid;
};

// Función para enviar copia al remitente (opcional)
export const sendGiftCardCopyToSender = async (
  giftCard: GiftCard, 
  order: GiftCardOrder, 
  giftCode: string
): Promise<boolean> => {
  try {
    console.log('📧 Enviando copia al remitente...');

    const templateParams = {
      to_email: order.senderEmail,
      recipient_name: order.senderName,
      sender_name: order.senderName,
      sender_email: order.senderEmail,
      gift_card_title: giftCard.title,
      gift_card_description: giftCard.description,
      gift_card_image: giftCard.image,
      gift_card_occasion: giftCard.occasion,
      gift_code: giftCode,
      amount: order.amount.toFixed(2),
      order_date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      company_name: 'Zolt Coffee',
      company_website: 'www.zoltcoffee.com',
      personal_message: `Confirmación: Has enviado exitosamente una Gift Card de $${order.amount} a ${order.recipientName}. Código: ${giftCode}`
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_GIFT_CARD_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Copia enviada al remitente exitosamente:', response);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar copia al remitente:', error);
    return false;
  }
};