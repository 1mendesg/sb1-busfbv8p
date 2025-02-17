import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Settings, Plus, Image, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface Order {
  id: string;
  created_at: string;
  user_id: string;
  product_id: string;
  size: string;
  quantity: number;
  total_price: number;
  status: string;
  payment_status: string;
  color_range?: string;
  has_varnish?: boolean;
  artwork_url?: string;
  user: {
    email: string;
  };
  user_profile: {
    full_name: string;
    company_name: string;
    phone: string;
  };
  product: {
    name: string;
  };
}

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  React.useEffect(() => {
    checkAdminStatus();
    loadOrders();
  }, []);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:user_id(email),
          user_profile:user_profiles(full_name, company_name, phone),
          product:product_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erro ao atualizar o status do pedido');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === statusFilter);

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
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Pedidos</h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Filtrar por Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="processing">Em Processamento</option>
                <option value="completed">Concluídos</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Carregando pedidos...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum pedido encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalhes
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user_profile?.[0]?.full_name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user_profile?.[0]?.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user_profile?.[0]?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.product?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          Tamanho: {order.size}
                        </div>
                        <div className="text-sm text-gray-500">
                          Quantidade: {order.quantity}
                        </div>
                        {order.color_range && (
                          <div className="text-sm text-gray-500">
                            Cores: {order.color_range}
                          </div>
                        )}
                        {order.has_varnish && (
                          <div className="text-sm text-gray-500">
                            Com verniz
                          </div>
                        )}
                        {order.artwork_url && (
                          <a
                            href={order.artwork_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Ver arte
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status || 'Pendente'}
                        </span>
                        {order.payment_status && (
                          <div className="mt-1 text-xs text-gray-500">
                            Pagamento: {order.payment_status}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {order.total_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="p-1 border rounded text-sm"
                        >
                          <option value="pending">Pendente</option>
                          <option value="processing">Em Processamento</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}