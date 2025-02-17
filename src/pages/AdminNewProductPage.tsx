import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

const productTypes = [
  { value: 'ribbons', label: 'Ribbons' },
  { value: 'fitas', label: 'Fitas' },
  { value: 'acabados', label: 'Produtos Acabados' },
  { value: 'bobinas', label: 'Bobinas PDV' },
  { value: 'etiquetas', label: 'Etiquetas Personalizadas' },
];

const categories = [
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'frigorificos', label: 'Frigoríficos' },
  { value: 'garrao', label: 'Garrão' },
  { value: 'supermercados', label: 'Supermercados' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'geral', label: 'Geral' },
];

const colorRanges = [
  { value: '0-2', label: '0 a 2 cores' },
  { value: '2-4', label: '2 a 4 cores' },
  { value: '4-6', label: '4 a 6 cores' },
  { value: '6-8', label: '6 a 8 cores' },
];

interface Dimension {
  size: string;
  price: number;
  stock: number;
}

export function AdminNewProductPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dimensions, setDimensions] = React.useState<Dimension[]>([{ size: '', price: 0, stock: 0 }]);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    productType: '',
    category: '',
    minQuantity: 1000,
    hasVarnishOption: false,
    colorRange: '0-2',
  });

  React.useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddDimension = () => {
    setDimensions([...dimensions, { size: '', price: 0, stock: 0 }]);
  };

  const handleRemoveDimension = (index: number) => {
    setDimensions(dimensions.filter((_, i) => i !== index));
  };

  const handleDimensionChange = (index: number, field: keyof Dimension, value: string | number) => {
    const newDimensions = [...dimensions];
    if (field === 'price') {
      const numValue = parseFloat(value as string) || 0;
      newDimensions[index] = {
        ...newDimensions[index],
        price: numValue,
      };
    } else if (field === 'stock') {
      const numValue = parseInt(value as string, 10) || 0;
      newDimensions[index] = {
        ...newDimensions[index],
        stock: numValue,
      };
    } else {
      newDimensions[index] = {
        ...newDimensions[index],
        [field]: value,
      };
    }
    setDimensions(newDimensions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let image_url = '';

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        image_url = publicUrl;
      }

      const { error } = await supabase.from('products').insert([
        {
          name: formData.name,
          description: formData.description,
          product_type: formData.productType,
          category: formData.category,
          dimensions: dimensions,
          min_quantity: formData.minQuantity,
          image_url: image_url,
          has_varnish_option: formData.hasVarnishOption,
          color_range: formData.colorRange,
        },
      ]);

      if (error) throw error;

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Erro ao criar produto. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate('/admin/produtos')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <h1 className="text-2xl font-semibold">Novo Produto</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem do Produto
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded"
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
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Carregar imagem</span>
                        <input
                          id="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Produto
                </label>
                <select
                  required
                  value={formData.productType}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productType: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Selecione um tipo</option>
                  {productTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faixa de Cores
                </label>
                <select
                  required
                  value={formData.colorRange}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, colorRange: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  {colorRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasVarnishOption}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hasVarnishOption: e.target.checked }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Produto permite opção de verniz
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Mínima
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.minQuantity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, minQuantity: parseInt(e.target.value, 10) || 1000 }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Medidas, Preços e Estoque
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDimension}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Adicionar Medida
                  </button>
                </div>
                {dimensions.map((dimension, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Medida"
                        required
                        value={dimension.size}
                        onChange={(e) => handleDimensionChange(index, 'size', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Preço"
                        required
                        min="0"
                        step="0.01"
                        value={dimension.price}
                        onChange={(e) => handleDimensionChange(index, 'price', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Estoque"
                        required
                        min="0"
                        value={dimension.stock}
                        onChange={(e) => handleDimensionChange(index, 'stock', e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                      {dimensions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDimension(index)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}