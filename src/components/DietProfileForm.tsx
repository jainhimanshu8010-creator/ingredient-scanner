import { Heart, Activity, Apple, Flame, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

interface DietProfileFormProps {
  userId: string;
  onProfileCreated: (profileId: string) => void;
  onCancel: () => void;
}

export function DietProfileForm({ userId, onProfileCreated, onCancel }: DietProfileFormProps) {
  const { t } = useLanguage();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyType, setBodyType] = useState<'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha'>('pitta');
  const [healthGoal, setHealthGoal] = useState<'weight_loss' | 'muscle_gain' | 'maintenance' | 'energy_boost' | 'digestion_improvement'>('maintenance');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    if (weight && height) {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      const calculatedBMI = w / ((h / 100) ** 2);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
    }
  };

  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  const toggleRestriction = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!weight || !height) {
        throw new Error('Please enter weight and height');
      }

      const { data, error: dbError } = await supabase
        .from('user_diet_profiles')
        .upsert({
          user_id: userId,
          weight: parseFloat(weight),
          height: parseFloat(height),
          body_type: bodyType,
          health_goal: healthGoal,
          activity_level: activityLevel,
          dietary_restrictions: dietaryRestrictions,
          medical_conditions: medicalConditions || null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error('Failed to create profile');

      onProfileCreated(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">Ayurvedic Diet Plan</h2>
          <p className="text-emerald-100 text-sm mt-1">Enter your details to get a personalized diet plan</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Physical Metrics */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-emerald-400" />
                Physical Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 transition"
                    placeholder="70"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 transition"
                    placeholder="175"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">BMI</label>
                  <div className="w-full px-4 py-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-lg text-white font-semibold">
                    {bmi ? bmi : '--'}
                  </div>
                </div>
              </div>
            </div>

            {/* Dosha Type */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Heart size={20} className="text-emerald-400" />
                Body Type (Dosha)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'vata', label: 'Vata (Air)' },
                  { value: 'pitta', label: 'Pitta (Fire)' },
                  { value: 'kapha', label: 'Kapha (Earth)' },
                  { value: 'vata-pitta', label: 'Vata-Pitta' },
                  { value: 'pitta-kapha', label: 'Pitta-Kapha' },
                  { value: 'vata-kapha', label: 'Vata-Kapha' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBodyType(value as any)}
                    className={`px-4 py-3 rounded-lg font-semibold transition ${
                      bodyType === value
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:border-emerald-500/50'
                    }`}
                    disabled={loading}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Health Goal */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Flame size={20} className="text-emerald-400" />
                Health Goal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'weight_loss', label: 'Weight Loss', icon: TrendingDown },
                  { value: 'muscle_gain', label: 'Muscle Gain', icon: TrendingUp },
                  { value: 'maintenance', label: 'Maintenance', icon: Apple },
                  { value: 'energy_boost', label: 'Energy Boost', icon: Zap },
                  { value: 'digestion_improvement', label: 'Better Digestion', icon: Heart },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setHealthGoal(value as any)}
                    className={`px-4 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                      healthGoal === value
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:border-blue-500/50'
                    }`}
                    disabled={loading}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Activity Level</h3>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition"
                disabled={loading}
              >
                <option value="sedentary">Sedentary (Little exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (Intense exercise)</option>
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3">Dietary Restrictions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'vegetarian', label: 'Vegetarian' },
                  { value: 'vegan', label: 'Vegan' },
                  { value: 'gluten-free', label: 'Gluten-Free' },
                  { value: 'dairy-free', label: 'Dairy-Free' },
                  { value: 'nut-free', label: 'Nut-Free' },
                  { value: 'no-onion-garlic', label: 'No Onion/Garlic' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleRestriction(value)}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                      dietaryRestrictions.includes(value)
                        ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white border border-violet-400'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:border-violet-500/50'
                    }`}
                    disabled={loading}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Medical Conditions (Optional)</label>
              <textarea
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="e.g., Diabetes, High Blood Pressure, PCOS..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400 transition resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Generate Diet Plan
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition border border-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
