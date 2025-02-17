import React from 'react';
import { X, Upload } from 'lucide-react';
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
  has_varnish_option: boolean;
  color_range: string;
}

interface PriceConfig {
  colorRanges: {
    '0-2': number;
    '2-4': number;
    '4-6': number;
    '6-8': number;
  };
  varnishMultiplier: number;
}

interface CustomLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CustomLabelModal({ isOpen, onClose, product }: CustomLabelModalProps) {
  const navigate = useNavigate();
  const addToCart = useCart((state) => state.addItem);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [quantity, setQuantity] = React.useState(0);
  const [selectedColorRange, setSelectedColorRange] = React.useState('0-2');
  const [hasVarnish, setHasVarnish] = React.useState(false);
  const [artwork, setArtwork] = React.useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = React.useState('');
  const [isColorCompatible, setIsColorCompatible] = React.useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);
  const [priceConfig, setPriceConfig] = React.useState<PriceConfig>({
    colorRanges: {
      '0-2': 1.0,
      '2-4': 1.2,
      '4-6': 1.4,
      '6-8': 1.6,
    },
    varnishMultiplier: 1.15,
  });

  React.useEffect(() => {
    if (product && product.dimensions.length > 0) {
      setSelectedSize(product.dimensions[0].size);
      setQuantity(product.min_quantity);
      setSelectedColorRange(product.color_range);
    }
    loadPriceConfig();
  }, [product]);

  const loadPriceConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('price_config')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setPriceConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading price config:', error);
    }
  };

  if (!isOpen || !product) return null;

  const selectedDimension = product.dimensions.find(d => d.size === selectedSize);
  
  const getColorRangeMultiplier = (range: string) => {
    return priceConfig.colorRanges[range as keyof typeof priceConfig.colorRanges] || 1.0;
  };

  const basePrice = selectedDimension ? selectedDimension.price * (quantity / product.min_quantity) : 0;
  const colorMultiplier = getColorRangeMultiplier(selectedColorRange);
  const varnishMultiplier = hasVarnish ? priceConfig.varnishMultiplier : 1.0;
  const finalPrice = basePrice * colorMultiplier * varnishMultiplier;

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArtwork(file);
      setArtworkPreview(URL.createObjectURL(file));
      setIsColorCompatible(null);
    }
  };

  const handleAddToCart = async () => {
    const user = await getCurrentUser();
    
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!artwork) {
      alert('Por favor, faça o upload da sua arte.');
      return;
    }

    if (isColorCompatible === false) {
      alert('Por favor, verifique a compatibilidade de cores da sua arte.');
      return;
    }

    try {
      setIsSubmitting(true);

      const fileExt = artwork.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('artwork-files')
        .upload(fileName, artwork);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('artwork-files')
        .getPublicUrl(fileName);

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

  const colorRanges = [
    { value: '0-2', label: '0 a 2 cores', multiplier: priceConfig.colorRanges['0-2'] },
    { value: '2-4', label: '2 a 4 cores', multiplier: priceConfig.colorRanges['2-4'] },
    { value: '4-6', label: '4 a 6 cores', multiplier: priceConfig.colorRanges['4-6'] },
    { value: '6-8', label: '6 a 8 cores', multiplier: priceConfig.colorRanges['6-8'] },
  ];

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faixa de Cores
                  </label>
                  <select
                    value={selectedColorRange}
                    onChange={(e) => setSelectedColorRange(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    {colorRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label} (+{((range.multiplier - 1) * 100).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                </div>

                {product.has_varnish_option && (
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hasVarnish}
                        onChange={(e) => setHasVarnish(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Adicionar verniz (+{((priceConfig.varnishMultiplier - 1) * 100).toFixed(0)}%)
                      </span>
                    </label>
                  </div>
                )}

                {selectedDimension && selectedDimension.stock < quantity && (
                  <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                    Atenção: Estoque disponível: {selectedDimension.stock} unidades
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sua Arte
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {artworkPreview ? (
                    <div className="mb-4">
                      <img
                        src={artworkPreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-contain"
                      />
                    </div>
                  ) : (
                    <Upload
                      className="mx-auto h-12 w-12 text-gray-400"
                      strokeWidth={1}
                    />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="artwork-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Carregar arquivo</span>
                      <input
                        id="artwork-upload"
                        type="file"
                        className="sr-only"
                        accept=".ai,.pdf,.eps,.jpg,.jpeg,.png"
                        onChange={handleArtworkChange}
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    AI, PDF, EPS, JPG ou PNG até 10MB
                  </p>
                </div>
              </div>
            </div>

            {artwork && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sua arte está compatível com a faixa de cores selecionada?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsColorCompatible(true)}
                    className={`px-4 py-2 rounded-lg ${
                      isColorCompatible === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsColorCompatible(false)}
                    className={`px-4 py-2 rounded-lg ${
                      isColorCompatible === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Preço base:</span>
                  <span>R$ {basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Multiplicador de cores ({colorRanges.find(r => r.value === selectedColorRange)?.label}):</span>
                  <span>+{((colorMultiplier - 1) * 100).toFixed(0)}%</span>
                </div>
                {hasVarnish && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Verniz:</span>
                    <span>+{((priceConfig.varnishMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">Preço Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <button 
                className="w-full btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isSubmitting || !artwork || isColorCompatible === null || (selectedDimension && selectedDimension.stock < quantity)}
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