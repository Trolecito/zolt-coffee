import emailjs from '@emailjs/browser';
import { OrderTicket } from '../types';

// Configuración de EmailJS
const EMAILJS_SERVICE_ID = 'service_os378p7'; // Reemplazar con tu Service ID
const EMAILJS_TEMPLATE_ID = 'template_5dweyd6'; // Reemplazar con tu Template ID
const EMAILJS_PUBLIC_KEY = 'HKztzb485ojZ3EhhL'; // Reemplazar con tu Public Key

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendTicketEmail = async (ticket: OrderTicket, recipientEmail: string): Promise<boolean> => {
  try {
    // Formatear los items del pedido para el email
    const itemsList = ticket.items.map(item => 
      `- ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('<br>');
    

    // Parámetros del template
    const templateParams = {
      to_email: recipientEmail,
      ticket_number: ticket.ticketNumber,
      order_date: ticket.orderDate,
      pickup_person: ticket.pickupPersonName,
      store_name: ticket.store.name,
      store_address: ticket.store.address,
      store_phone: ticket.store.phone,
      store_hours: ticket.store.hours,
      items_list: itemsList,
      total_amount: ticket.total.toFixed(2),
      estimated_time: ticket.estimatedTime,
      company_name: 'Zolt Coffee'
    };

    // Enviar el email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email enviado exitosamente:', response);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

// Función para validar la configuración de EmailJS
export const validateEmailJSConfig = (): boolean => {
  return EMAILJS_SERVICE_ID === 'service_os378p7' &&
         EMAILJS_TEMPLATE_ID === 'template_5dweyd6' &&
         EMAILJS_PUBLIC_KEY === 'HKztzb485ojZ3EhhL';
};
