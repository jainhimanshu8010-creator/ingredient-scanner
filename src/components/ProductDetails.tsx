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
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition mb-6 font-semibold"
      >
        <ArrowLeft size={20} />
        <span>Scan Another Product</span>
      </button>

      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">Product Details</h2>
          <p className="text-emerald-100 text-sm mt-1">Complete ingredient breakdown</p>
        </div>

        <div className="p-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8">
            <p className="text-xs text-emerald-300 text-center">
              <span className="block font-semibold mb-1">Measurement Note</span>
              Ingredient quantities measured in teaspoons · Standard conversion: 1 tsp = 5ml
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1 flex justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full max-w-xs h-auto object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full max-w-xs aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border border-slate-600">
                  <Package size={64} className="text-slate-500" />
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-lg text-emerald-400 font-semibold mb-3">{product.brand}</p>
              )}
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Barcode</p>
                <p className="text-slate-200 font-mono">{product.barcode}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h4 className="text-xl font-bold text-white">Ingredients</h4>
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Volume</p>
                <p className="text-emerald-300 font-semibold">{convertToTeaspoons(totalTablespoons).toFixed(2)} teaspoons</p>
              </div>
            </div>

            {ingredients.length > 0 ? (
              <div className="space-y-3">
                {ingredients
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((ingredient, index) => (
                    <div
                      key={ingredient.id}
                      className="bg-slate-700/30 border border-slate-600/50 hover:border-emerald-500/50 rounded-lg p-4 flex items-center justify-between transition duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400 font-semibold text-sm w-6 text-center">
                          {index + 1}.
                        </span>
                        <span className="font-medium text-white group-hover:text-emerald-300 transition">
                          {ingredient.name}
                        </span>
                      </div>
                      <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent font-bold">
                        {convertToTeaspoons(Number(ingredient.quantity_tablespoons)).toFixed(2)} tsp
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Package size={48} className="mx-auto mb-3 text-slate-500" />
                <p className="text-sm">No ingredients information available for this product</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
