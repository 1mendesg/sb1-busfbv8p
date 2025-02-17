import React from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { getCurrentUser } from '../lib/auth';
import { useCart } from '../lib/cart';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  dimensions: Array<{
    size: string;
    price: number;
    stock: number;
  }>;
  min_quantity: number;
  image_url: string;
}

interface CheeseLabelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CheeseLabelsModal({ isOpen, onClose, product }: CheeseLabelsModalProps) {
  const navigate = useNavigate();
  const addToCart = useCart((state) => state.addItem);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [quantity, setQuantity] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);

  React.useEffect(() => {
    if (product && product.dimensions.length > 0) {
      setSelectedSize(product.dimensions[0].size);
      setQuantity(product.min_quantity);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const selectedDimension = product.dimensions.find(d => d.size === selectedSize);
  const finalPrice = selectedDimension ? selectedDimension.price * (quantity / product.min_quantity) : 0;

  const handleAddToCart = async () => {
    const user = await getCurrentUser();
    
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!selectedDimension) return;

    try {
      setIsSubmitting(true);

      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
        quantity: 1,
        size: selectedSize,
        image_url: product.image_url
      });

      navigate('/cart');
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    handleAddToCart();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="rounded-lg w-full h-64 object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamanho
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    {product.dimensions.map((dim) => (
                      <option key={dim.size} value={dim.size}>
                        {dim.size} - R$ {dim.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade (Mínimo: {product.min_quantity})
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {[1, 2, 4].map((multiplier) => (
                      <option key={multiplier} value={product.min_quantity * multiplier}>
                        {product.min_quantity * multiplier} unidades
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDimension && selectedDimension.stock < quantity && (
                  <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                    Atenção: Estoque disponível: {selectedDimension.stock} unidades
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Preço Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {finalPrice.toFixed(2)}
                </span>
              </div>
              <button 
                className="w-full btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isSubmitting || (selectedDimension && selectedDimension.stock < quantity)}
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}