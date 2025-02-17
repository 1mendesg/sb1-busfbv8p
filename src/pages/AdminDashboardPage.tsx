import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Settings, Plus, Image, ArrowLeft, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface PriceConfig {
  colorRanges: {
    '0-2': number;
    '2-4': number;
    '4-6': number;
    '6-8': number;
  };
  varnishMultiplier: number;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [priceConfig, setPriceConfig] = React.useState<PriceConfig>({
    colorRanges: {
      '0-2': 1.0,
      '2-4': 1.2,
      '4-6': 1.4,
      '6-8': 1.6,
    },
    varnishMultiplier: 1.15,
  });
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    checkAdminStatus();
    loadConfig();
  }, []);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('price_config')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setPriceConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('price_config')
        .upsert({ 
          id: 1, 
          config: priceConfig,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Error saving config:', err);
      setError('Erro ao salvar as configurações. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao site
              </button>
              <span className="text-xl font-semibold text-gray-800">
                Painel Administrativo
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600"
              >
                <Settings size={20} />
                <span>Configurações</span>
              </button>
              <button
                onClick={() => navigate('/admin/produtos')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Package size={20} />
                <span>Produtos</span>
              </button>
              <button
                onClick={() => navigate('/admin/pedidos')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <ShoppingBag size={20} />
                <span>Pedidos</span>
              </button>
              <button
                onClick={() => navigate('/admin/produtos/novo')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Plus size={20} />
                <span>Novo Produto</span>
              </button>
              <button
                onClick={() => navigate('/admin/imagens')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Image size={20} />
                <span>Imagens</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Configurações de Preço</h2>
          
          {isLoading ? (
            <div className="text-center py-4">Carregando configurações...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Multiplicadores por Faixa de Cores</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      0 a 2 cores
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={priceConfig.colorRanges['0-2']}
                      onChange={(e) => setPriceConfig(prev => ({
                        ...prev,
                        colorRanges: {
                          ...prev.colorRanges,
                          '0-2': parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Aumento: {((priceConfig.colorRanges['0-2'] - 1) * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      2 a 4 cores
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={priceConfig.colorRanges['2-4']}
                      onChange={(e) => setPriceConfig(prev => ({
                        ...prev,
                        colorRanges: {
                          ...prev.colorRanges,
                          '2-4': parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Aumento: {((priceConfig.colorRanges['2-4'] - 1) * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      4 a 6 cores
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={priceConfig.colorRanges['4-6']}
                      onChange={(e) => setPriceConfig(prev => ({
                        ...prev,
                        colorRanges: {
                          ...prev.colorRanges,
                          '4-6': parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Aumento: {((priceConfig.colorRanges['4-6'] - 1) * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      6 a 8 cores
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={priceConfig.colorRanges['6-8']}
                      onChange={(e) => setPriceConfig(prev => ({
                        ...prev,
                        colorRanges: {
                          ...prev.colorRanges,
                          '6-8': parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Aumento: {((priceConfig.colorRanges['6-8'] - 1) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Multiplicador de Verniz</h3>
                <div className="max-w-xs">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={priceConfig.varnishMultiplier}
                    onChange={(e) => setPriceConfig(prev => ({
                      ...prev,
                      varnishMultiplier: parseFloat(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Aumento: {((priceConfig.varnishMultiplier - 1) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                  {success}
                </div>
              )}

              <div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}