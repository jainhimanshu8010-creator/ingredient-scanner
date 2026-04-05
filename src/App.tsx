import { useState, useEffect } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ProductDetails } from './components/ProductDetails';
import { LoginPage } from './components/LoginPage';
import { supabase, Product, Ingredient, User } from './lib/supabase';
import { Loader2, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

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
        setError(`Product with barcode "${barcode}" not found in our database.`);
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
      setError('An error occurred while fetching product data.');
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

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">FD</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                FOOD DECODE
              </h1>
              <p className="text-emerald-400 text-sm font-light">
                Scan To Decode Your Food
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div>
              <p className="text-slate-300 text-sm">Welcome back</p>
              <p className="text-white font-semibold">{user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16 mb-4">
              <Loader2 className="animate-spin text-emerald-500 absolute inset-0" size={64} />
            </div>
            <p className="text-slate-300">Loading product information...</p>
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

        {!loading && !product && !error && (
          <BarcodeScanner onScanSuccess={handleScanSuccess} />
        )}

        {!loading && product && (
          <ProductDetails
            product={product}
            ingredients={ingredients}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default App;
