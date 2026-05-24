import { Heart, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface HealthMeterProps {
  healthScore: number;
  sugarContent: number;
  caffeineLevel: string;
  userAge: number;
  productCategory: string;
}

export function HealthMeter({
  healthScore,
  sugarContent,
  caffeineLevel,
  userAge,
  productCategory,
}: HealthMeterProps) {
  const getAgeGroup = (age: number) => {
    if (age < 13) return 'child';
    if (age < 18) return 'student';
    if (age < 60) return 'adult';
    return 'senior';
  };

  const calculateAgeAdjustedScore = () => {
    const ageGroup = getAgeGroup(userAge);
    let adjustedScore = healthScore;

    if (caffeineLevel === 'high') {
      if (ageGroup === 'child') adjustedScore -= 25;
      else if (ageGroup === 'student') adjustedScore -= 10;
      else if (ageGroup === 'senior') adjustedScore -= 15;
    }

    if (sugarContent > 30) {
      if (ageGroup === 'child') adjustedScore -= 20;
      else if (ageGroup === 'student') adjustedScore -= 15;
      else if (ageGroup === 'adult') adjustedScore -= 10;
    }

    return Math.max(1, Math.min(100, adjustedScore));
  };

  const getHealthStatus = () => {
    const ageGroup = getAgeGroup(userAge);
    const adjustedScore = calculateAgeAdjustedScore();

    if (adjustedScore >= 80) {
      return {
        status: 'Excellent',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/50',
        textColor: 'text-green-400',
        icon: CheckCircle,
      };
    } else if (adjustedScore >= 60) {
      return {
        status: 'Good',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/50',
        textColor: 'text-blue-400',
        icon: TrendingUp,
      };
    } else if (adjustedScore >= 40) {
      return {
        status: 'Moderate',
        color: 'from-yellow-500 to-yellow-600',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        textColor: 'text-yellow-400',
        icon: AlertCircle,
      };
    } else {
      return {
        status: 'Low',
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50',
        textColor: 'text-red-400',
        icon: Heart,
      };
    }
  };

  const getRecommendation = () => {
    const ageGroup = getAgeGroup(userAge);
    const adjustedScore = calculateAgeAdjustedScore();

    if (ageGroup === 'child') {
      if (caffeineLevel === 'high' && adjustedScore < 60) {
        return 'High caffeine content may not be suitable for children.';
      }
      if (sugarContent > 25 && adjustedScore < 60) {
        return 'High sugar content - limit consumption for children.';
      }
    } else if (ageGroup === 'senior') {
      if (caffeineLevel === 'high' && adjustedScore < 60) {
        return 'Moderate caffeine intake recommended for seniors.';
      }
    }

    if (adjustedScore >= 80) {
      return 'Great choice for your age group! Nutritious and healthy.';
    } else if (adjustedScore >= 60) {
      return 'Good option. Consume in moderation for best health benefits.';
    } else if (adjustedScore >= 40) {
      return 'Acceptable occasionally. Consider healthier alternatives regularly.';
    } else {
      return 'Not recommended regularly. Try healthier alternatives.';
    }
  };

  const healthStatus = getHealthStatus();
  const adjustedScore = calculateAgeAdjustedScore();
  const Icon = healthStatus.icon;

  return (
    <div className="space-y-4">
      <div className={`${healthStatus.bgColor} border ${healthStatus.borderColor} rounded-xl p-6 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={healthStatus.textColor} size={24} />
            <h3 className="text-lg font-semibold text-white">Health Rating</h3>
          </div>
          <span className={`${healthStatus.textColor} font-bold text-2xl`}>
            {adjustedScore}%
          </span>
        </div>

        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${healthStatus.color} transition-all duration-500`}
            style={{ width: `${adjustedScore}%` }}
          ></div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-600/50">
          <p className={`text-sm font-semibold ${healthStatus.textColor} mb-2`}>
            Status: {healthStatus.status}
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {getRecommendation()}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Sugar Content</p>
            <p className={`font-semibold ${sugarContent > 30 ? 'text-red-400' : sugarContent > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
              {sugarContent}g
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Caffeine</p>
            <p className={`font-semibold capitalize ${
              caffeineLevel === 'high' ? 'text-red-400' :
              caffeineLevel === 'medium' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {caffeineLevel || 'None'}
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Category</p>
            <p className="font-semibold text-blue-400 capitalize">
              {productCategory.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
