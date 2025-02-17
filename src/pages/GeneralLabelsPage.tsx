import React from 'react';
import { CustomLabelModal } from '../components/CustomLabelModal';
import { supabase } from '../lib/supabase';

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
}

export function GeneralLabelsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'etiquetas')
        .eq('category', 'geral')
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-white">
        <div className="container">
          <div className="text-center">Carregando produtos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-32 pb-12">
      <div className="container">
        <h1 className="text-4xl font-bold text-center mb-12">Etiquetas e Rótulos em Geral</h1>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <img 
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">
                      Medidas disponíveis:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.dimensions.map((dim) => (
                        <div 
                          key={dim.size}
                          className="text-sm bg-gray-50 p-2 rounded"
                        >
                          <span className="font-medium">{dim.size}</span>
                          <br />
                          R$ {dim.price.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    Quantidade mínima: {product.min_quantity} unidades
                  </div>

                  <button 
                    className="w-full btn bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    Comprar Agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <CustomLabelModal 
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
}