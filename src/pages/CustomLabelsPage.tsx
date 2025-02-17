import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const labelCategories = [
  {
    title: 'Etiquetas para Frigoríficos e Casas de Carnes',
    description: 'Modelos para todas as demandas.',
    products: ['Etiquetas para cortes de carne', 'Etiquetas resistentes a baixas temperaturas'],
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80',
    path: '/produtos/frigorificos'
  },
  {
    title: 'Etiquetas para Laticínios',
    description: 'Para queijos e todos os outros produtos.',
    products: ['Etiquetas para queijos', 'Etiquetas para iogurtes', 'Etiquetas para manteiga'],
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80',
    path: '/produtos/laticinios'
  },
  {
    title: 'Etiquetas de Garrão',
    description: 'Conheça as principais características.',
    products: ['Modelo com formatos variados'],
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80',
    path: '/produtos/garrao'
  },
  {
    title: 'Etiquetas para Embutidos',
    description: 'Variadas para todos os embutidos.',
    products: ['Etiquetas para linguiças', 'Etiquetas para salames', 'Etiquetas para presuntos'],
    image: 'https://images.unsplash.com/photo-1542901031-ec5eeb518506?auto=format&fit=crop&q=80',
    path: '/produtos/embutidos'
  },
  {
    title: 'Etiquetas para Congelados',
    description: 'Para todos os tipos de produtos.',
    products: ['Etiquetas para alimentos congelados', 'Etiquetas resistentes a baixas temperaturas'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80',
    path: '/produtos/congelados'
  },
  {
    title: 'Etiquetas e Rótulos em Geral',
    description: 'Conheça a grande variedade que oferecemos.',
    products: ['Rótulos personalizados', 'Etiquetas adesivas', 'Etiquetas para embalagens'],
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80',
    path: '/produtos/geral'
  },
];

export function CustomLabelsPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Etiquetas Personalizadas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra nossa linha completa de etiquetas especializadas para diferentes segmentos do mercado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labelCategories.map((category) => (
            <div
              key={category.title}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2 mb-6">
                  {category.products.map((product, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <ArrowRight size={16} className="mr-2 text-[--primary]" />
                      {product}
                    </li>
                  ))}
                </ul>
                <Link
                  to={category.path}
                  className="inline-flex items-center text-[--primary] font-semibold hover:text-[--primary-dark] transition-colors"
                >
                  Confira
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}