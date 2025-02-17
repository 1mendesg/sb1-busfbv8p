import React from 'react';
import { Linkedin, Instagram, CreditCard, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteImage {
  id: string;
  title: string;
  section: string;
  current_image: string;
}

export function Footer() {
  const [logo, setLogo] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const { data } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'logo')
        .eq('title', 'Logo Branco')
        .single();

      if (data?.current_image) {
        setLogo(data.current_image);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Trabalhe Conosco
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/usualetiquetas/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/usual.etiquetas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Formas de Pagamento</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-gray-400">
                <CreditCard size={24} className="mr-2" />
                <span>PIX</span>
              </div>
              <div className="flex items-center text-gray-400">
                <CreditCard size={24} className="mr-2" />
                <span>Cartão de Crédito</span>
              </div>
              <div className="flex items-center text-gray-400">
                <CreditCard size={24} className="mr-2" />
                <span>Boleto Bancário</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Segurança</h3>
            <div className="flex items-center text-gray-400">
              <Shield size={24} className="mr-2" />
              <span>Compra Segura</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {logo && (
              <img 
                src={logo}
                alt="Usual Rótulos e Etiquetas" 
                className="h-12"
              />
            )}
            <p className="text-gray-400">© 2023 Usual Rótulos e Etiquetas. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}