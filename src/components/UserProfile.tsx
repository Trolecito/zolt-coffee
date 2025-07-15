import React, { useState } from 'react';
import { X, User, Mail, Calendar, LogOut, Trash2, Upload, Camera, Package, Clock } from 'lucide-react';
import { User as UserType } from '../types';

interface Order {
  id: string;
  ticket_number: string;
  total: number;
  status: string;
  created_at: string;
  store_name: string;
  estimated_time: string;
  items: Array<{
    product_name: string;
    quantity: number;
    total_price: number;
  }>;
}

interface UserProfileProps {
  isOpen: boolean;
  user: UserType;
  onClose: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onUserUpdate: (updatedUser: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  isOpen, 
  user, 
  onClose, 
  onLogout, 
  onDeleteAccount,
  onUserUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  if (!isOpen) return null;

  const loadUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) return;

      const response = await fetch('http://localhost/zolt_coffee/api/orders.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleShowOrders = () => {
    setShowOrders(true);
    loadUserOrders();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      onDeleteAccount();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones del archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WEBP');
      return;
    }

    if (file.size > maxSize) {
      setUploadError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('user_id', user.id);

      console.log('📤 Subiendo foto de perfil...');
      const response = await fetch('http://localhost/zolt_coffee/api/upload_profile.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al subir la imagen');
      }

      if (data.success) {
        // Actualizar el usuario con la nueva foto
        const updatedUser = { ...user, avatar: data.avatar_url };
        
        // Actualizar localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        
        // Notificar al componente padre
        onUserUpdate(updatedUser);
        
        console.log('✅ Foto de perfil actualizada exitosamente');
        alert('✅ Foto de perfil actualizada exitosamente');
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error al subir foto:', error);
      setUploadError(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#5D3A1A]">
            {showOrders ? 'Mis Pedidos' : 'Mi Perfil'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {!showOrders ? (
            <>
          {/* Avatar and Name */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-[#9C8355] mx-auto object-cover"
              />
              <div className="absolute bottom-0 right-0">
                <label className="bg-[#9C8355] text-white p-2 rounded-full hover:bg-[#5D3A1A] transition-colors cursor-pointer flex items-center justify-center">
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#5D3A1A] mt-4">{user.name}</h3>
            {uploadError && (
              <p className="text-red-500 text-sm mt-2">{uploadError}</p>
            )}
            {isUploading && (
              <p className="text-[#9C8355] text-sm mt-2">Subiendo imagen...</p>
            )}
          </div>

          {/* User Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-[#9C8355]" />
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-[#9C8355]" />
              <div>
                <p className="text-sm text-gray-600">Correo</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-[#9C8355]" />
              <div>
                <p className="text-sm text-gray-600">Miembro desde</p>
                <p className="font-medium text-gray-800">{user.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Upload Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <Upload className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Cambiar foto de perfil:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Formatos: JPG, PNG, GIF, WEBP</li>
                  <li>• Tamaño máximo: 5MB</li>
                  <li>• Recomendado: 400x400 píxeles</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleShowOrders}
              className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Ver Mis Pedidos</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 bg-[#9C8355] text-white py-3 rounded-lg font-semibold hover:bg-[#5D3A1A] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Eliminar Cuenta</span>
            </button>
          </div>
            </>
          ) : (
            /* Orders View */
            <div>
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={() => setShowOrders(false)}
                  className="text-[#9C8355] hover:text-[#5D3A1A] font-medium flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Volver al Perfil</span>
                </button>
              </div>

              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9C8355] mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando pedidos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tienes pedidos aún</p>
                  <p className="text-gray-500 text-sm">¡Haz tu primer pedido!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-[#5D3A1A]">#{order.ticket_number}</p>
                          <p className="text-sm text-gray-600">{order.store_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#9C8355]">${order.total}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'confirmed' ? 'Confirmado' :
                             order.status === 'preparing' ? 'Preparando' :
                             order.status === 'ready' ? 'Listo' : order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{order.estimated_time}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-700 font-medium">Productos:</p>
                        {order.items.map((item, index) => (
                          <p key={index} className="text-gray-600">
                            • {item.product_name} x{item.quantity} - ${item.total_price}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;