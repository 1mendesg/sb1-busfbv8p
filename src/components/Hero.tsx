import React from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteImage {
  id: string;
  title: string;
  section: string;
  current_image: string;
  banner_text: string;
}

export function Hero() {
  const [banners, setBanners] = React.useState<SiteImage[]>([]);

  React.useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { data } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'banner')
        .order('title', { ascending: true });

      if (data) {
        setBanners(data.filter(banner => banner.current_image));
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  const [currentBanner, setCurrentBanner] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Usual Rótulos e Etiquetas
            </h1>
            <p className="text-xl text-gray-600">
              Soluções personalizadas em rótulos e etiquetas para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn btn-primary">
                Solicite um Orçamento
              </a>
              <a href="#products" className="btn btn-outline">
                Conheça Nossos Produtos
                <ArrowRight className="ml-2 inline-block" size={20} />
              </a>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-2xl">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  currentBanner === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.current_image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <p className="text-white text-2xl font-semibold">
                    {banner.banner_text}
                  </p>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentBanner === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentBanner(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}