import { supabase } from './supabase';

export interface MealItem {
  name: string;
  portion: string;
  benefits: string[];
}

export interface DietPlan {
  id: string;
  user_id?: string;
  diet_profile_id?: string;
  dosha_type: 'vata' | 'pitta' | 'kapha';
  daily_calories: number;
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
  herbs_spices: string[];
  guidelines: string[];
  created_at?: string;
  expires_at?: string;
}

export function generateAyurvediaDietPlan(
  weight: number,
  height: number,
  bmi: number,
  bodyType: string,
  healthGoal: string,
  activityLevel: string,
  dietaryRestrictions: string[],
  medicalConditions?: string
): DietPlan {
  const dosha = determinePrimaryDosha(bodyType);
  const dailyCalories = calculateDailyCalories(weight, height, activityLevel, healthGoal);

  return {
    id: Math.random().toString(36).substr(2, 9),
    dosha_type: dosha,
    daily_calories: dailyCalories,
    breakfast: getBreakfastOptions(dosha, dietaryRestrictions, healthGoal),
    lunch: getLunchOptions(dosha, dietaryRestrictions, healthGoal),
    dinner: getDinnerOptions(dosha, dietaryRestrictions, healthGoal),
    snacks: getSnackOptions(dosha, dietaryRestrictions),
    herbs_spices: getRecommendedHerbs(dosha, healthGoal),
    guidelines: getAyurvedicGuidelines(dosha, bmi, healthGoal, medicalConditions),
  };
}

export async function saveDietPlan(
  userId: string,
  profileId: string,
  dietPlan: DietPlan
): Promise<DietPlan | null> {
  const { data, error } = await supabase
    .from('diet_plans')
    .upsert({
      user_id: userId,
      diet_profile_id: profileId,
      dosha_type: dietPlan.dosha_type,
      daily_calories: dietPlan.daily_calories,
      breakfast: JSON.stringify(dietPlan.breakfast),
      lunch: JSON.stringify(dietPlan.lunch),
      dinner: JSON.stringify(dietPlan.dinner),
      snacks: JSON.stringify(dietPlan.snacks),
      herbs_spices: JSON.stringify(dietPlan.herbs_spices),
      guidelines: dietPlan.guidelines,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving diet plan:', error);
    return null;
  }

  return data;
}

export async function getUserDietPlan(userId: string): Promise<DietPlan | null> {
  const { data, error } = await supabase
    .from('diet_plans')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    diet_profile_id: data.diet_profile_id,
    dosha_type: data.dosha_type,
    daily_calories: data.daily_calories,
    breakfast: typeof data.breakfast === 'string' ? JSON.parse(data.breakfast) : data.breakfast,
    lunch: typeof data.lunch === 'string' ? JSON.parse(data.lunch) : data.lunch,
    dinner: typeof data.dinner === 'string' ? JSON.parse(data.dinner) : data.dinner,
    snacks: typeof data.snacks === 'string' ? JSON.parse(data.snacks) : data.snacks,
    herbs_spices: typeof data.herbs_spices === 'string' ? JSON.parse(data.herbs_spices) : data.herbs_spices,
    guidelines: data.guidelines,
    created_at: data.created_at,
    expires_at: data.expires_at,
  };
}

function determinePrimaryDosha(bodyType: string): 'vata' | 'pitta' | 'kapha' {
  if (bodyType.includes('vata')) return 'vata';
  if (bodyType.includes('pitta')) return 'pitta';
  return 'kapha';
}

function calculateDailyCalories(weight: number, height: number, activityLevel: string, healthGoal: string): number {
  let bmr = 10 * weight + 6.25 * height - 5;

  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const calories = bmr * (activityFactors[activityLevel] || 1.55);

  if (healthGoal === 'weight_loss') return Math.round(calories * 0.8);
  if (healthGoal === 'muscle_gain') return Math.round(calories * 1.1);
  return Math.round(calories);
}

function getBreakfastOptions(dosha: string, restrictions: string[], goal: string): MealItem[] {
  if (dosha === 'vata') {
    return [
      {
        name: 'Warm Ghee Porridge with Almonds',
        portion: '1 bowl',
        benefits: ['Grounding', 'Nourishing', 'Calming', 'Energy sustaining'],
      },
      {
        name: 'Sesame & Almond Butter Toast',
        portion: '2 slices',
        benefits: ['Warm energy', 'Grounding', 'Joint support'],
      },
      {
        name: 'Spiced Warm Milk with Dates',
        portion: '1 cup',
        benefits: ['Calming', 'Nourishing', 'Sleep support'],
      },
    ];
  }

  if (dosha === 'pitta') {
    return [
      {
        name: 'Cooling Coconut Oatmeal',
        portion: '1 bowl',
        benefits: ['Cooling', 'Digestive', 'Anti-inflammatory'],
      },
      {
        name: 'Fresh Fruit Salad with Coconut',
        portion: '1 bowl',
        benefits: ['Hydrating', 'Cooling', 'Vitamin rich'],
      },
      {
        name: 'Barley & Milk Khichdi',
        portion: '1 plate',
        benefits: ['Cooling', 'Balancing', 'Easy digestion'],
      },
    ];
  }

  return [
    {
      name: 'Spiced Millet Porridge',
      portion: '½ bowl',
      benefits: ['Warming', 'Stimulating', 'Light'],
    },
    {
      name: 'Ginger Toast with Honey',
      portion: '1 slice',
      benefits: ['Digestive fire', 'Warming', 'Energizing'],
    },
    {
      name: 'Herbal Tea with Spices',
      portion: '1 cup',
      benefits: ['Stimulating', 'Warming', 'Metabolism boost'],
    },
  ];
}

function getLunchOptions(dosha: string, restrictions: string[], goal: string): MealItem[] {
  if (dosha === 'vata') {
    return [
      {
        name: 'Warm Rice & Ghee with Seasonal Veggies',
        portion: '1 plate',
        benefits: ['Grounding', 'Nourishing', 'Warming'],
      },
      {
        name: 'Mung Bean Soup with Warm Spices',
        portion: '1 bowl',
        benefits: ['Protein rich', 'Grounding', 'Easy digestion'],
      },
      {
        name: 'Sesame Bread with Olive Oil & Greens',
        portion: '1 serving',
        benefits: ['Oily', 'Grounding', 'Nourishing'],
      },
    ];
  }

  if (dosha === 'pitta') {
    return [
      {
        name: 'Cooling Basmati Rice with Cucumber',
        portion: '1 plate',
        benefits: ['Cooling', 'Hydrating', 'Balancing'],
      },
      {
        name: 'Coconut & Cilantro Soup',
        portion: '1 bowl',
        benefits: ['Cooling', 'Detoxifying', 'Anti-inflammatory'],
      },
      {
        name: 'Quinoa Salad with Fresh Herbs',
        portion: '1 plate',
        benefits: ['Protein rich', 'Cooling', 'Balanced'],
      },
    ];
  }

  return [
    {
      name: 'Light Barley with Stimulating Spices',
      portion: '½ plate',
      benefits: ['Light', 'Warming', 'Metabolism boost'],
    },
    {
      name: 'Lentil & Vegetable Soup',
      portion: '1 bowl',
      benefits: ['Protein rich', 'Light', 'Nourishing'],
    },
    {
      name: 'Millet with Spiced Veggies',
      portion: '½ plate',
      benefits: ['Light', 'Warming', 'Digestive'],
    },
  ];
}

function getDinnerOptions(dosha: string, restrictions: string[], goal: string): MealItem[] {
  if (dosha === 'vata') {
    return [
      {
        name: 'Warm Kitchari with Ghee',
        portion: '1 plate',
        benefits: ['Grounding', 'Nourishing', 'Sleep support'],
      },
      {
        name: 'Root Vegetable Stew',
        portion: '1 bowl',
        benefits: ['Warming', 'Grounding', 'Stabilizing'],
      },
      {
        name: 'Sweet Potato & Ginger Soup',
        portion: '1 bowl',
        benefits: ['Warming', 'Nourishing', 'Sleep aid'],
      },
    ];
  }

  if (dosha === 'pitta') {
    return [
      {
        name: 'Cooling Vegetable Stir-fry',
        portion: '1 plate',
        benefits: ['Cooling', 'Light', 'Digestible'],
      },
      {
        name: 'Cucumber & Mint Soup',
        portion: '1 bowl',
        benefits: ['Cooling', 'Calming', 'Sleep support'],
      },
      {
        name: 'Basmati Rice with Coconut Sauce',
        portion: '1 plate',
        benefits: ['Cooling', 'Light', 'Nourishing'],
      },
    ];
  }

  return [
    {
      name: 'Spiced Vegetable & Mung Bean Soup',
      portion: '1 bowl',
      benefits: ['Light', 'Warming', 'Sleep support'],
    },
    {
      name: 'Steamed Vegetables with Ginger',
      portion: '½ plate',
      benefits: ['Light', 'Warming', 'Digestive'],
    },
    {
      name: 'Lentil Soup with Herbs',
      portion: '1 bowl',
      benefits: ['Light', 'Protein rich', 'Warming'],
    },
  ];
}

function getSnackOptions(dosha: string, restrictions: string[]): MealItem[] {
  if (dosha === 'vata') {
    return [
      {
        name: 'Almond Milk with Dates',
        portion: '1 cup',
        benefits: ['Nourishing', 'Energy boost', 'Calming'],
      },
      {
        name: 'Warm Nuts & Seeds',
        portion: 'handful',
        benefits: ['Grounding', 'Warming', 'Sustaining'],
      },
    ];
  }

  if (dosha === 'pitta') {
    return [
      {
        name: 'Fresh Fruit with Coconut Water',
        portion: '1 serving',
        benefits: ['Cooling', 'Hydrating', 'Refreshing'],
      },
      {
        name: 'Cucumber Slices with Yogurt',
        portion: '1 cup',
        benefits: ['Cooling', 'Calming', 'Soothing'],
      },
    ];
  }

  return [
    {
      name: 'Herbal Tea with Ginger',
      portion: '1 cup',
      benefits: ['Warming', 'Stimulating', 'Metabolism boost'],
    },
    {
      name: 'Roasted Chickpea Snack',
      portion: 'handful',
      benefits: ['Light', 'Protein rich', 'Warming'],
    },
  ];
}

function getRecommendedHerbs(dosha: string, goal: string): string[] {
  if (dosha === 'vata') {
    return [
      'Ashwagandha - Grounding & Calming',
      'Ginger - Warming & Digestive',
      'Sesame - Nourishing & Grounding',
      'Cumin - Digestive & Warming',
      'Fennel - Soothing & Calming',
    ];
  }

  if (dosha === 'pitta') {
    return [
      'Brahmi - Cooling & Calming',
      'Coriander - Cooling & Detoxifying',
      'Turmeric - Anti-inflammatory',
      'Coconut - Cooling & Nourishing',
      'Mint - Cooling & Digestive',
    ];
  }

  return [
    'Ginger - Warming & Stimulating',
    'Black Pepper - Warming & Digestive',
    'Mustard Seeds - Warming & Stimulating',
    'Cinnamon - Warming & Metabolism boost',
    'Fenugreek - Stimulating & Warming',
  ];
}

function getAyurvedicGuidelines(dosha: string, bmi: number, goal: string, medicalConditions?: string): string[] {
  const guidelines: string[] = [];

  if (dosha === 'vata') {
    guidelines.push('Eat warm, oily, and grounding foods');
    guidelines.push('Maintain regular meal times to balance irregular Vata');
    guidelines.push('Avoid cold, dry, and light foods');
    guidelines.push('Drink warm water throughout the day');
    guidelines.push('Include sesame oil in your diet for warmth');
    guidelines.push('Eat in a calm, peaceful environment');
  } else if (dosha === 'pitta') {
    guidelines.push('Choose cooling and calming foods');
    guidelines.push('Avoid spicy, salty, and acidic foods');
    guidelines.push('Drink coconut water and cooling herbal teas');
    guidelines.push('Eat during cooler times of the day');
    guidelines.push('Include sweet tastes (fruits, grains)');
    guidelines.push('Avoid overheating through exercise');
  } else {
    guidelines.push('Eat light, warm, and stimulating foods');
    guidelines.push('Avoid heavy, oily, and cold foods');
    guidelines.push('Include plenty of spices for warmth');
    guidelines.push('Exercise regularly to improve digestion');
    guidelines.push('Minimize sweet and fatty foods');
    guidelines.push('Eat smaller portions more frequently');
  }

  if (goal === 'weight_loss') {
    guidelines.push('Eat your largest meal at lunch');
    guidelines.push('Keep dinners light and early (6-7 PM)');
    guidelines.push('Drink warm lemon water before meals');
    guidelines.push('Include plenty of fiber from vegetables');
  }

  if (goal === 'muscle_gain') {
    guidelines.push('Ensure adequate protein intake');
    guidelines.push('Eat nutritious meals at consistent times');
    guidelines.push('Include healthy fats for hormonal support');
    guidelines.push('Time meals around exercise');
  }

  if (bmi > 25) {
    guidelines.push('Focus on lighter preparations of food');
    guidelines.push('Include more raw vegetables');
    guidelines.push('Reduce portion sizes gradually');
  }

  guidelines.push('Drink 8-10 glasses of water daily');
  guidelines.push('Avoid eating late at night');
  guidelines.push('Chew food thoroughly for better digestion');
  guidelines.push('Follow the principle of seasonal eating');

  return guidelines;
}
