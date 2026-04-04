import { ArrowLeft, Package } from 'lucide-react';
import { Product, Ingredient } from '../lib/supabase';

interface ProductDetailsProps {
  product: Product;
  ingredients: Ingredient[];
  onBack: () => void;
}

export function ProductDetails({ product, ingredients, onBack }: ProductDetailsProps) {
  const totalTablespoons = ingredients.reduce(
    (sum, ing) => sum + Number(ing.quantity_tablespoons),
    0
  );

  const convertToTeaspoons = (tablespoons: number) => tablespoons * 3;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition mb-3"
          >
            <ArrowLeft size={20} />
            <span>Scan Another</span>
          </button>
          <h2 className="text-2xl font-bold text-white">Product Details</h2>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-3 mb-6 border border-blue-200">
            <p className="text-xs text-blue-700 italic text-center">
              <span className="block font-semibold mb-1">Measurement Note:</span>
              Ingredient quantities measured in teaspoons · Standard conversion: 1 tsp = 5ml
            </p>
          </div>

          <div className="flex items-start gap-4 mb-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package size={40} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
              )}
              <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-800">Ingredients</h4>
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold">{convertToTeaspoons(totalTablespoons).toFixed(2)} teaspoons</span>
              </div>
            </div>

            {ingredients.length > 0 ? (
              <div className="space-y-3">
                {ingredients
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition"
                    >
                      <span className="font-medium text-gray-800">
                        {ingredient.name}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {convertToTeaspoons(Number(ingredient.quantity_tablespoons)).toFixed(2)} teaspoons
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No ingredients information available for this product.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
