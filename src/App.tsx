import { useState } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ProductDetails } from './components/ProductDetails';
import { supabase, Product, Ingredient } from './lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const [product, setProduct] = useState<Product | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Ingredient Scanner
          </h1>
          <p className="text-gray-600">
            Scan any product barcode to see its ingredients and quantities
          </p>
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
