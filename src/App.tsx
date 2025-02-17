import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Solutions } from './components/Solutions';
import { About } from './components/About';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { WhatsAppPopup } from './components/WhatsAppPopup';
import { WelcomePopup } from './components/WelcomePopup';
import { CartPage } from './pages/CartPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { DairyProductsPage } from './pages/DairyProductsPage';
import { FrigorificosProductsPage } from './pages/FrigorificosProductsPage';
import { GarraoProductsPage } from './pages/GarraoProductsPage';
import { SupermercadosProductsPage } from './pages/SupermercadosProductsPage';
import { DeliveryProductsPage } from './pages/DeliveryProductsPage';
import { GeneralLabelsPage } from './pages/GeneralLabelsPage';
import { RibbonsPage } from './pages/RibbonsPage';
import { TapesPage } from './pages/TapesPage';
import { FinishedProductsPage } from './pages/FinishedProductsPage';
import { PDVRollsPage } from './pages/PDVRollsPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { LoginPage } from './pages/LoginPage';
import { CustomLabelsPage } from './pages/CustomLabelsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminNewProductPage } from './pages/AdminNewProductPage';
import { AdminImagesPage } from './pages/AdminImagesPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { ScrollToTop } from './components/ScrollToTop';

function MainLayout() {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = React.useState(false);

  React.useEffect(() => {
    if (location.state?.showWelcome) {
      setShowWelcome(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Solutions />
            <About />
            <HowItWorks />
            <Testimonials />
            <ContactForm />
          </main>
        } />
        <Route path="/produtos/etiquetas" element={<CustomLabelsPage />} />
        <Route path="/produtos/laticinios" element={<DairyProductsPage />} />
        <Route path="/produtos/frigorificos" element={<FrigorificosProductsPage />} />
        <Route path="/produtos/garrao" element={<GarraoProductsPage />} />
        <Route path="/produtos/supermercados" element={<SupermercadosProductsPage />} />
        <Route path="/produtos/delivery" element={<DeliveryProductsPage />} />
        <Route path="/produtos/geral" element={<GeneralLabelsPage />} />
        <Route path="/produtos/ribbons" element={<RibbonsPage />} />
        <Route path="/produtos/fitas" element={<TapesPage />} />
        <Route path="/produtos/acabados" element={<FinishedProductsPage />} />
        <Route path="/produtos/bobinas" element={<PDVRollsPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
      </Routes>
      <Footer />
      <WhatsAppPopup />
      <WelcomePopup isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/produtos" element={<AdminProductsPage />} />
          <Route path="/admin/produtos/novo" element={<AdminNewProductPage />} />
          <Route path="/admin/imagens" element={<AdminImagesPage />} />
          <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/success" element={<CheckoutSuccessPage />} />
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;