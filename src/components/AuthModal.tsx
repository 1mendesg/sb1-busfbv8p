import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { signIn, signUp } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        
        // Check if user is admin
        if (formData.email.toLowerCase() === 'luciano@usualetiquetas.com.br') {
          onSuccess();
          onClose();
          navigate('/admin');
        } else {
          onSuccess();
          onClose();
          navigate('/');
        }
      } else {
        // Sign up flow
        const { data: authData, error: signUpError } = await signUp(formData.email, formData.password);
        if (signUpError) throw signUpError;

        if (authData.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: authData.user.id,
              full_name: formData.fullName,
              phone: formData.phone,
              company_name: formData.company,
            })
            .select()
            .single();

          if (profileError) throw profileError;

          onSuccess();
          onClose();
          navigate('/', { 
            state: { 
              showWelcome: true
            }
          });
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Erro na autenticação. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Login' : 'Criar Conta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, company: e.target.value }))
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
              </>
            )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Processando...'
                : isLogin
                ? 'Entrar'
                : 'Criar Conta'}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin
                ? 'Não tem uma conta? Criar conta'
                : 'Já tem uma conta? Fazer login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}