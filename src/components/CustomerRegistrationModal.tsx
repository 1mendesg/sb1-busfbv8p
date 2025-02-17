import React from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CustomerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customerId: string) => void;
}

export function CustomerRegistrationModal({ isOpen, onClose, onSuccess }: CustomerRegistrationModalProps) {
  const [formData, setFormData] = React.useState({
    companyName: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data, error: insertError } = await supabase
        .from('customer_profiles')
        .insert([
          {
            company_name: formData.companyName,
            phone: formData.phone,
            email: formData.email,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error('No data returned from insert');

      onSuccess(data.id);
      onClose();
    } catch (err) {
      console.error('Error registering customer:', err);
      setError('Erro ao cadastrar. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Cadastro de Cliente</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}