import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface Customer {
  id: string;
  email: string;
  company_name: string;
  order_count: number;
}

export function AdminCustomersPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkAdminStatus();
    loadCustomers();
  }, []);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const loadCustomers = async () => {
    try {
      // Get all users with their orders count
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:user_id(email),
          user_profile:user_profiles(company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group and count orders by user
      const customerMap = new Map();
      data?.forEach(order => {
        if (!customerMap.has(order.user_id)) {
          customerMap.set(order.user_id, {
            id: order.user_id,
            email: order.user.email,
            company_name: order.user_profile?.[0]?.company_name || 'N/A',
            order_count: 1
          });
        } else {
          const customer = customerMap.get(order.user_id);
          customer.order_count++;
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-semibold">Clientes</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total de Pedidos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.order_count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}