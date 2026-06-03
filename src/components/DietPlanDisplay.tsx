import { Apple, Utensils, Leaf, Flame, Wind, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useState } from 'react';
import { DietPlan } from '../lib/ayurvedaDietPlan';

interface DietPlanDisplayProps {
  dietPlan: DietPlan;
  bmi: number;
  weight: number;
  height: number;
  healthGoal: string;
  onBack: () => void;
}

export function DietPlanDisplay({ dietPlan, bmi, weight, height, healthGoal, onBack }: DietPlanDisplayProps) {
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  const getDoshaInfo = () => {
    const doshaInfo: Record<string, { color: string; bgColor: string; description: string; icon: any }> = {
      vata: {
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-500/15 border-blue-500/40',
        description: 'Air & Space - Creative, mobile, enthusiastic. Tends to be thin, energetic, and quick-thinking.',
        icon: Wind,
      },
      pitta: {
        color: 'from-red-500 to-orange-600',
        bgColor: 'bg-red-500/15 border-red-500/40',
        description: 'Fire & Water - Ambitious, intelligent, competitive. Medium build, warm, strong digestion.',
        icon: Flame,
      },
      kapha: {
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/15 border-green-500/40',
        description: 'Earth & Water - Stable, loyal, calm. Tends to be heavier, grounded, steady metabolism.',
        icon: Leaf,
      },
    };
    return doshaInfo[dietPlan.dosha_type];
  };

  const doshaInfo = getDoshaInfo();
  const DoshaIcon = doshaInfo.icon;

  const mealSections = [
    { key: 'breakfast', label: 'Breakfast', items: dietPlan.breakfast },
    { key: 'lunch', label: 'Lunch', items: dietPlan.lunch },
    { key: 'dinner', label: 'Dinner', items: dietPlan.dinner },
    { key: 'snacks', label: 'Snacks', items: dietPlan.snacks },
  ];

  return (
    <div className="w-full space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition font-semibold mb-4"
      >
        ← Back to Plans
      </button>

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className={`bg-gradient-to-r ${doshaInfo.color} px-6 py-8`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur rounded-full p-3">
              <DoshaIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white capitalize">{dietPlan.dosha_type} Dosha</h2>
              <p className="text-white/80 text-sm">Personalized Ayurvedic Diet Plan</p>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">{doshaInfo.description}</p>
        </div>

        {/* Metrics */}
        <div className="p-8 border-b border-slate-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-xs text-slate-400 mb-1">Weight</p>
              <p className="text-2xl font-bold text-emerald-400">{weight}kg</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-xs text-slate-400 mb-1">Height</p>
              <p className="text-2xl font-bold text-emerald-400">{height}cm</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-xs text-slate-400 mb-1">BMI</p>
              <p className="text-2xl font-bold text-blue-400">{bmi.toFixed(1)}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <p className="text-xs text-slate-400 mb-1">Daily Calories</p>
              <p className="text-2xl font-bold text-orange-400">{dietPlan.daily_calories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Plan */}
      <div className="space-y-4">
        {mealSections.map((section) => (
          <div
            key={section.key}
            className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === section.key ? '' : section.key)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition bg-gradient-to-r from-emerald-600/20 to-blue-600/20"
            >
              <div className="flex items-center gap-3">
                <Apple size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-white">{section.label}</h3>
              </div>
              {expandedSection === section.key ? (
                <ChevronUp size={20} className="text-emerald-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {expandedSection === section.key && (
              <div className="p-6 border-t border-slate-700/50 space-y-4">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 hover:border-emerald-500/50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                        {item.portion}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.benefits.map((benefit, bidx) => (
                        <span
                          key={bidx}
                          className="inline-flex items-center gap-1 text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-full px-2.5 py-1"
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Herbs & Spices */}
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Leaf size={24} />
            Recommended Herbs & Spices
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {dietPlan.herbs_spices.map((herb, idx) => (
            <div key={idx} className="bg-slate-700/30 border border-violet-500/30 rounded-lg p-4">
              <p className="text-slate-200 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                {herb}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ayurvedic Guidelines */}
      <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Utensils size={24} />
            Ayurvedic Guidelines
          </h3>
        </div>
        <div className="p-6 space-y-3">
          {dietPlan.guidelines.map((guideline, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-700/20 p-4 rounded-lg border border-slate-600">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{guideline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goal-Specific Tips */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 p-6">
        <h3 className="text-xl font-bold text-white mb-4 capitalize">Goal: {healthGoal.replace(/_/g, ' ')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-emerald-300 font-semibold mb-2">Do's</p>
            <ul className="text-sm text-slate-300 space-y-1">
              {getGoalTips(healthGoal).dos.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 font-semibold mb-2">Don'ts</p>
            <ul className="text-sm text-slate-300 space-y-1">
              {getGoalTips(healthGoal).donts.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-0.5">✗</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition transform hover:scale-105 active:scale-95"
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
}

function getGoalTips(goal: string) {
  const tips: Record<string, { dos: string[]; donts: string[] }> = {
    weight_loss: {
      dos: [
        'Eat during daylight hours',
        'Include warming spices',
        'Drink warm lemon water',
        'Exercise regularly',
        'Eat mindfully and slowly',
      ],
      donts: [
        'Skip meals',
        'Eat late dinners',
        'Consume processed foods',
        'Eat while stressed',
        'Drink cold water',
      ],
    },
    muscle_gain: {
      dos: [
        'Eat protein-rich foods',
        'Have regular meals',
        'Include healthy fats',
        'Exercise with weights',
        'Sleep 7-8 hours',
      ],
      donts: [
        'Eat insufficient calories',
        'Skip post-workout meals',
        'Eat processed sugars',
        'Ignore recovery',
        'Exercise on empty stomach',
      ],
    },
    maintenance: {
      dos: [
        'Maintain meal consistency',
        'Balance all tastes',
        'Exercise regularly',
        'Sleep well',
        'Stay hydrated',
      ],
      donts: [
        'Extreme dieting',
        'Overeating',
        'Skip meals',
        'Irregular schedules',
        'Ignore digestion',
      ],
    },
    energy_boost: {
      dos: [
        'Eat energizing foods',
        'Include warming spices',
        'Stay active',
        'Get morning sunlight',
        'Eat nutritious snacks',
      ],
      donts: [
        'Skip breakfast',
        'Eat heavy foods',
        'Stay sedentary',
        'Sleep irregularly',
        'Stress yourself',
      ],
    },
    digestion_improvement: {
      dos: [
        'Eat warm foods',
        'Chew thoroughly',
        'Include digestive spices',
        'Drink herbal teas',
        'Walk after meals',
      ],
      donts: [
        'Eat too fast',
        'Drink cold water',
        'Eat incompatible foods',
        'Sleep immediately after eating',
        'Eat processed foods',
      ],
    },
  };

  return tips[goal] || tips.maintenance;
}
