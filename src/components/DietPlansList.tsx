import { Calendar, Flame, Apple, Heart, Wind, Leaf, Download, Trash2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DietPlan } from '../lib/ayurvedaDietPlan';

interface SavedDietPlan extends DietPlan {
  user_id: string;
  diet_profile_id: string;
  created_at: string;
  expires_at: string;
  profile?: {
    weight: number;
    height: number;
    bmi: number;
    body_type: string;
    health_goal: string;
  };
}

interface DietPlansListProps {
  userId: string;
  onSelectPlan: (plan: SavedDietPlan) => void;
}

export function DietPlansList({ userId, onSelectPlan }: DietPlansListProps) {
  const [plans, setPlans] = useState<SavedDietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDietPlans();
  }, [userId]);

  const loadDietPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: plansData, error: plansError } = await supabase
        .from('diet_plans')
        .select('*, diet_profile_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      if (plansData && plansData.length > 0) {
        const enrichedPlans = await Promise.all(
          plansData.map(async (plan) => {
            const { data: profileData } = await supabase
              .from('user_diet_profiles')
              .select('*')
              .eq('id', plan.diet_profile_id)
              .single();

            return {
              ...plan,
              breakfast: typeof plan.breakfast === 'string' ? JSON.parse(plan.breakfast) : plan.breakfast,
              lunch: typeof plan.lunch === 'string' ? JSON.parse(plan.lunch) : plan.lunch,
              dinner: typeof plan.dinner === 'string' ? JSON.parse(plan.dinner) : plan.dinner,
              snacks: typeof plan.snacks === 'string' ? JSON.parse(plan.snacks) : plan.snacks,
              herbs_spices: typeof plan.herbs_spices === 'string' ? JSON.parse(plan.herbs_spices) : plan.herbs_spices,
              profile: profileData,
            } as SavedDietPlan;
          })
        );
        setPlans(enrichedPlans);
      }
    } catch (err) {
      console.error('Error loading diet plans:', err);
      setError('Failed to load diet plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this diet plan?')) return;

    try {
      const { error } = await supabase
        .from('diet_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      setPlans(plans.filter(p => p.id !== planId));
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError('Failed to delete diet plan');
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return 'from-blue-500 to-cyan-600';
      case 'pitta':
        return 'from-red-500 to-orange-600';
      case 'kapha':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return Wind;
      case 'pitta':
        return Flame;
      case 'kapha':
        return Leaf;
      default:
        return Heart;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 p-12 text-center">
        <Apple size={48} className="mx-auto text-slate-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-300 mb-2">No Diet Plans Yet</h3>
        <p className="text-slate-400">Create your first Ayurveda-focused diet plan to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const DoshaIcon = getDoshaIcon(plan.dosha_type);
          const doshaColor = getDoshaColor(plan.dosha_type);
          const createdDate = new Date(plan.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={plan.id}
              className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-xl transition hover:border-emerald-500/50 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${doshaColor} px-6 py-6 flex items-start justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur rounded-full p-3">
                    <DoshaIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">{plan.dosha_type} Dosha</h3>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {createdDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              {plan.profile && (
                <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-700/20">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Weight</p>
                      <p className="text-sm font-bold text-emerald-400">{plan.profile.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">BMI</p>
                      <p className="text-sm font-bold text-blue-400">{plan.profile.bmi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Calories</p>
                      <p className="text-sm font-bold text-orange-400">{plan.daily_calories}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Meals Overview */}
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Apple size={16} />
                  Daily Plan Overview
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Breakfast', items: plan.breakfast },
                    { label: 'Lunch', items: plan.lunch },
                    { label: 'Dinner', items: plan.dinner },
                    { label: 'Snacks', items: plan.snacks },
                  ].map((meal) => (
                    <div key={meal.label} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                      <div>
                        <span className="font-semibold">{meal.label}:</span>
                        <p className="text-slate-400 truncate">
                          {meal.items.map(i => i.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Herbs & Guidelines Count */}
              <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-700/10">
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="text-slate-400">Recommended Herbs</p>
                    <p className="text-emerald-400 font-semibold">{plan.herbs_spices.length} items</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Guidelines</p>
                    <p className="text-blue-400 font-semibold">{plan.guidelines.length} tips</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 flex gap-3">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2 px-3 rounded-lg transition transform hover:scale-105 active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="bg-slate-700/50 hover:bg-red-500/30 text-red-300 hover:text-red-200 font-semibold py-2 px-3 rounded-lg transition border border-slate-600 hover:border-red-500/50 text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
