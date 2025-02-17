import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  dimensions: string;
  image_url: string;
}

export function Products() {
  const [products, setProducts] = React.useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // Agrupar produtos por categoria
        const grouped = data.reduce((acc: Record<string, Product[]>, product: Product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {});
        setProducts(grouped);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section id="products" className="py-16 bg-white">
        <div className="container">
          <div className="text-center">Carregando produtos...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Produtos
          </h2>
          <p className="text-xl text-gray-600">
            Conheça nossa variedade de rótulos e etiquetas para diferentes segmentos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(products).map(([category, categoryProducts]) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src={categoryProducts[0]?.image_url || 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80'}
                  alt={category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {category === 'laticinios' && 'Etiquetas para Laticínios'}
                  {category === 'frigorificos' && 'Etiquetas para Frigoríficos'}
                  {category === 'garrao' && 'Etiquetas de Garrão'}
                  {category === 'embutidos' && 'Etiquetas para Embutidos'}
                  {category === 'congelados' && 'Etiquetas para Congelados'}
                  {category === 'geral' && 'Etiquetas e Rótulos em Geral'}
                </h3>
                <div className="space-y-2 mb-6">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center">
                        <ArrowRight size={16} className="mr-2 text-[--primary]" />
                        <span>{product.name}</span>
                      </div>
                      <span className="font-semibold">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/produtos/${category}`}
                  className="inline-flex items-center text-[--primary] font-semibold hover:text-[--primary-dark] transition-colors"
                >
                  Ver Detalhes
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}