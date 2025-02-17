import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, ChevronDown, LayoutDashboard } from 'lucide-react';
import { getCurrentUser, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { CartIcon } from './CartIcon';

interface SiteImage {
  id: string;
  title: string;
  section: string;
  current_image: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [logo, setLogo] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkUser();
    loadLogo();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setIsAdmin(currentUser?.email?.toLowerCase() === 'luciano@usualetiquetas.com.br');
  };

  const loadLogo = async () => {
    try {
      const { data } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'logo')
        .eq('title', 'Logo Principal')
        .single();

      if (data?.current_image) {
        setLogo(data.current_image);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { label: 'Início', href: '#' },
    {
      label: 'Soluções',
      href: '#solutions',
      hasSubmenu: true,
      submenu: [
        { label: 'Ribbons', href: '/produtos/ribbons' },
        { label: 'Fitas', href: '/produtos/fitas' },
        { label: 'Produtos Acabados', href: '/produtos/acabados' },
        { label: 'Bobinas PDV', href: '/produtos/bobinas' },
        { 
          label: 'Etiquetas Personalizadas', 
          href: '/produtos/etiquetas',
          submenu: [
            { label: 'Laticínios', href: '/produtos/laticinios' },
            { label: 'Frigoríficos', href: '/produtos/frigorificos' },
            { label: 'Garrão', href: '/produtos/garrao' },
            { label: 'Embutidos', href: '/produtos/embutidos' },
            { label: 'Congelados', href: '/produtos/congelados' },
            { label: 'Geral', href: '/produtos/geral' },
          ]
        },
      ]
    },
    { label: 'Sobre Nós', href: '#about' },
    { label: 'Como Funciona', href: '#how-it-works' },
    { label: 'Contato', href: '#contact' },
  ];

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {logo && (
                <img 
                  src={logo}
                  alt="Usual Rótulos e Etiquetas" 
                  className="h-16"
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.hasSubmenu ? (
                  <button
                    onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-[--primary] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-[--primary] transition-colors"
                  >
                    {item.label}
                  </a>
                )}

                {item.hasSubmenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    {item.submenu?.map((subitem) => (
                      <div key={subitem.label} className="relative group/sub">
                        <Link
                          to={subitem.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                        >
                          {subitem.label}
                          {subitem.submenu && <ChevronDown size={16} />}
                        </Link>
                        {subitem.submenu && (
                          <div className="absolute left-full top-0 w-64 bg-white rounded-lg shadow-lg py-2 hidden group-hover/sub:block">
                            {subitem.submenu.map((subsubitem) => (
                              <Link
                                key={subsubitem.label}
                                to={subsubitem.href}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                              >
                                {subsubitem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <CartIcon />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[--primary] transition-colors"
                >
                  <User size={20} />
                  <span>Minha Conta</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5 mr-2" />
                        Dashboard Admin
                      </Link>
                    )}
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      to="/pedidos"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t">
            <div className="container py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.hasSubmenu ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                        className="flex items-center justify-between w-full text-gray-600 hover:text-[--primary] transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown size={16} />
                      </button>
                      {isSolutionsOpen && (
                        <div className="pl-4 space-y-2">
                          {item.submenu?.map((subitem) => (
                            <div key={subitem.label}>
                              <Link
                                to={subitem.href}
                                className="block text-gray-600 hover:text-[--primary] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subitem.label}
                              </Link>
                              {subitem.submenu && (
                                <div className="pl-4 mt-2 space-y-2">
                                  {subitem.submenu.map((subsubitem) => (
                                    <Link
                                      key={subsubitem.label}
                                      to={subsubitem.href}
                                      className="block text-gray-600 hover:text-[--primary] transition-colors"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subsubitem.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="text-gray-600 hover:text-[--primary] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center text-gray-600 hover:text-[--primary] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Dashboard Admin
                    </Link>
                  )}
                  <Link
                    to="/perfil"
                    className="text-gray-600 hover:text-[--primary] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/pedidos"
                    className="text-gray-600 hover:text-[--primary] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Pedidos
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-gray-600 hover:text-[--primary] transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}