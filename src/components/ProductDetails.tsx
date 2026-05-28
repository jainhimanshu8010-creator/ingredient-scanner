import { ArrowLeft, Package, Sparkles, Heart, CheckCircle, ArrowRight, Leaf, AlertTriangle } from 'lucide-react';
import { Product, Ingredient, User } from '../lib/supabase';
import { AdvancedHealthMeter } from './AdvancedHealthMeter';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductDetailsProps {
  product: Product;
  ingredients: Ingredient[];
  onBack: () => void;
  user: User;
}

interface HealthyAlternative {
  id: string;
  unhealthy_product_category: string;
  related_product_barcode: string | null;
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
  const { t } = useLanguage();
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
  const isPoor = adjustedScore !== null && adjustedScore >= 60 && adjustedScore < 75;
  const showAlternatives = isUnhealthy || isPoor;
  const ageGroup = getAgeGroup(user.age);

  useEffect(() => {
    if (showAlternatives) {
      fetchHealthyAlternatives();
    }
  }, [showAlternatives, product.health_category, product.barcode]);

  const fetchHealthyAlternatives = async () => {
    setLoadingAlternatives(true);
    try {
      const barcode = product.barcode;
      const category = product.health_category || 'beverage';

      const { data: barcodeAlternatives, error: error1 } = await supabase
        .from('healthy_alternatives')
        .select('*')
        .eq('related_product_barcode', barcode);

      let results = barcodeAlternatives || [];

      if (results.length === 0) {
        const { data: categoryAlternatives, error: error2 } = await supabase
          .from('healthy_alternatives')
          .select('*')
          .eq('unhealthy_product_category', category);

        if (error2) throw error2;
        results = categoryAlternatives || [];
      }

      const filtered = results.filter((alt: HealthyAlternative) =>
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
        <span>{t('details.scanAnother')}</span>
      </button>

      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">{t('details.title')}</h2>
          <p className="text-emerald-100 text-sm mt-1">{t('details.subtitle')}</p>
        </div>

        <div className="p-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8">
            <p className="text-xs text-emerald-300 text-center">
              <span className="block font-semibold mb-1">{t('details.measurementNote')}</span>
              {t('details.measurementDesc')}
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
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('details.barcode')}</p>
                  <p className="text-slate-200 font-mono text-sm">{product.barcode}</p>
                </div>
                {product.price && (
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('details.price')}</p>
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

          {showAlternatives && !loadingAlternatives && alternatives.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-emerald-500/15 to-blue-500/15 border border-emerald-500/40 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-2">
                    <Leaf size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{t('alternatives.title')}</h4>
                    <p className="text-xs text-slate-400">{t('alternatives.subtitle')}</p>
                  </div>
                </div>

                {isUnhealthy && (
                  <div className="mb-4 bg-red-500/15 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">
                      {t('alternatives.unhealthyAlert')}
                    </p>
                  </div>
                )}

                {isPoor && (
                  <div className="mb-4 bg-yellow-500/15 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200">
                      {t('alternatives.poorAlert')}
                    </p>
                  </div>
                )}

                <div className="space-y-4 mt-4">
                  {alternatives.map((alt, index) => (
                    <div
                      key={alt.id}
                      className="bg-gradient-to-br from-slate-800/90 to-slate-800/70 border border-slate-600 hover:border-emerald-500/60 rounded-xl p-5 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/10"
                    >
                      <div className="flex gap-4">
                        {alt.alternative_image_url && (
                          <div className="flex-shrink-0">
                            <img
                              src={alt.alternative_image_url}
                              alt={alt.alternative_product_name}
                              className="w-24 h-24 object-cover rounded-lg shadow-md border border-slate-600 group-hover:border-emerald-500/40 transition"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                  #{index + 1}
                                </span>
                                {alt.alternative_brand && (
                                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                                    {alt.alternative_brand}
                                  </span>
                                )}
                              </div>
                              <h5 className="text-base font-bold text-white mb-1">
                                {alt.alternative_product_name}
                              </h5>
                            </div>
                            <div className="flex flex-col items-center gap-1 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-lg px-3 py-2">
                              <Heart size={14} className="text-emerald-400" />
                              <span className="text-base font-bold text-emerald-300">{alt.health_score}%</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-slate-400">{t('alternatives.sugar')}:</span>
                              <span className="text-white font-semibold">{alt.sugar_content}g</span>
                            </div>
                            <div className="w-px h-4 bg-slate-600"></div>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-slate-400">{t('alternatives.caffeine')}:</span>
                              <span className="text-white font-semibold capitalize">{alt.caffeine_level}</span>
                            </div>
                            {adjustedScore && (
                              <>
                                <div className="w-px h-4 bg-slate-600"></div>
                                <div className="flex items-center gap-1 text-xs">
                                  <ArrowRight size={12} className="text-emerald-400" />
                                  <span className="text-emerald-300 font-semibold">
                                    +{alt.health_score - adjustedScore}% {t('alternatives.boost')}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {alt.benefits.slice(0, 4).map((benefit, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-1"
                              >
                                <CheckCircle size={10} className="text-emerald-400" />
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles size={14} className="text-emerald-400" />
                    <span>{t('alternatives.improvement')} {adjustedScore ? Math.min(40, 100 - adjustedScore) : 40}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showAlternatives && loadingAlternatives && (
            <div className="mb-8 flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          )}

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h4 className="text-xl font-bold text-white">{t('details.ingredients')}</h4>
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('details.totalVolume')}</p>
                <p className="text-emerald-300 font-semibold">{convertToTeaspoons(totalTablespoons).toFixed(2)} {t('details.teaspoons')}</p>
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
                <p className="text-sm">{t('details.noIngredients')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
