import React from 'react';
import { useCart } from '../lib/cart';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPreference } from '../lib/mercadopago';

export function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const checkoutUrl = await createPreference(items);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('Erro ao processar o pagamento. Por favor, tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos ao seu carrinho para continuar comprando.
            </p>
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às compras
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Carrinho
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 space-y-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center space-x-4 py-4 border-b last:border-0"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Tamanho: {item.size}</p>
                  <p className="text-gray-600">
                    Preço: R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-lg"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center border rounded-lg"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold">R$ {total().toFixed(2)}</span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex-1 btn btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Link>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1 btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}