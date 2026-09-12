import React, { useState, useEffect } from 'react';
import { storageService } from './services/storage';
import { Product, Category, CatalogInfo, ContactMessage, AdminUser } from './types';
import { INITIAL_CATALOG } from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductSlider } from './components/ProductSlider';
import { Features } from './components/Features';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { BatchEstimatorModal } from './components/BatchEstimatorModal';
import { KitchenProductItem } from './data/kitchenProducts';

// Secure Admin Components (accessed only directly via #/panel-secure-access)
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCatalog } from './pages/admin/AdminCatalog';
import { AdminSlider } from './pages/admin/AdminSlider';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminVisualEditor } from './pages/admin/AdminVisualEditor';
import { CloudflareGuide } from './pages/admin/CloudflareGuide';
import { SliderProduct } from './types';
import { ContentProvider } from './context/ContentContext';
import { ViewportProvider } from './context/ViewportContext';

function AppInner() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const currentTabRef = React.useRef<string>(currentTab);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  // Interactive Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<KitchenProductItem | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);

  // Admin Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalog, setCatalog] = useState<CatalogInfo>(() => {
    try {
      const local = localStorage.getItem('arasteh_catalog_db');
      if (local) return JSON.parse(local);
    } catch {}
    return INITIAL_CATALOG;
  });
  const [sliderProducts, setSliderProducts] = useState<SliderProduct[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => storageService.getCurrentAdmin());
  const [openProductModalOnAdmin, setOpenProductModalOnAdmin] = useState<boolean>(false);

  // Load initial backend state
  const loadData = async () => {
    try {
      const [prods, cats, catlg, msgs, user, sliderItems] = await Promise.all([
        storageService.getProducts(),
        storageService.getCategories(),
        storageService.getCatalog(),
        storageService.getMessages(),
        storageService.getCurrentAdmin(),
        storageService.getSliderProducts(),
      ]);

      setProducts(prods);
      setCategories(cats);
      if (catlg) setCatalog(catlg);
      setMessages(msgs);
      if (user) setCurrentUser(user);
      setSliderProducts(sliderItems);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Check route on startup and listen for changes
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/^\/|\/$/g, '');
      const hash = window.location.hash.toLowerCase().replace(/^#\/?|\/$/g, '');
      const activeAdmin = storageService.getCurrentAdmin();

      // Check if this hash is an in-page section jump (#hero, #features, etc.)
      const isPublicAnchor = [
        'hero',
        'products-showcase',
        'features',
        'faq',
        'catalog-request',
        'contact',
        'main-header',
      ].includes(hash);

      if (isPublicAnchor) {
        // If currentTab is already in admin, stay in admin! Never kick user to public site
        if (currentTabRef.current.startsWith('admin')) {
          return;
        }
      }

      // Prioritize hash if available
      if (hash) {
        if (hash === 'panel-secure-access' || hash === 'admin/login' || hash === 'admin-login') {
          if (activeAdmin) {
            setCurrentTab('admin-visual-editor');
          } else {
            setCurrentTab('admin-login');
          }
          return;
        }

        if (hash.startsWith('admin')) {
          if (!activeAdmin) {
            setCurrentTab('admin-login');
          } else {
            setCurrentTab(hash === 'admin' || hash === 'admin-dashboard' ? 'admin-visual-editor' : hash);
          }
          return;
        }

        if (hash === 'home' || hash === '') {
          setCurrentTab('home');
          return;
        }

        // If currently in admin and any other hash was triggered, preserve admin session
        if (currentTabRef.current.startsWith('admin')) {
          return;
        }
      }

      // Fallback to pathname if no hash
      if (path === 'panel-secure-access' || path === 'admin/login' || path === 'admin-login') {
        if (activeAdmin) {
          setCurrentTab('admin-visual-editor');
        } else {
          setCurrentTab('admin-login');
        }
      } else if (path.startsWith('admin')) {
        if (!activeAdmin) {
          setCurrentTab('admin-login');
        } else {
          setCurrentTab(path === 'admin' || path === 'admin-dashboard' ? 'admin-visual-editor' : path);
        }
      } else {
        if (!currentTabRef.current.startsWith('admin')) {
          setCurrentTab('home');
        }
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleAdminNavigate = (tab: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'admin-login') {
      setCurrentTab('admin-login');
      window.location.hash = '#/panel-secure-access';
      return;
    }
    if (tab.startsWith('admin')) {
      setCurrentTab(tab);
      window.location.hash = `#/${tab}`;
      return;
    }
    setCurrentTab(tab);
    window.location.hash = `#/${tab === 'home' ? '' : tab}`;
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    handleAdminNavigate('admin-visual-editor');
  };

  const handleLogout = async () => {
    await storageService.logout();
    setCurrentUser(null);
    handleAdminNavigate('admin-login');
  };

  const handleSaveProduct = async (product: Product) => {
    await storageService.saveProduct(product);
    const updated = await storageService.getProducts();
    const updatedCats = await storageService.getCategories();
    setProducts(updated);
    setCategories(updatedCats);
  };

  const handleDeleteProduct = async (productId: string) => {
    await storageService.deleteProduct(productId);
    const updated = await storageService.getProducts();
    setProducts(updated);
  };

  const handleAddCategory = async (catName: string) => {
    const newCat = await storageService.createCategory(catName);
    const updatedCats = await storageService.getCategories();
    setCategories(updatedCats);
    return newCat;
  };

  const handleUpdateCatalog = async (info: Partial<CatalogInfo>) => {
    const updated = await storageService.updateCatalog(info);
    setCatalog(updated);
  };

  const handleSaveSliderProducts = async (items: SliderProduct[]) => {
    const updated = await storageService.saveSliderProducts(items);
    setSliderProducts(updated);
  };

  const handleMarkAsRead = async (messageId: string) => {
    await storageService.markMessageAsRead(messageId);
    const updated = await storageService.getMessages();
    setMessages(updated);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await storageService.deleteMessage(messageId);
    const updated = await storageService.getMessages();
    setMessages(updated);
  };

  const handleResetData = async () => {
    await storageService.resetToDefaults();
    await loadData();
  };

  const handleUpdateAdminProfile = async (username: string, password?: string) => {
    const updated = await storageService.updateAdminCredentials(username, password);
    setCurrentUser(updated);
  };

  // Open Order Modal for specific product or general
  const handleOpenOrder = (product?: KitchenProductItem) => {
    setSelectedProduct(product || null);
    setIsOrderModalOpen(true);
  };

  // Dedicated Secret Admin Login View
  if (currentTab === 'admin-login') {
    return (
      <AdminLogin
        onSuccess={handleLoginSuccess}
        onBackToHome={() => handleAdminNavigate('home')}
      />
    );
  }

  // Dedicated Secret Admin Dashboard Layout
  if (currentTab.startsWith('admin')) {
    if (!currentUser) {
      return (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onBackToHome={() => handleAdminNavigate('home')}
        />
      );
    }

    const unreadCount = messages.filter((m) => m.status === 'unread').length;

    return (
      <AdminLayout
        currentTab={currentTab}
        onNavigate={handleAdminNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadMessagesCount={unreadCount}
      >
        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            products={products}
            messages={messages}
            categoriesCount={categories.length}
            onNavigate={handleAdminNavigate}
            onOpenNewProduct={() => {
              setOpenProductModalOnAdmin(true);
              handleAdminNavigate('admin-products');
            }}
          />
        )}

        {currentTab === 'admin-products' && (
          <AdminProducts
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            isModalOpenInitially={openProductModalOnAdmin}
          />
        )}

        {currentTab === 'admin-visual-editor' && (
          <AdminVisualEditor
            onNavigate={handleAdminNavigate}
            sliderProducts={sliderProducts}
            catalog={catalog}
          />
        )}

        {currentTab === 'admin-catalog' && (
          <AdminCatalog
            catalog={catalog || INITIAL_CATALOG}
            onUpdateCatalog={handleUpdateCatalog}
          />
        )}

        {currentTab === 'admin-slider' && (
          <AdminSlider
            items={sliderProducts}
            onSave={handleSaveSliderProducts}
          />
        )}

        {currentTab === 'admin-messages' && (
          <AdminMessages
            messages={messages}
            onMarkAsRead={handleMarkAsRead}
            onDeleteMessage={handleDeleteMessage}
          />
        )}

        {currentTab === 'admin-settings' && catalog && (
          <AdminSettings
            currentUser={currentUser}
            products={products}
            categories={categories}
            catalog={catalog}
            messages={messages}
            onResetData={handleResetData}
            onUpdateAdminProfile={handleUpdateAdminProfile}
          />
        )}

        {currentTab === 'admin-cloudflare' && <CloudflareGuide />}
      </AdminLayout>
    );
  }

  // Main Public Website: IDEA HOME (آیدیا هوم) Official Site
  return (
    <div className="min-h-screen bg-[#1E4B57] text-[#EDEAE4] flex flex-col font-vazir relative selection:bg-[#346D80] selection:text-[#EDEAE4]" dir="rtl">
      {/* 1. Header with logo and RTL navigation */}
      <Header
        onOpenOrderModal={() => handleOpenOrder()}
        onOpenCatalogModal={() => handleOpenOrder()}
      />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">
        {/* 2. Hero Section with gradient text, glass CTA, and interactive product showcase */}
        <Hero
          onOpenOrderModal={() => handleOpenOrder()}
        />

        {/* 2.5 10 Products Showcase Slider with Next/Prev navigation and Catalog Download CTA */}
        <ProductSlider
          onOpenOrderModal={(p) => handleOpenOrder(p)}
          items={sliderProducts}
          catalogUrl={catalog?.fileUrl}
        />

        {/* 4. Features Section: Grid of glassmorphism cards for kitchenware qualities */}
        <Features onOpenOrderModal={() => handleOpenOrder()} />

        {/* Interactive FAQ Section for kitchenware inquiries */}
        <FAQSection />

        {/* 7. Final CTA Section with Primary & Dark Teal gradient, soft blobs, and dual buttons */}
        <FinalCTA
          onOpenOrderModal={() => handleOpenOrder()}
          catalogUrl={catalog?.fileUrl}
        />
      </main>

      {/* 8. Footer: Multi-column layout with repeated logo, products, about, contact, and required copyright */}
      <Footer
        onOpenOrderModal={() => handleOpenOrder()}
        onOpenAdminLogin={() => handleAdminNavigate('admin-login')}
      />

      {/* Interactive Order & Inquiry Modal */}
      <OrderModal
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Interactive Wholesale Batch & Margin Estimator Modal */}
      <BatchEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onOpenOrderWithDetails={(details) => {
          setIsEstimatorOpen(false);
          setIsOrderModalOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ViewportProvider>
      <ContentProvider>
        <AppInner />
      </ContentProvider>
    </ViewportProvider>
  );
}