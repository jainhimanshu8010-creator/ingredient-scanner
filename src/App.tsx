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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Ingredient Scanner
            </h1>
            <p className="text-gray-600">
              Scan any product barcode to see its ingredients and quantities
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm text-gray-700 font-medium">{user.name}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600">Loading product information...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <p className="text-red-800 text-center">{error}</p>
            <button
              onClick={handleBack}
              className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
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
