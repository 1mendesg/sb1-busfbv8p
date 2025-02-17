import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface LocationState {
  newUser?: boolean;
  profile?: {
    fullName: string;
    phone: string;
    company: string;
  };
}

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    cpfCnpj: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    checkAuth();
    if (state?.newUser && state.profile) {
      // Pre-fill form with registration data
      setFormData(prev => ({
        ...prev,
        fullName: state.profile.fullName,
        phone: state.profile.phone,
      }));
      setIsLoading(false);
    } else {
      loadProfile();
    }
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  };

  const loadProfile = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          fullName: data.full_name || '',
          cpfCnpj: data.cpf_cnpj || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zip_code || '',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.fullName,
          cpf_cnpj: formData.cpfCnpj,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
        });

      if (error) throw error;

      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Erro ao salvar o perfil. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-gray-50">
        <div className="container">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

        {state?.newUser && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
            Bem-vindo! Por favor, complete seu cadastro com as informações adicionais abaixo.
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  value={formData.cpfCnpj}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cpfCnpj: e.target.value }))
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
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, zipCode: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}