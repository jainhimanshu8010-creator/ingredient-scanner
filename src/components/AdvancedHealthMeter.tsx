import {
  Heart,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Droplet,
  Leaf,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface AdvancedHealthMeterProps {
  healthScore: number;
  sugarContent: number;
  caffeineLevel: string;
  userAge: number;
  productCategory: string;
}

export function AdvancedHealthMeter({
  healthScore,
  sugarContent,
  caffeineLevel,
  userAge,
  productCategory,
}: AdvancedHealthMeterProps) {
  const getAgeGroup = (age: number) => {
    if (age < 13) return 'child';
    if (age < 18) return 'student';
    if (age < 60) return 'adult';
    return 'senior';
  };

  const ageGroup = getAgeGroup(userAge);

  const calculateMetrics = () => {
    let adjustedScore = healthScore;
    let sugarRisk = 'low';
    let caffeineRisk = 'low';
    let nutritionScore = healthScore;

    if (caffeineLevel === 'high') {
      caffeineRisk = ageGroup === 'child' ? 'critical' : ageGroup === 'senior' ? 'high' : 'medium';
      if (ageGroup === 'child') adjustedScore -= 25;
      else if (ageGroup === 'student') adjustedScore -= 10;
      else if (ageGroup === 'senior') adjustedScore -= 15;
    } else if (caffeineLevel === 'medium') {
      caffeineRisk = ageGroup === 'child' ? 'high' : 'low';
      if (ageGroup === 'child') adjustedScore -= 15;
    }

    if (sugarContent > 50) {
      sugarRisk = ageGroup === 'child' ? 'critical' : ageGroup === 'senior' ? 'high' : 'medium';
      adjustedScore -= ageGroup === 'child' ? 30 : 15;
    } else if (sugarContent > 30) {
      sugarRisk = ageGroup === 'child' ? 'high' : 'medium';
      adjustedScore -= ageGroup === 'child' ? 20 : 10;
    } else if (sugarContent > 10) {
      sugarRisk = 'low';
      adjustedScore -= 5;
    }

    nutritionScore = Math.max(1, Math.min(100, adjustedScore));

    return {
      overallScore: Math.max(1, Math.min(100, adjustedScore)),
      sugarRisk,
      caffeineRisk,
      nutritionScore,
    };
  };

  const getHealthStatus = () => {
    const { overallScore } = calculateMetrics();

    if (overallScore >= 80) {
      return {
        status: 'Excellent',
        emoji: '🌟',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/15',
        borderColor: 'border-green-500/40',
        textColor: 'text-green-400',
        icon: CheckCircle,
      };
    } else if (overallScore >= 60) {
      return {
        status: 'Good',
        emoji: '👍',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/15',
        borderColor: 'border-blue-500/40',
        textColor: 'text-blue-400',
        icon: TrendingUp,
      };
    } else if (overallScore >= 40) {
      return {
        status: 'Fair',
        emoji: '⚠️',
        color: 'from-yellow-500 to-orange-600',
        bgColor: 'bg-yellow-500/15',
        borderColor: 'border-yellow-500/40',
        textColor: 'text-yellow-400',
        icon: AlertCircle,
      };
    } else {
      return {
        status: 'Poor',
        emoji: '❌',
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-500/15',
        borderColor: 'border-red-500/40',
        textColor: 'text-red-400',
        icon: Heart,
      };
    }
  };

  const getRiskIndicator = (risk: string) => {
    switch (risk) {
      case 'critical':
        return { color: 'text-red-500', bg: 'bg-red-500/20', label: 'Critical' };
      case 'high':
        return { color: 'text-orange-500', bg: 'bg-orange-500/20', label: 'High' };
      case 'medium':
        return { color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Medium' };
      default:
        return { color: 'text-green-500', bg: 'bg-green-500/20', label: 'Low' };
    }
  };

  const getAgeSpecificRecommendations = () => {
    const { sugarRisk, caffeineRisk } = calculateMetrics();
    const recommendations = [];

    if (ageGroup === 'child') {
      recommendations.push('Growing children need balanced nutrition for development');
      if (caffeineLevel === 'high' || caffeineLevel === 'medium') {
        recommendations.push('Limit caffeine - it can affect sleep and focus');
      }
      if (sugarContent > 25) {
        recommendations.push('High sugar intake risks tooth decay and hyperactivity');
      }
      recommendations.push('Prefer water, milk, or natural juices');
    } else if (ageGroup === 'student') {
      recommendations.push('Support your energy and focus for studies');
      if (caffeineRisk === 'medium' || caffeineRisk === 'high') {
        recommendations.push('Moderate caffeine is okay, but avoid before bedtime');
      }
      if (sugarRisk === 'high' || sugarRisk === 'critical') {
        recommendations.push('Excess sugar can cause energy crashes - balance with protein');
      }
      recommendations.push('Stay hydrated for better concentration');
    } else if (ageGroup === 'adult') {
      recommendations.push('Maintain balanced consumption for long-term health');
      if (caffeineLevel === 'high') {
        recommendations.push('Moderate caffeine intake supports daily energy');
      }
      if (sugarRisk === 'high') {
        recommendations.push('Reduce sugar to prevent lifestyle diseases');
      }
      recommendations.push('Regular exercise enhances benefits of healthy products');
    } else if (ageGroup === 'senior') {
      recommendations.push('Prioritize bone health and digestive wellness');
      if (caffeineLevel === 'high') {
        recommendations.push('Limit caffeine - can affect sleep quality and blood pressure');
      }
      if (sugarContent > 20) {
        recommendations.push('Monitor sugar intake for diabetes management');
      }
      recommendations.push('Consult healthcare provider before new supplements');
    }

    return recommendations;
  };

  const getHealthBenefits = () => {
    const benefits = [];

    if (healthScore >= 80) {
      benefits.push('Rich in natural ingredients');
      benefits.push('Supports immune system');
    }
    if (sugarContent < 10) {
      benefits.push('Low sugar content');
    }
    if (caffeineLevel === 'none') {
      benefits.push('Caffeine-free');
    }
    if (productCategory === 'tea') {
      benefits.push('Contains antioxidants');
      benefits.push('Natural wellness properties');
    }
    if (productCategory === 'juice') {
      benefits.push('Vitamin-rich');
      benefits.push('Natural hydration');
    }

    return benefits.length > 0 ? benefits : ['Acceptable for regular consumption'];
  };

  const metrics = calculateMetrics();
  const healthStatus = getHealthStatus();
  const Icon = healthStatus.icon;
  const sugarRiskInfo = getRiskIndicator(metrics.sugarRisk);
  const caffeineRiskInfo = getRiskIndicator(metrics.caffeineRisk);
  const recommendations = getAgeSpecificRecommendations();
  const benefits = getHealthBenefits();

  return (
    <div className="space-y-4">
      <div className={`${healthStatus.bgColor} border ${healthStatus.borderColor} rounded-2xl p-8 backdrop-blur-sm transition-all duration-500`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{healthStatus.emoji}</span>
              <div>
                <p className="text-sm text-slate-400">Overall Health Rating</p>
                <h3 className={`text-3xl font-bold ${healthStatus.textColor}`}>
                  {healthStatus.status}
                </h3>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">Score for {ageGroup}s</p>
            <p className={`text-4xl font-bold ${healthStatus.textColor}`}>
              {metrics.overallScore}%
            </p>
          </div>
        </div>

        <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full bg-gradient-to-r ${healthStatus.color} rounded-full transition-all duration-500 shadow-lg`}
            style={{ width: `${metrics.overallScore}%` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className={caffeineRiskInfo.color} />
              <span className="text-xs text-slate-400 font-semibold">Caffeine</span>
            </div>
            <p className="font-bold text-white capitalize text-sm mb-1">
              {caffeineLevel || 'None'}
            </p>
            <div className={`${caffeineRiskInfo.bg} ${caffeineRiskInfo.color} text-xs font-semibold px-2 py-1 rounded w-fit`}>
              {caffeineRiskInfo.label}
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center gap-2 mb-2">
              <Droplet size={16} className={sugarRiskInfo.color} />
              <span className="text-xs text-slate-400 font-semibold">Sugar</span>
            </div>
            <p className="font-bold text-white text-sm mb-1">
              {sugarContent}g
            </p>
            <div className={`${sugarRiskInfo.bg} ${sugarRiskInfo.color} text-xs font-semibold px-2 py-1 rounded w-fit`}>
              {sugarRiskInfo.label}
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={16} className="text-green-400" />
              <span className="text-xs text-slate-400 font-semibold">Category</span>
            </div>
            <p className="font-bold text-white capitalize text-sm">
              {productCategory.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-600/50 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-blue-400" />
            <h4 className="text-sm font-bold text-white">Age-Specific Benefits</h4>
          </div>
          <div className="space-y-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span className="text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-amber-400" />
          <h4 className="text-sm font-bold text-white">
            Recommendations for {ageGroup}s
          </h4>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <span className="text-slate-300">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {(metrics.sugarRisk === 'critical' || metrics.caffeineRisk === 'critical') && (
        <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-6 backdrop-blur-sm flex gap-4">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-bold text-red-300 mb-1">Health Alert</h4>
            <p className="text-sm text-slate-300">
              This product may not be suitable for {ageGroup}s due to{' '}
              {metrics.caffeineRisk === 'critical' ? 'high caffeine' : 'high sugar'} content.
              Consider healthier alternatives or consult a healthcare provider.
            </p>
          </div>
        </div>
      )}

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm flex gap-3">
        <Info size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400">
          This health assessment is based on product composition and general age-group health guidelines.
          Individual health needs may vary. Consult healthcare professionals for personalized advice.
        </p>
      </div>
    </div>
  );
}
