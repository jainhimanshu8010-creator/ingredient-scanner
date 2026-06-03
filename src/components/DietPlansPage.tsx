import { useState, useEffect } from 'react';
import { Apple, Plus, ChevronLeft } from 'lucide-react';
import { DietProfileForm } from './DietProfileForm';
import { DietPlansList } from './DietPlansList';
import { DietPlanDisplay } from './DietPlanDisplay';
import { generateAyurvediaDietPlan, saveDietPlan, DietPlan } from '../lib/ayurvedaDietPlan';
import { supabase } from '../lib/supabase';

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

interface DietPlansPageProps {
  userId: string;
}

export function DietPlansPage({ userId }: DietPlansPageProps) {
  const [view, setView] = useState<'list' | 'form' | 'display'>('list');
  const [selectedPlan, setSelectedPlan] = useState<SavedDietPlan | null>(null);
  const [dietProfile, setDietProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateNew = () => {
    setView('form');
    setSelectedPlan(null);
  };

  const handleDietProfileCreated = async (profileId: string) => {
    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_diet_profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (profileError) throw profileError;

      setDietProfile(profile);

      const plan = generateAyurvediaDietPlan(
        profile.weight,
        profile.height,
        profile.bmi,
        profile.body_type,
        profile.health_goal,
        profile.activity_level,
        profile.dietary_restrictions,
        profile.medical_conditions
      );

      // Save the plan to database
      const savedPlan = await saveDietPlan(userId, profileId, plan);

      if (savedPlan) {
        setSelectedPlan({
          ...plan,
          user_id: userId,
          diet_profile_id: profileId,
          created_at: savedPlan.created_at,
          expires_at: savedPlan.expires_at,
          profile,
        });
        setView('display');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: SavedDietPlan) => {
    setSelectedPlan(plan);
    setView('display');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedPlan(null);
  };

  const handleBackFromDisplay = () => {
    setView('list');
    setSelectedPlan(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Apple size={32} className="text-emerald-400" />
            Your Diet Plans
          </h2>
          <p className="text-slate-400 text-sm mt-1">Personalized Ayurveda diet plans based on your body type and goals</p>
        </div>

        {view === 'list' && (
          <button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Plan
          </button>
        )}

        {(view === 'form' || view === 'display') && (
          <button
            onClick={handleBackToList}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 transition"
          >
            <ChevronLeft size={20} />
            Back to Plans
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
        {view === 'list' && <DietPlansList userId={userId} onSelectPlan={handleSelectPlan} />}

        {view === 'form' && (
          <DietProfileForm
            userId={userId}
            onProfileCreated={handleDietProfileCreated}
            onCancel={handleBackToList}
          />
        )}

        {view === 'display' && selectedPlan && selectedPlan.profile && (
          <div className="space-y-6">
            <DietPlanDisplay
              dietPlan={selectedPlan}
              bmi={selectedPlan.profile.bmi}
              weight={selectedPlan.profile.weight}
              height={selectedPlan.profile.height}
              healthGoal={selectedPlan.profile.health_goal}
              onBack={handleBackFromDisplay}
            />
          </div>
        )}
      </div>
    </div>
  );
}
