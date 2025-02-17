import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Settings, Plus, Image, ArrowLeft, Upload, Trash2, Save, Edit, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface ImageSection {
  id: string;
  title: string;
  description: string;
  current_image: string;
  section: 'banner' | 'solution' | 'logo';
  banner_text?: string;
}

export function AdminImagesPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [images, setImages] = React.useState<ImageSection[]>([]);
  const [selectedImages, setSelectedImages] = React.useState<Record<string, File>>({});
  const [previews, setPreviews] = React.useState<Record<string, string>>({});
  const [editingText, setEditingText] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    checkAdminStatus();
    loadImages();
  }, []);

  const checkAdminStatus = async () => {
    const user = await getCurrentUser();
    setIsAdmin(user?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (sectionId: string, file: File) => {
    setSelectedImages(prev => ({
      ...prev,
      [sectionId]: file
    }));
    setPreviews(prev => ({
      ...prev,
      [sectionId]: URL.createObjectURL(file)
    }));
  };

  const deleteOldImage = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    try {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('site-images')
          .remove([fileName]);
      }
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  };

  const handleSaveAll = async () => {
    if (Object.keys(selectedImages).length === 0 && Object.keys(editingText).length === 0) {
      setError('Nenhuma alteração para salvar.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save images
      for (const [sectionId, file] of Object.entries(selectedImages)) {
        const currentSection = images.find(img => img.id === sectionId);
        if (currentSection?.current_image) {
          await deleteOldImage(currentSection.current_image);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${sectionId}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('site-images')
          .upload(fileName, file, {
            cacheControl: '0',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-images')
          .getPublicUrl(fileName);

        const { error: updateError } = await supabase
          .from('site_images')
          .update({ 
            current_image: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', sectionId);

        if (updateError) throw updateError;
      }

      // Save text changes
      for (const [sectionId, text] of Object.entries(editingText)) {
        const { error: updateError } = await supabase
          .from('site_images')
          .update({ 
            banner_text: text,
            updated_at: new Date().toISOString()
          })
          .eq('id', sectionId);

        if (updateError) throw updateError;
      }

      setSuccess('Alterações salvas com sucesso!');
      setSelectedImages({});
      setPreviews({});
      setEditingText({});
      await loadImages();
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('Erro ao salvar as alterações. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const createMissingSections = async () => {
    const requiredSections = [
      // Banners
      { title: 'Banner Principal 1', description: 'Banner principal da página inicial - Posição 1', section: 'banner', banner_text: 'Já encontrou o seu rótulo?' },
      { title: 'Banner Principal 2', description: 'Banner principal da página inicial - Posição 2', section: 'banner', banner_text: 'Eleve a sua marca!' },
      { title: 'Banner Principal 3', description: 'Banner principal da página inicial - Posição 3', section: 'banner', banner_text: 'A escolha certa para o seu e-commerce!' },
      
      // Logos
      { title: 'Logo Principal', description: 'Logo principal do site', section: 'logo' },
      { title: 'Logo Branco', description: 'Versão branca do logo para fundos escuros', section: 'logo' },
      
      // Soluções
      { title: 'Ribbons', description: 'Imagem da seção de Ribbons', section: 'solution' },
      { title: 'Fitas', description: 'Imagem da seção de Fitas', section: 'solution' },
      { title: 'Produtos Acabados', description: 'Imagem da seção de Produtos Acabados', section: 'solution' },
      { title: 'Bobinas PDV', description: 'Imagem da seção de Bobinas PDV', section: 'solution' },
      { title: 'Etiquetas Personalizadas', description: 'Imagem da seção de Etiquetas Personalizadas', section: 'solution' }
    ];

    try {
      for (const section of requiredSections) {
        const exists = images.some(img => 
          img.title.toLowerCase() === section.title.toLowerCase() && 
          img.section === section.section
        );

        if (!exists) {
          const { error } = await supabase
            .from('site_images')
            .insert([section]);

          if (error) throw error;
        }
      }

      await loadImages();
    } catch (error) {
      console.error('Error creating missing sections:', error);
    }
  };

  React.useEffect(() => {
    if (images.length > 0) {
      createMissingSections();
    }
  }, [images]);

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  const groupedImages = images.reduce((acc: Record<string, ImageSection[]>, image) => {
    if (!acc[image.section]) {
      acc[image.section] = [];
    }
    acc[image.section].push(image);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao site
              </button>
              <span className="text-xl font-semibold text-gray-800">
                Painel Administrativo
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Settings size={20} />
                <span>Configurações</span>
              </button>
              <button
                onClick={() => navigate('/admin/produtos')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Package size={20} />
                <span>Produtos</span>
              </button>
              <button
                onClick={() => navigate('/admin/pedidos')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <ShoppingBag size={20} />
                <span>Pedidos</span>
              </button>
              <button
                onClick={() => navigate('/admin/produtos/novo')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Plus size={20} />
                <span>Novo Produto</span>
              </button>
              <button
                onClick={() => navigate('/admin/imagens')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600"
              >
                <Image size={20} />
                <span>Imagens</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gerenciar Imagens do Site</h2>
            {(Object.keys(selectedImages).length > 0 || Object.keys(editingText).length > 0) && (
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">Carregando imagens...</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedImages).map(([section, sectionImages]) => (
                <div key={section} className="space-y-4">
                  <h3 className="text-xl font-semibold capitalize border-b pb-2">
                    {section === 'banner' && 'Banners'}
                    {section === 'logo' && 'Logos'}
                    {section === 'solution' && 'Soluções'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {sectionImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">{image.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{image.description}</p>
                        
                        <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                          {(previews[image.id] || image.current_image) ? (
                            <img
                              src={previews[image.id] || image.current_image}
                              alt={image.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <Image size={48} />
                            </div>
                          )}
                        </div>

                        {image.section === 'banner' && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Texto do Banner
                            </label>
                            <input
                              type="text"
                              value={editingText[image.id] ?? image.banner_text ?? ''}
                              onChange={(e) => {
                                setEditingText(prev => ({
                                  ...prev,
                                  [image.id]: e.target.value
                                }));
                              }}
                              className="w-full p-2 border rounded-lg"
                              placeholder="Digite o texto do banner"
                            />
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                            <Upload size={20} />
                            <span>Alterar Imagem</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleImageSelect(image.id, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          {selectedImages[image.id] && (
                            <button
                              onClick={() => {
                                setSelectedImages(prev => {
                                  const newState = { ...prev };
                                  delete newState[image.id];
                                  return newState;
                                });
                                setPreviews(prev => {
                                  const newState = { ...prev };
                                  delete newState[image.id];
                                  return newState;
                                });
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}