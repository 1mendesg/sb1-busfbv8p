import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export function OrdersPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    checkAuth();
    loadOrders();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  };

  const loadOrders = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cheese_label_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
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
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600">Você ainda não tem pedidos.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Pedido #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600">
                      Data: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {order.total_price.toFixed(2)}
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tamanho:</span>{' '}
                        {order.size}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cores:</span>{' '}
                        {order.color_range}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Quantidade:</span>{' '}
                        {order.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Verniz:</span>{' '}
                        {order.has_varnish ? 'Sim' : 'Não'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}