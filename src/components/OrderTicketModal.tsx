import React from 'react';
import { X, Download, Printer as Print, MapPin, Clock, User, Coffee, Calendar } from 'lucide-react';
import { OrderTicket } from '../types';

interface OrderTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: OrderTicket | null;
}

const OrderTicketModal: React.FC<OrderTicketModalProps> = ({
  isOpen,
  onClose,
  ticket
}) => {
  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulate download functionality
    const element = document.createElement('a');
    const file = new Blob([`
ZOLT COFFEE - TICKET DE RECOGIDA
================================

Número de Ticket: ${ticket.ticketNumber}
Fecha del Pedido: ${ticket.orderDate}
Tiempo Estimado: ${ticket.estimatedTime}

SEDE SELECCIONADA:
${ticket.store.name}
${ticket.store.address}
${ticket.store.phone}

PERSONA QUE RECOGE:
${ticket.pickupPersonName}

PRODUCTOS:
${ticket.items.map(item => `- ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}

TOTAL: $${ticket.total.toFixed(2)}

¡Gracias por elegir Zolt Coffee!
    `], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ticket-${ticket.ticketNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Coffee className="w-6 h-6 text-[#9C8355]" />
            <h2 className="text-2xl font-bold text-[#5D3A1A]">Ticket de Recogida</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Ticket Content */}
        <div className="p-6" id="ticket-content">
          {/* Success Message */}
          <div className="text-center mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">¡Pedido Confirmado!</h3>
            <p className="text-green-700">Tu pedido ha sido procesado exitosamente</p>
            <p className="text-green-600 text-sm mt-2">
              El ticket también ha sido enviado por correo electrónico
            </p>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#5D3A1A] mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Información del Pedido
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Ticket:</span> #{ticket.ticketNumber}</p>
                  <p><span className="font-medium">Fecha:</span> {ticket.orderDate}</p>
                  <p><span className="font-medium">Tiempo Estimado:</span> {ticket.estimatedTime}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#5D3A1A] mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Persona que Recoge
                </h4>
                <p className="text-lg font-medium text-[#9C8355]">{ticket.pickupPersonName}</p>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-[#9C8355]/10 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-[#5D3A1A] mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Sede de Recogida
            </h4>
            <div className="space-y-2">
              <p className="font-semibold text-[#5D3A1A]">{ticket.store.name}</p>
              <p className="text-gray-700">{ticket.store.address}</p>
              <p className="text-gray-700">{ticket.store.phone}</p>
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-4 h-4" />
                <span>{ticket.store.hours}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-bold text-[#5D3A1A] mb-3">Productos Ordenados</h4>
            <div className="space-y-3">
              {ticket.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
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
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-[#5D3A1A]">Total:</span>
              <span className="text-2xl font-bold text-[#9C8355]">${ticket.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">Instrucciones Importantes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Presenta este ticket al llegar a la sede</li>
              <li>• La persona indicada debe presentar identificación</li>
              <li>• El pedido estará listo en el tiempo estimado</li>
              <li>• Conserva este ticket hasta recoger tu pedido</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t p-6 flex space-x-4">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <Print className="w-5 h-5" />
            <span>Imprimir</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#9C8355] text-white py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Descargar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTicketModal;