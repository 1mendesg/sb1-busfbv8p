import React from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Settings, Package, Image, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  product_type: string;
  dimensions: Array<{
    size: string;
    price: number;
    stock: number;
  }>;
  min_quantity: number;
  image_url: string;
  has_varnish_option: boolean;
  color_range: string;
}

export function AdminProductsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkAdminStatus();
    loadProducts();
  }, []);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    setIsDeleting(productId);
    try {
      if (products.find(p => p.id === productId)?.image_url) {
        const imagePath = products.find(p => p.id === productId)?.image_url.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('product-images')
            .remove([imagePath]);
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir o produto. Por favor, tente novamente.');
    } finally {
      setIsDeleting(null);
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
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Settings size={20} />
                <span>Configurações</span>
              </button>
              <button
                onClick={() => navigate('/admin/produtos')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600"
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
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagem
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Base
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medidas
                  </th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.product_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.dimensions[0] ? 
                        `R$ ${product.dimensions[0].price.toFixed(2)}` : 
                        'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.dimensions.map(d => d.size).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-4"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Excluir"
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}