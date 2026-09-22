import React, { useState, useEffect, Suspense, lazy } from 'react';
import { storageService } from './services/storage';
import {
  Product,
  Category,
  CatalogInfo,
  PriceListInfo,
  ContactMessage,
  AdminUser,
  CompanyPhoto,
} from './types';
import {
  INITIAL_CATALOG,
  INITIAL_PRICE_LIST,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COMPANY_PHOTOS,
} from './data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from './data/sliderProducts';
import {
  sanitizeCategories,
  sanitizeProducts,
} from './utils/imageUtils';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductSlider } from './components/ProductSlider';
import { Features } from './components/Features';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { HomeCategoriesSection } from './components/HomeCategoriesSection';
import { HomeCompanyPhotosSection } from './components/HomeCompanyPhotosSection';
import { CoverflowLandingPage } from './components/CoverflowLandingPage';
import { KitchenProductItem } from './data/kitchenProducts';
import { getSafeDownloadUrl } from './utils/catalogDownload';
import { SliderProduct } from './types';
import {
  ContentProvider,
  useSiteContent,
} from './context/ContentContext';
import { ViewportProvider } from './context/ViewportContext';

// Lazy loaded interactive modals - non-blocking for initial page load
const OrderModal = lazy(() =>
  import('./components/OrderModal').then((m) => ({
    default: m.OrderModal,
  }))
);

const BatchEstimatorModal = lazy(() =>
  import('./components/BatchEstimatorModal').then((m) => ({
    default: m.BatchEstimatorModal,
  }))
);

// Lazy loaded public sub-pages
const CategoriesPage = lazy(() =>
  import('./pages/CategoriesPage').then((m) => ({
    default: m.CategoriesPage,
  }))
);

const CompanyPhotosPage = lazy(() =>
  import('./pages/CompanyPhotosPage').then((m) => ({
    default: m.CompanyPhotosPage,
  }))
);

// Lazy loaded secure admin components - completely excluded from
// standard visitor JS bundle
const AdminLogin = lazy(() =>
  import('./pages/admin/AdminLogin').then((m) => ({
    default: m.AdminLogin,
  }))
);

const AdminLayout = lazy(() =>
  import('./pages/admin/AdminLayout').then((m) => ({
    default: m.AdminLayout,
  }))
);

const AdminDashboard = lazy(() =>
  import('./pages/admin/AdminDashboard').then((m) => ({
    default: m.AdminDashboard,
  }))
);

const AdminProducts = lazy(() =>
  import('./pages/admin/AdminProducts').then((m) => ({
    default: m.AdminProducts,
  }))
);

const AdminCatalog = lazy(() =>
  import('./pages/admin/AdminCatalog').then((m) => ({
    default: m.AdminCatalog,
  }))
);

const AdminPriceList = lazy(() =>
  import('./pages/admin/AdminPriceList').then((m) => ({
    default: m.AdminPriceList,
  }))
);

const AdminSlider = lazy(() =>
  import('./pages/admin/AdminSlider').then((m) => ({
    default: m.AdminSlider,
  }))
);

const AdminMessages = lazy(() =>
  import('./pages/admin/AdminMessages').then((m) => ({
    default: m.AdminMessages,
  }))
);

const AdminSettings = lazy(() =>
  import('./pages/admin/AdminSettings').then((m) => ({
    default: m.AdminSettings,
  }))
);

const AdminVisualEditor = lazy(() =>
  import('./pages/admin/AdminVisualEditor').then((m) => ({
    default: m.AdminVisualEditor,
  }))
);

const AdminCategories = lazy(() =>
  import('./pages/admin/AdminCategories').then((m) => ({
    default: m.AdminCategories,
  }))
);

const AdminCompanyPhotos = lazy(() =>
  import('./pages/admin/AdminCompanyPhotos').then((m) => ({
    default: m.AdminCompanyPhotos,
  }))
);

const CloudflareGuide = lazy(() =>
  import('./pages/admin/CloudflareGuide').then((m) => ({
    default: m.CloudflareGuide,
  }))
);

const PageFallback = () => (
  <div
    className="min-h-[40vh] flex items-center justify-center p-8 text-[#EDEAE4]/70"
    dir="rtl"
  >
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-vazir">
        در حال بارگذاری...
      </span>
    </div>
  </div>
);

/**
 * Full-screen splash shown only when there is no cached site content.
 *
 * Returning visitors should already have content from ContentContext's
 * synchronous local cache and therefore should never see this screen.
 */
const ContentLoadingScreen = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#1E4B57',
    }}
  >
    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppInner() {
  /*
   * Content is handled by ContentContext.
   *
   * Returning visitor:
   *   cached content -> immediate render
   *   server revalidation -> background
   *
   * First-time visitor:
   *   waits only until the first server content is available.
   */
  const { isContentReady } = useSiteContent();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash
      .toLowerCase()
      .replace(/^#\/?|\/$/g, '');

    if (hash.startsWith('admin')) return 'admin-login';
    if (hash.startsWith('categories')) return 'categories';
    if (hash.startsWith('company-photos')) return 'company-photos';
    if (hash === 'coverflow' || hash === 'carousel') {
      return 'coverflow';
    }

    return 'home';
  });

  const currentTabRef = React.useRef<string>(currentTab);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  // Interactive Modals
  const [isOrderModalOpen, setIsOrderModalOpen] =
    useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] =
    useState<KitchenProductItem | null>(null);

  const [isEstimatorOpen, setIsEstimatorOpen] =
    useState<boolean>(false);

  // Admin / public data state
  const [products, setProducts] = useState<Product[]>(() =>
    sanitizeProducts(INITIAL_PRODUCTS)
  );

  const [categories, setCategories] = useState<Category[]>(() =>
    sanitizeCategories(INITIAL_CATEGORIES)
  );

  const [catalog, setCatalog] =
    useState<CatalogInfo>(() => INITIAL_CATALOG);

  const [priceList, setPriceList] =
    useState<PriceListInfo>(() => INITIAL_PRICE_LIST);

  const [sliderProducts, setSliderProducts] =
    useState<SliderProduct[]>(() => DEFAULT_SLIDER_PRODUCTS);

  const [companyPhotos, setCompanyPhotos] =
    useState<CompanyPhoto[]>(() => INITIAL_COMPANY_PHOTOS);

  const [selectedCategoryNavId, setSelectedCategoryNavId] =
    useState<string>('');

  const [isSliderLoading, setIsSliderLoading] =
    useState<boolean>(true);

  const [messages, setMessages] =
    useState<ContactMessage[]>([]);

  const [currentUser, setCurrentUser] =
    useState<AdminUser | null>(() =>
      storageService.getCurrentAdmin()
    );

  const [openProductModalOnAdmin, setOpenProductModalOnAdmin] =
    useState<boolean>(false);

  // ------------------------------------------------------------------
  // ADMIN DATA
  // ------------------------------------------------------------------

  const loadAdminData = async () => {
    try {
      const [prods, cats, msgs] = await Promise.all([
        storageService.getProducts(),
        storageService.getCategories(),
        storageService.getMessages(),
      ]);

      setProducts(prods);
      setCategories(cats);
      setMessages(msgs);
    } catch (err) {
      console.error(
        'Error loading admin data:',
        err
      );
    }
  };

  // ------------------------------------------------------------------
  // PUBLIC DATA - OPTIMIZED
  //
  // Critical:
  //   Slider + Categories
  //
  // Secondary:
  //   Catalog + Price List
  //
  // Deferred:
  //   Company Photos
  //
  // This prevents all public storage requests from competing during
  // the first browser paint.
  // ------------------------------------------------------------------

  const loadPublicData = async () => {
    setIsSliderLoading(true);

    // --------------------------------------------------------------
    // 1. CRITICAL ABOVE-THE-FOLD DATA
    // --------------------------------------------------------------

    try {
      const [
        sliderItems,
        allCategories,
      ] = await Promise.all([
        storageService.getSliderProducts(),
        storageService.getCategories(),
      ]);

      if (
        sliderItems &&
        sliderItems.length > 0
      ) {
        setSliderProducts(sliderItems);
      }

      if (
        allCategories &&
        allCategories.length > 0
      ) {
        setCategories(allCategories);
      }
    } catch (err) {
      console.error(
        'Error loading critical public data:',
        err
      );
    } finally {
      setIsSliderLoading(false);
    }

    // --------------------------------------------------------------
    // 2. SECONDARY DATA
    //
    // These do not prevent the first page paint.
    // --------------------------------------------------------------

    const loadSecondaryData = async () => {
      try {
        const [
          catlg,
          priceLst,
        ] = await Promise.all([
          storageService.getCatalog(),
          storageService.getPriceList(),
        ]);

        if (catlg) {
          setCatalog(catlg);
        }

        if (priceLst) {
          setPriceList(priceLst);
        }
      } catch (err) {
        console.error(
          'Error loading secondary public data:',
          err
        );
      }
    };

    // --------------------------------------------------------------
    // 3. DEFERRED BELOW-THE-FOLD DATA
    // --------------------------------------------------------------

    const loadDeferredData = async () => {
      try {
        const compPhotos =
          await storageService.getCompanyPhotos();

        if (
          compPhotos &&
          compPhotos.length > 0
        ) {
          setCompanyPhotos(compPhotos);
        }
      } catch (err) {
        console.error(
          'Error loading company photos:',
          err
        );
      }
    };

    // Start secondary data without blocking current render.
    void loadSecondaryData();

    // Let the browser paint before loading below-the-fold photos.
    if (
      'requestIdleCallback' in window
    ) {
      window.requestIdleCallback(
        () => {
          void loadDeferredData();
        },
        {
          timeout: 1200,
        }
      );
    } else {
      window.setTimeout(() => {
        void loadDeferredData();
      }, 300);
    }
  };

  // ------------------------------------------------------------------
  // PUBLIC STARTUP
  // ------------------------------------------------------------------

  useEffect(() => {
    void loadPublicData();
  }, []);

  // ------------------------------------------------------------------
  // ADMIN STARTUP
  //
  // Admin data is never loaded for ordinary visitors.
  // ------------------------------------------------------------------

  useEffect(() => {
    const isAdminActive =
      currentTab.startsWith('admin') ||
      Boolean(currentUser);

    if (isAdminActive) {
      void loadAdminData();
    }
  }, [
    currentTab,
    currentUser,
  ]);

  // ------------------------------------------------------------------
  // ROUTING
  // ------------------------------------------------------------------

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname
        .toLowerCase()
        .replace(/^\/|\/$/g, '');

      const hash = window.location.hash
        .toLowerCase()
        .replace(/^#\/?|\/$/g, '');

      const activeAdmin =
        storageService.getCurrentAdmin();

      // In-page public anchors
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
        if (
          currentTabRef.current.startsWith(
            'admin'
          )
        ) {
          return;
        }
      }

      // --------------------------------------------------------------
      // HASH ROUTING
      // --------------------------------------------------------------

      if (hash) {
        if (
          hash === 'panel-secure-access' ||
          hash === 'admin/login' ||
          hash === 'admin-login'
        ) {
          if (activeAdmin) {
            setCurrentTab(
              'admin-visual-editor'
            );
          } else {
            setCurrentTab(
              'admin-login'
            );
          }

          return;
        }

        if (
          hash.startsWith('admin')
        ) {
          if (!activeAdmin) {
            setCurrentTab(
              'admin-login'
            );
          } else {
            setCurrentTab(
              hash === 'admin' ||
              hash === 'admin-dashboard'
                ? 'admin-visual-editor'
                : hash
            );
          }

          return;
        }

        if (
          hash === 'categories' ||
          hash === 'product-categories' ||
          hash.startsWith('categories?')
        ) {
          const match =
            hash.match(/cat=([^&]+)/);

          if (
            match &&
            match[1]
          ) {
            setSelectedCategoryNavId(
              decodeURIComponent(
                match[1]
              )
            );
          }

          setCurrentTab(
            'categories'
          );

          return;
        }

        if (
          hash === 'company-photos' ||
          hash === 'factory-office' ||
          hash === 'photos' ||
          hash === 'gallery'
        ) {
          setCurrentTab(
            'company-photos'
          );

          return;
        }

        if (
          hash === 'coverflow' ||
          hash === 'showcase' ||
          hash === 'carousel'
        ) {
          setCurrentTab(
            'coverflow'
          );

          return;
        }

        if (
          hash === 'home' ||
          hash === 'factory' ||
          hash === ''
        ) {
          setCurrentTab(
            'home'
          );

          return;
        }

        if (
          currentTabRef.current.startsWith(
            'admin'
          )
        ) {
          return;
        }
      }

      // --------------------------------------------------------------
      // PATHNAME ROUTING
      // --------------------------------------------------------------

      if (
        path === 'panel-secure-access' ||
        path === 'admin/login' ||
        path === 'admin-login'
      ) {
        if (activeAdmin) {
          setCurrentTab(
            'admin-visual-editor'
          );
        } else {
          setCurrentTab(
            'admin-login'
          );
        }
      } else if (
        path.startsWith('admin')
      ) {
        if (!activeAdmin) {
          setCurrentTab(
            'admin-login'
          );
        } else {
          setCurrentTab(
            path === 'admin' ||
            path === 'admin-dashboard'
              ? 'admin-visual-editor'
              : path
          );
        }
      } else if (
        path === 'categories' ||
        path === 'product-categories'
      ) {
        setCurrentTab(
          'categories'
        );
      } else if (
        path === 'company-photos' ||
        path === 'factory-office' ||
        path === 'photos' ||
        path === 'gallery'
      ) {
        setCurrentTab(
          'company-photos'
        );
      } else {
        if (
          !currentTabRef.current.startsWith(
            'admin'
          )
        ) {
          setCurrentTab(
            'home'
          );
        }
      }
    };

    handleRouteChange();

    window.addEventListener(
      'hashchange',
      handleRouteChange
    );

    window.addEventListener(
      'popstate',
      handleRouteChange
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        handleRouteChange
      );

      window.removeEventListener(
        'popstate',
        handleRouteChange
      );
    };
  }, []);

  // ------------------------------------------------------------------
  // NAVIGATION
  // ------------------------------------------------------------------

  const handleAdminNavigate = (
    tab: string
  ) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (
      tab.startsWith('admin')
    ) {
      void loadAdminData();
    }

    if (
      tab === 'admin-login'
    ) {
      setCurrentTab(
        'admin-login'
      );

      window.location.hash =
        '#/panel-secure-access';

      return;
    }

    if (
      tab.startsWith('admin')
    ) {
      setCurrentTab(tab);
      window.location.hash =
        `#/${tab}`;

      return;
    }

    setCurrentTab(tab);

    window.location.hash =
      `#/${tab === 'home' ? '' : tab}`;
  };

  const handleLoginSuccess = (
    user: AdminUser
  ) => {
    // The admin-data effect below will load the data once.
    // Avoid doing the exact same request here a second time.
    setCurrentUser(user);
    handleAdminNavigate(
      'admin-visual-editor'
    );
  };

  const handleLogout = async () => {
    await storageService.logout();

    setCurrentUser(null);

    handleAdminNavigate(
      'admin-login'
    );
  };

  // ------------------------------------------------------------------
  // PRODUCT MANAGEMENT
  // ------------------------------------------------------------------

  const handleSaveProduct = async (
    product: Product
  ) => {
    await storageService.saveProduct(
      product
    );

    const [
      updated,
      updatedCats,
    ] = await Promise.all([
      storageService.getProducts(),
      storageService.getCategories(),
    ]);

    setProducts(updated);
    setCategories(updatedCats);
  };

  const handleDeleteProduct = async (
    productId: string
  ) => {
    await storageService.deleteProduct(
      productId
    );

    const updated =
      await storageService.getProducts();

    setProducts(updated);
  };

  const handleAddCategory = async (
    catName: string
  ) => {
    const newCat =
      await storageService.createCategory(
        catName
      );

    const updatedCats =
      await storageService.getCategories();

    setCategories(updatedCats);

    return newCat;
  };

  // ------------------------------------------------------------------
  // CATALOG / PRICE LIST
  // ------------------------------------------------------------------

  const handleUpdateCatalog = async (
    info: Partial<CatalogInfo>
  ) => {
    const updated =
      await storageService.updateCatalog(
        info
      );

    setCatalog(updated);
  };

  const handleUpdatePriceList = async (
    info: Partial<PriceListInfo>
  ) => {
    const updated =
      await storageService.updatePriceList(
        info
      );

    setPriceList(updated);
  };

  const handleDownloadPriceList = () => {
    try {
      const targetUrl =
        priceList?.fileUrl ||
        '/ideahome-pricelist.pdf';

      const safeUrl =
        getSafeDownloadUrl(
          targetUrl
        );

      const link =
        document.createElement('a');

      link.href = safeUrl;

      link.download =
        `IdeaHome-PriceList-${
          priceList?.version ||
          '1404'
        }.pdf`;

      if (
        safeUrl.startsWith('http')
      ) {
        link.target = '_blank';
        link.rel =
          'noopener noreferrer';
      }

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );
    } catch (err) {
      console.error(
        'Download price list failed',
        err
      );
    }
  };

  // ------------------------------------------------------------------
  // SLIDER
  // ------------------------------------------------------------------

  const handleSaveSliderProducts =
    async (
      items: SliderProduct[]
    ) => {
      const updated =
        await storageService.saveSliderProducts(
          items
        );

      setSliderProducts(
        updated
      );
    };

  // ------------------------------------------------------------------
  // MESSAGES
  // ------------------------------------------------------------------

  const handleMarkAsRead = async (
    messageId: string
  ) => {
    await storageService.markMessageAsRead(
      messageId
    );

    const updated =
      await storageService.getMessages();

    setMessages(updated);
  };

  const handleDeleteMessage =
    async (
      messageId: string
    ) => {
      await storageService.deleteMessage(
        messageId
      );

      const updated =
        await storageService.getMessages();

      setMessages(updated);
    };

  // ------------------------------------------------------------------
  // RESET
  // ------------------------------------------------------------------

  const handleResetData = async () => {
    await storageService.resetToDefaults();

    await Promise.all([
      loadPublicData(),
      loadAdminData(),
    ]);
  };

  // ------------------------------------------------------------------
  // ADMIN PROFILE
  // ------------------------------------------------------------------

  const handleUpdateAdminProfile =
    async (
      username: string,
      password?: string
    ) => {
      const updated =
        await storageService.updateAdminCredentials(
          username,
          password
        );

      setCurrentUser(updated);
    };

  // ------------------------------------------------------------------
  // ORDER MODAL
  // ------------------------------------------------------------------

  const handleOpenOrder = (
    product?: KitchenProductItem
  ) => {
    setSelectedProduct(
      product || null
    );

    setIsOrderModalOpen(
      true
    );
  };

  // ------------------------------------------------------------------
  // CONTENT READY GATE
  //
  // IMPORTANT:
  // ContentContext now initializes from cache synchronously.
  // Therefore returning visitors do NOT wait here.
  //
  // Only first-time visitors without cached content wait for the
  // authoritative server content.
  // ------------------------------------------------------------------

  if (!isContentReady) {
    return (
      <ContentLoadingScreen />
    );
  }

  // ------------------------------------------------------------------
  // ADMIN LOGIN
  // ------------------------------------------------------------------

  if (
    currentTab ===
    'admin-login'
  ) {
    return (
      <Suspense
        fallback={
          <PageFallback />
        }
      >
        <AdminLogin
          onSuccess={
            handleLoginSuccess
          }
          onBackToHome={() =>
            handleAdminNavigate(
              'home'
            )
          }
        />
      </Suspense>
    );
  }

  // ------------------------------------------------------------------
  // ADMIN DASHBOARD
  // ------------------------------------------------------------------

  if (
    currentTab.startsWith(
      'admin'
    )
  ) {
    if (!currentUser) {
      return (
        <Suspense
          fallback={
            <PageFallback />
          }
        >
          <AdminLogin
            onSuccess={
              handleLoginSuccess
            }
            onBackToHome={() =>
              handleAdminNavigate(
                'home'
              )
            }
          />
        </Suspense>
      );
    }

    const unreadCount =
      messages.filter(
        (m) =>
          m.status ===
          'unread'
      ).length;

    return (
      <Suspense
        fallback={
          <PageFallback />
        }
      >
        <AdminLayout
          currentTab={
            currentTab
          }
          onNavigate={
            handleAdminNavigate
          }
          currentUser={
            currentUser
          }
          onLogout={
            handleLogout
          }
          unreadMessagesCount={
            unreadCount
          }
        >
          {currentTab ===
            'admin-dashboard' && (
            <AdminDashboard
              products={
                products
              }
              messages={
                messages
              }
              categoriesCount={
                categories.length
              }
              onNavigate={
                handleAdminNavigate
              }
              onOpenNewProduct={() => {
                setOpenProductModalOnAdmin(
                  true
                );

                handleAdminNavigate(
                  'admin-products'
                );
              }}
            />
          )}

          {currentTab ===
            'admin-products' && (
            <AdminProducts
              products={
                products
              }
              categories={
                categories
              }
              onSaveProduct={
                handleSaveProduct
              }
              onDeleteProduct={
                handleDeleteProduct
              }
              onAddCategory={
                handleAddCategory
              }
              isModalOpenInitially={
                openProductModalOnAdmin
              }
            />
          )}

          {currentTab ===
            'admin-visual-editor' && (
            <AdminVisualEditor
              onNavigate={
                handleAdminNavigate
              }
              sliderProducts={
                sliderProducts
              }
              catalog={
                catalog
              }
              categories={
                categories
              }
              companyPhotos={
                companyPhotos
              }
            />
          )}

          {currentTab ===
            'admin-catalog' && (
            <AdminCatalog
              catalog={
                catalog ||
                INITIAL_CATALOG
              }
              onUpdateCatalog={
                handleUpdateCatalog
              }
            />
          )}

          {currentTab ===
            'admin-price-list' && (
            <AdminPriceList
              priceList={
                priceList ||
                INITIAL_PRICE_LIST
              }
              onUpdatePriceList={
                handleUpdatePriceList
              }
            />
          )}

          {currentTab ===
            'admin-categories' && (
            <AdminCategories
              categories={
                categories
              }
              onRefresh={
                loadAdminData
              }
            />
          )}

          {currentTab ===
            'admin-company-photos' && (
            <AdminCompanyPhotos />
          )}

          {currentTab ===
            'admin-slider' && (
            <AdminSlider
              items={
                sliderProducts
              }
              onSave={
                handleSaveSliderProducts
              }
            />
          )}

          {currentTab ===
            'admin-messages' && (
            <AdminMessages
              messages={
                messages
              }
              onMarkAsRead={
                handleMarkAsRead
              }
              onDelete={
                handleDeleteMessage
              }
            />
          )}

          {currentTab ===
            'admin-settings' &&
            catalog && (
              <AdminSettings
                currentUser={
                  currentUser
                }
                products={
                  products
                }
                categories={
                  categories
                }
                catalog={
                  catalog
                }
                messages={
                  messages
                }
                onResetData={
                  handleResetData
                }
                onUpdateAdminProfile={
                  handleUpdateAdminProfile
                }
              />
            )}

          {currentTab ===
            'admin-cloudflare' && (
            <CloudflareGuide />
          )}
        </AdminLayout>
      </Suspense>
    );
  }

  // ------------------------------------------------------------------
  // CATEGORIES PAGE
  // ------------------------------------------------------------------

  if (
    currentTab ===
    'categories'
  ) {
    return (
      <div
        className="min-h-screen bg-[#1E4B57] text-[#EDEAE4] flex flex-col font-vazir relative selection:bg-[#346D80] selection:text-[#EDEAE4]"
        dir="rtl"
      >
        <Header
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
          onOpenCatalogModal={() =>
            handleOpenOrder()
          }
          onDownloadPriceList={
            handleDownloadPriceList
          }
          onOpenCategoriesPage={() => {
            window.location.hash =
              '#categories';

            setCurrentTab(
              'categories'
            );
          }}
          onOpenCompanyPhotosPage={() => {
            window.location.hash =
              '#company-photos';

            setCurrentTab(
              'company-photos'
            );
          }}
          onOpenHomePage={() => {
            setSelectedCategoryNavId(
              ''
            );

            window.location.hash =
              '';

            setCurrentTab(
              'home'
            );
          }}
        />

        <main className="flex-1 pt-20">
          <Suspense
            fallback={
              <PageFallback />
            }
          >
            <CategoriesPage
              selectedCategoryId={
                selectedCategoryNavId
              }
              onBackToHome={() => {
                setSelectedCategoryNavId(
                  ''
                );

                window.location.hash =
                  '';

                setCurrentTab(
                  'home'
                );
              }}
              onOpenOrderModal={(p) =>
                handleOpenOrder(p)
              }
            />
          </Suspense>
        </main>

        <Footer
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
        />

        {/* Interactive Order & Inquiry Modal */}
        {isOrderModalOpen && (
          <Suspense
            fallback={null}
          >
            <OrderModal
              product={
                selectedProduct
              }
              isOpen={
                isOrderModalOpen
              }
              onClose={() => {
                setIsOrderModalOpen(
                  false
                );

                setSelectedProduct(
                  null
                );
              }}
            />
          </Suspense>
        )}

        {/* Interactive Wholesale Batch & Margin Estimator Modal */}
        {isEstimatorOpen && (
          <Suspense
            fallback={null}
          >
            <BatchEstimatorModal
              isOpen={
                isEstimatorOpen
              }
              onClose={() =>
                setIsEstimatorOpen(
                  false
                )
              }
              onOpenOrderWithDetails={() => {
                setIsEstimatorOpen(
                  false
                );

                setIsOrderModalOpen(
                  true
                );
              }}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------
  // COMPANY PHOTOS PAGE
  // ------------------------------------------------------------------

  if (
    currentTab ===
    'company-photos'
  ) {
    return (
      <div
        className="min-h-screen bg-[#1E4B57] text-[#EDEAE4] flex flex-col font-vazir relative selection:bg-[#346D80] selection:text-[#EDEAE4]"
        dir="rtl"
      >
        <Header
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
          onOpenCatalogModal={() =>
            handleOpenOrder()
          }
          onDownloadPriceList={
            handleDownloadPriceList
          }
          onOpenCategoriesPage={() => {
            window.location.hash =
              '#categories';

            setCurrentTab(
              'categories'
            );
          }}
          onOpenCompanyPhotosPage={() => {
            window.location.hash =
              '#company-photos';

            setCurrentTab(
              'company-photos'
            );
          }}
          onOpenHomePage={() => {
            window.location.hash =
              '';

            setCurrentTab(
              'home'
            );
          }}
        />

        <main className="flex-1 pt-20">
          <Suspense
            fallback={
              <PageFallback />
            }
          >
            <CompanyPhotosPage
              onBackToHome={() => {
                window.location.hash =
                  '';

                setCurrentTab(
                  'home'
                );
              }}
              onOpenOrderModal={() =>
                handleOpenOrder()
              }
            />
          </Suspense>
        </main>

        <Footer
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
        />

        {/* Interactive Order & Inquiry Modal */}
        {isOrderModalOpen && (
          <Suspense
            fallback={null}
          >
            <OrderModal
              product={
                selectedProduct
              }
              isOpen={
                isOrderModalOpen
              }
              onClose={() => {
                setIsOrderModalOpen(
                  false
                );

                setSelectedProduct(
                  null
                );
              }}
            />
          </Suspense>
        )}

        {/* Interactive Wholesale Batch & Margin Estimator Modal */}
        {isEstimatorOpen && (
          <Suspense
            fallback={null}
          >
            <BatchEstimatorModal
              isOpen={
                isEstimatorOpen
              }
              onClose={() =>
                setIsEstimatorOpen(
                  false
                )
              }
              onOpenOrderWithDetails={() => {
                setIsEstimatorOpen(
                  false
                );

                setIsOrderModalOpen(
                  true
                );
              }}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------
  // COVERFLOW
  // ------------------------------------------------------------------

  if (
    currentTab ===
    'coverflow'
  ) {
    return (
      <CoverflowLandingPage
        onSwitchToFactorySite={() => {
          window.location.hash =
            '#home';

          setCurrentTab(
            'home'
          );
        }}
      />
    );
  }

  // ------------------------------------------------------------------
  // MAIN PUBLIC WEBSITE
  // ------------------------------------------------------------------

  return (
    <div
      className="min-h-screen bg-[#1E4B57] text-[#EDEAE4] flex flex-col font-vazir relative selection:bg-[#346D80] selection:text-[#EDEAE4]"
      dir="rtl"
    >
      {/* Header */}
      <Header
        onOpenOrderModal={() =>
          handleOpenOrder()
        }
        onOpenCatalogModal={() =>
          handleOpenOrder()
        }
        onDownloadPriceList={
          handleDownloadPriceList
        }
        onOpenCategoriesPage={() => {
          window.location.hash =
            '#categories';

          setCurrentTab(
            'categories'
          );
        }}
        onOpenCompanyPhotosPage={() => {
          window.location.hash =
            '#company-photos';

          setCurrentTab(
            'company-photos'
          );
        }}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10">

        {/* Hero */}
        <Hero
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
          onDownloadPriceList={
            handleDownloadPriceList
          }
        />

        {/* Product Slider */}
        <ProductSlider
          onOpenOrderModal={(p) =>
            handleOpenOrder(p)
          }
          items={
            sliderProducts
          }
          catalogUrl={
            catalog?.fileUrl
          }
          loading={
            isSliderLoading
          }
        />

        {/* Categories */}
        <HomeCategoriesSection
          categories={
            categories
          }
          onOpenCategoriesPage={() => {
            setSelectedCategoryNavId(
              ''
            );

            window.location.hash =
              '#categories';

            setCurrentTab(
              'categories'
            );
          }}
          onSelectCategory={(
            catId
          ) => {
            setSelectedCategoryNavId(
              catId
            );

            window.location.hash =
              `#categories?cat=${catId}`;

            setCurrentTab(
              'categories'
            );
          }}
        />

        {/* Features */}
        <Features
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
        />

        {/* Company Photos */}
        <HomeCompanyPhotosSection
          photos={
            companyPhotos
          }
          onOpenCompanyPhotosPage={() => {
            window.location.hash =
              '#company-photos';

            setCurrentTab(
              'company-photos'
            );
          }}
        />

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <FinalCTA
          onOpenOrderModal={() =>
            handleOpenOrder()
          }
          catalogUrl={
            catalog?.fileUrl
          }
          onDownloadPriceList={
            handleDownloadPriceList
          }
          priceListUrl={
            priceList?.fileUrl
          }
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenOrderModal={() =>
          handleOpenOrder()
        }
        onOpenAdminLogin={() =>
          handleAdminNavigate(
            'admin-login'
          )
        }
      />

      {/* Order Modal */}
      {isOrderModalOpen && (
        <Suspense
          fallback={null}
        >
          <OrderModal
            product={
              selectedProduct
            }
            isOpen={
              isOrderModalOpen
            }
            onClose={() => {
              setIsOrderModalOpen(
                false
              );

              setSelectedProduct(
                null
              );
            }}
          />
        </Suspense>
      )}

      {/* Batch Estimator Modal */}
      {isEstimatorOpen && (
        <Suspense
          fallback={null}
        >
          <BatchEstimatorModal
            isOpen={
              isEstimatorOpen
            }
            onClose={() =>
              setIsEstimatorOpen(
                false
              )
            }
            onOpenOrderWithDetails={() => {
              setIsEstimatorOpen(
                false
              );

              setIsOrderModalOpen(
                true
              );
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

// --------------------------------------------------------------------
// ROOT APP
// --------------------------------------------------------------------

export default function App() {
  return (
    <ViewportProvider>
      <ContentProvider>
        <AppInner />
      </ContentProvider>
    </ViewportProvider>
  );
}
