import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteImage {
  id: string;
  title: string;
  section: string;
  current_image: string;
}

const defaultSolutions = [
  {
    type: 'ribbons',
    title: 'Ribbons',
    description: 'Ribbons de alta qualidade para impressão térmica.',
    path: '/produtos/ribbons'
  },
  {
    type: 'fitas',
    title: 'Fitas',
    description: 'Fitas adesivas para diversas aplicações.',
    path: '/produtos/fitas'
  },
  {
    type: 'acabados',
    title: 'Produtos Acabados',
    description: 'Soluções completas e prontas para uso.',
    path: '/produtos/acabados'
  },
  {
    type: 'bobinas',
    title: 'Bobinas PDV',
    description: 'Bobinas térmicas para pontos de venda.',
    path: '/produtos/bobinas'
  },
  {
    type: 'etiquetas',
    title: 'Etiquetas Personalizadas',
    description: 'Soluções customizadas para sua necessidade.',
    path: '/produtos/etiquetas',
    categories: [
      { 
        value: 'frigorificos', 
        label: 'Frigoríficos', 
        path: '/produtos/frigorificos'
      },
      { value: 'laticinios', label: 'Laticínios', path: '/produtos/laticinios' },
      { value: 'garrao', label: 'Garrão', path: '/produtos/garrao' },
      { value: 'supermercados', label: 'Supermercados', path: '/produtos/supermercados' },
      { value: 'delivery', label: 'Delivery', path: '/produtos/delivery' },
      { value: 'geral', label: 'Geral', path: '/produtos/geral' },
    ]
  },
];

export function Solutions() {
  const [siteImages, setSiteImages] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    loadSiteImages();
  }, []);

  const loadSiteImages = async () => {
    try {
      const { data } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'solution');

      if (data) {
        const imageMap = data.reduce((acc: Record<string, string>, img: SiteImage) => {
          if (img.current_image) {
            acc[img.title.toLowerCase()] = img.current_image;
          }
          return acc;
        }, {});
        setSiteImages(imageMap);
      }
    } catch (error) {
      console.error('Error loading site images:', error);
    }
  };

  const getImageForSolution = (title: string) => {
    const key = title.toLowerCase();
    return siteImages[key] || 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80';
  };

  return (
    <section id="solutions" className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossas Soluções
          </h2>
          <p className="text-xl text-gray-600">
            Conheça nossa linha completa de produtos para identificação e rotulagem.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {defaultSolutions.map((solution) => (
            <div
              key={solution.title}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src={getImageForSolution(solution.title)}
                  alt={solution.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>

                {solution.categories && (
                  <div className="space-y-2 mb-4">
                    <p className="font-medium text-gray-700">Categorias:</p>
                    {solution.categories.map((category) => (
                      <Link
                        key={category.value}
                        to={category.path}
                        className="block hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">{category.label}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!solution.categories && (
                  <Link
                    to={solution.path}
                    className="inline-flex items-center text-[--primary] font-semibold hover:text-[--primary-dark] transition-colors"
                  >
                    Saiba mais
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}