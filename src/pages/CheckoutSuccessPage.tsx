import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../lib/cart';

export function CheckoutSuccessPage() {
  const clearCart = useCart((state) => state.clearCart);

  React.useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Pedido Realizado com Sucesso!</h1>
          <p className="text-gray-600 mb-8">
            Obrigado por sua compra! Você receberá um e-mail com os detalhes do pedido.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}