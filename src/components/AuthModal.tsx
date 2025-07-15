import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { AuthForm, User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSubmit: (data: UserType) => void;
  onSwitchMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  mode, 
  onClose, 
  onSubmit, 
  onSwitchMode 
}) => {
  const [formData, setFormData] = useState<AuthForm>({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('🔄 Iniciando autenticación...', { mode, email: formData.email });
    try {
      // Validaciones básicas
      if (mode === 'register' && !formData.name?.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!formData.email.trim()) {
        throw new Error('El email es requerido');
      }
      if (!formData.password.trim()) {
        throw new Error('La contraseña es requerida');
      }
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Llamar a la API
      console.log('📡 Enviando petición a API...');
      const response = await fetch('http://localhost/zolt_coffee/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: mode,
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      console.log('📥 Respuesta recibida:', response.status);
      const data = await response.json();
      console.log('📄 Datos de respuesta:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      if (data.success) {
        console.log('✅ Autenticación exitosa');
        // Guardar token de sesión
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Llamar al callback con los datos del usuario
        onSubmit(data.user);
        
        // Limpiar formulario
        setFormData({ email: '', password: '', name: '' });
        setError(null);
        
        // Mostrar mensaje de éxito
        console.log(`✅ ${mode === 'login' ? 'Inicio de sesión' : 'Registro'} exitoso!`);
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error en autenticación:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuthForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-[#5D3A1A]">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9C8355] focus:border-transparent pr-12"
                placeholder="Tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#9C8355] hover:bg-[#5D3A1A]'
            } text-white`}
          >
            {isLoading 
              ? (mode === 'login' ? 'Iniciando...' : 'Creando...') 
              : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')
            }
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t text-center">
          <p className="text-gray-600">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={onSwitchMode}
              className="ml-2 text-[#9C8355] font-medium hover:text-[#5D3A1A] transition-colors"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;