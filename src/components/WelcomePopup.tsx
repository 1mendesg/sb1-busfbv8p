import React from 'react';
import { X } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full animate-fadeIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-600">Parabéns!</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-lg text-gray-700">
            Sua conta foi criada com sucesso! Agora você já pode efetuar suas compras.
          </p>
        </div>
      </div>
    </div>
  );
}