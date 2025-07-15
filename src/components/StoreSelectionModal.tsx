import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Store } from '../types';
import { stores } from '../data/stores';

interface StoreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStore: (store: Store) => void;
}

const StoreSelectionModal: React.FC<StoreSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectStore
}) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  if (!isOpen) return null;

  const handleConfirmSelection = () => {
    if (selectedStore) {
      onSelectStore(selectedStore);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-[#9C8355]" />
            <h2 className="text-2xl font-bold text-[#5D3A1A]">Seleccionar Sede</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Elige la sede más cercana para recoger tu pedido
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedStore?.id === store.id
                    ? 'border-[#9C8355] bg-[#9C8355]/5'
                    : 'border-gray-200 hover:border-[#9C8355]/50'
                }`}
                onClick={() => setSelectedStore(store)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[#5D3A1A] text-lg">{store.name}</h3>
                  <div className="flex items-center space-x-1 text-[#9C8355] text-sm font-medium">
                    <Navigation className="w-4 h-4" />
                    <span>{store.distance}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{store.address}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600 text-sm">{store.phone}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600 text-sm">{store.hours}</p>
                  </div>
                </div>

                {selectedStore?.id === store.id && (
                  <div className="mt-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#9C8355] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedStore}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              selectedStore
                ? 'bg-[#9C8355] text-white hover:bg-[#5D3A1A]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedStore ? `Continuar con ${selectedStore.name}` : 'Selecciona una sede'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSelectionModal;