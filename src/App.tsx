import { useState, useEffect } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ProductDetails } from './components/ProductDetails';
import { LoginPage } from './components/LoginPage';
import { LanguageSelector } from './components/LanguageSelector';
import { DietPlansPage } from './components/DietPlansPage';
import { supabase, Product, Ingredient, User } from './lib/supabase';
import { useLanguage } from './contexts/LanguageContext';
import { Loader2, LogOut, Leaf, Apple, Crown, Heart } from 'lucide-react';

function App() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'scanner' | 'diet'>('scanner');

  useEffect(() => {
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const handleScanSuccess = async (barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .maybeSingle();

      if (productError) throw productError;

      if (!productData) {
        setError(t('common.notFound') + ' ' + t('common.tryManual'));
        setProduct(null);
        setIngredients([]);
        setLoading(false);
        return;
      }

      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('product_id', productData.id);

      if (ingredientsError) throw ingredientsError;

      setProduct(productData);
      setIngredients(ingredientsData || []);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(t('common.error'));
      setProduct(null);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setProduct(null);
    setIngredients([]);
    setError(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-3 shadow-2xl">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {t('app.title')}
              </h1>
              <p className="text-emerald-400 text-sm font-light">
                {t('app.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <div className="flex gap-2 bg-slate-700/30 p-1 rounded-lg border border-slate-600">
                <button
                  onClick={() => { setCurrentView('scanner'); setProduct(null); }}
                  className={`px-4 py-2 rounded font-semibold transition text-sm ${
                    currentView === 'scanner'
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Leaf size={14} className="inline mr-1" />
                  Scanner
                </button>
                <button
                  onClick={() => { setCurrentView('diet'); setProduct(null); }}
                  className={`px-4 py-2 rounded font-semibold transition text-sm ${
                    currentView === 'diet'
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Apple size={14} className="inline mr-1" />
                  Diet Plans
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-red-400/30"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* VIP Welcome Box */}
        <div className="mb-12 bg-gradient-to-r from-amber-600/20 via-amber-500/15 to-orange-600/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl hover:shadow-amber-500/20 transition duration-300">
          <div className="relative overflow-hidden p-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg">
                  <Crown className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-amber-300 uppercase tracking-widest">VIP Member</span>
                  <span className="text-amber-400/60">✨</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">{user.name}</h2>
                <p className="text-amber-100/80 text-sm">Welcome to your personalized health & wellness journey</p>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Your Member Status</p>
                  <p className="text-lg font-bold text-amber-300">Premium</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Joined</p>
                  <p className="text-lg font-bold text-emerald-400">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16 mb-4">
              <Loader2 className="animate-spin text-emerald-500 absolute inset-0" size={64} />
            </div>
            <p className="text-slate-300">{t('common.loading')}</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6 max-w-md mx-auto backdrop-blur-sm animate-in fade-in">
            <p className="text-red-300 text-center mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Scanner View */}
        {currentView === 'scanner' && (
          <>
            {!loading && !product && !error && (
              <BarcodeScanner onScanSuccess={handleScanSuccess} />
            )}

            {!loading && product && (
              <ProductDetails
                product={product}
                ingredients={ingredients}
                onBack={handleBack}
                user={user}
              />
            )}
          </>
        )}

        {/* Diet Plans View */}
        {currentView === 'diet' && (
          <DietPlansPage userId={user.id} />
        )}
      </div>
    </div>
  );
}

export default App;
