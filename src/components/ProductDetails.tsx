import { ArrowLeft, Package, Sparkles, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Product, Ingredient, User } from '../lib/supabase';
import { AdvancedHealthMeter } from './AdvancedHealthMeter';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProductDetailsProps {
  product: Product;
  ingredients: Ingredient[];
  onBack: () => void;
  user: User;
}

interface HealthyAlternative {
  id: string;
  unhealthy_product_category: string;
  alternative_product_name: string;
  alternative_brand: string | null;
  alternative_image_url: string | null;
  health_score: number;
  sugar_content: number;
  caffeine_level: string;
  benefits: string[];
  suitable_for_ages: string[];
}

export function ProductDetails({ product, ingredients, onBack, user }: ProductDetailsProps) {
  const [alternatives, setAlternatives] = useState<HealthyAlternative[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  const totalTablespoons = ingredients.reduce(
    (sum, ing) => sum + Number(ing.quantity_tablespoons),
    0
  );

  const convertToTeaspoons = (tablespoons: number) => tablespoons * 3;

  const getAgeGroup = (age: number) => {
    if (age < 13) return 'child';
    if (age < 18) return 'student';
    if (age < 60) return 'adult';
    return 'senior';
  };

  const calculateAdjustedScore = () => {
    if (product.health_score === null) return null;

    let adjustedScore = product.health_score;
    const ageGroup = getAgeGroup(user.age);
    const caffeineLevel = product.caffeine_level || 'none';
    const sugarContent = product.sugar_content || 0;

    if (caffeineLevel === 'high') {
      if (ageGroup === 'child') adjustedScore -= 25;
      else if (ageGroup === 'student') adjustedScore -= 10;
      else if (ageGroup === 'senior') adjustedScore -= 15;
    } else if (caffeineLevel === 'medium') {
      if (ageGroup === 'child') adjustedScore -= 15;
    }

    if (sugarContent > 50) {
      adjustedScore -= ageGroup === 'child' ? 30 : 15;
    } else if (sugarContent > 30) {
      adjustedScore -= ageGroup === 'child' ? 20 : 10;
    } else if (sugarContent > 10) {
      adjustedScore -= 5;
    }

    return Math.max(1, Math.min(100, adjustedScore));
  };

  const adjustedScore = calculateAdjustedScore();
  const isUnhealthy = adjustedScore !== null && adjustedScore < 60;
  const ageGroup = getAgeGroup(user.age);

  useEffect(() => {
    if (isUnhealthy) {
      fetchHealthyAlternatives();
    }
  }, [isUnhealthy, product.health_category]);

  const fetchHealthyAlternatives = async () => {
    setLoadingAlternatives(true);
    try {
      const category = product.health_category || 'beverage';

      const { data, error } = await supabase
        .from('healthy_alternatives')
        .select('*')
        .eq('unhealthy_product_category', category)
        .limit(3);

      if (error) throw error;

      const filtered = (data || []).filter((alt: HealthyAlternative) =>
        alt.suitable_for_ages.includes(ageGroup)
      );

      setAlternatives(filtered.slice(0, 3));
    } catch (err) {
      console.error('Error fetching alternatives:', err);
    } finally {
      setLoadingAlternatives(false);
    }
  };

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
              Ingredient quantities measured in teaspoons - Standard conversion: 1 tsp = 5ml
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
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Barcode</p>
                  <p className="text-slate-200 font-mono text-sm">{product.barcode}</p>
                </div>
                {product.price && (
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Price</p>
                    <p className="text-emerald-300 font-bold text-lg">₹{product.price.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {product.health_score !== null && (
            <div className="mb-8">
              <AdvancedHealthMeter
                healthScore={product.health_score}
                sugarContent={product.sugar_content || 0}
                caffeineLevel={product.caffeine_level || 'none'}
                userAge={user.age}
                productCategory={product.health_category || 'beverage'}
              />
            </div>
          )}

          {isUnhealthy && !loadingAlternatives && alternatives.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-500/15 to-emerald-500/15 border border-emerald-500/40 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Sparkles size={24} className="text-emerald-400" />
                  <div>
                    <h4 className="text-lg font-bold text-white">Healthier Alternatives</h4>
                    <p className="text-xs text-slate-400">Based on your age and health profile</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {alternatives.map((alt, index) => (
                    <div
                      key={alt.id}
                      className="bg-slate-800/60 border border-slate-600 hover:border-emerald-500/50 rounded-xl p-5 transition duration-300 group"
                    >
                      <div className="flex gap-4">
                        {alt.alternative_image_url && (
                          <div className="flex-shrink-0">
                            <img
                              src={alt.alternative_image_url}
                              alt={alt.alternative_product_name}
                              className="w-24 h-24 object-cover rounded-lg shadow-md"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                                Alternative #{index + 1}
                              </p>
                              <h5 className="text-base font-bold text-white">
                                {alt.alternative_product_name}
                              </h5>
                              {alt.alternative_brand && (
                                <p className="text-sm text-slate-400">{alt.alternative_brand}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-3 py-1">
                              <Heart size={14} className="text-emerald-400" />
                              <span className="text-sm font-bold text-emerald-300">{alt.health_score}%</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-slate-400">Sugar:</span>
                              <span className="text-white font-semibold">{alt.sugar_content}g</span>
                            </div>
                            <div className="w-px h-4 bg-slate-600"></div>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-slate-400">Caffeine:</span>
                              <span className="text-white font-semibold capitalize">{alt.caffeine_level}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {alt.benefits.slice(0, 4).map((benefit, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full px-2 py-0.5"
                              >
                                <CheckCircle size={10} />
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
                  <ArrowRight size={14} className="text-emerald-400" />
                  <span>Swapping to these alternatives can improve your health score by {100 - (adjustedScore || 50)}%</span>
                </div>
              </div>
            </div>
          )}

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
