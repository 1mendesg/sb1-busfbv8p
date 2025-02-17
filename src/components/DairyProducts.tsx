import React from 'react';
import { useNavigate } from 'react-router-dom';

export function DairyProducts() {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate('/produtos/laticinios');
  };

  return (
    <div className="bg-white p-8">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Produtos para Laticínios
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções completas de identificação para a indústria de laticínios, com rótulos e etiquetas que atendem às normas do setor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80" 
                alt="Queijos"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Etiquetas para Queijos</h3>
            <p className="text-gray-600">Etiquetas resistentes e personalizadas para todos os tipos de queijos.</p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80" 
                alt="Iogurtes"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Etiquetas para Iogurtes</h3>
            <p className="text-gray-600">Rótulos adesivos para potes e embalagens de iogurte.</p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1542901031-ec5eeb518506?auto=format&fit=crop&q=80" 
                alt="Manteiga"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Etiquetas para Manteiga</h3>
            <p className="text-gray-600">Etiquetas resistentes a baixas temperaturas para manteigas.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={handleProductClick}
            className="btn btn-primary"
          >
            Ver Detalhes dos Produtos
          </button>
        </div>
      </div>
    </div>
  );
}