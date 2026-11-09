export const indianMealPlans = [
  {
    id: "DIET-FATLOSS-VEG",
    title: "Vegetarian Fat Loss Protocol",
    calories: 1650,
    macros: { protein: 120, carbs: 165, fats: 48 },
    type: "Vegetarian",
    goal: "Fat Loss",
    description: "High-protein Indian vegetarian plan utilizing paneer, tofu, lentils, Greek curd, and sprouts to maintain lean muscle while shedding body fat.",
    meals: [
      {
        meal: "Breakfast (08:00 AM)",
        items: "2 Moong Dal Chillas with 50g grated Paneer + Mint chutney + 1 cup Green tea",
        calories: 380,
        protein: 26,
        carbs: 42,
        fats: 11
      },
      {
        meal: "Mid-Morning (11:00 AM)",
        items: "1 bowl Sprouted Moong & Kala Chana chaat with lemon + cucumber + 10 almonds",
        calories: 220,
        protein: 14,
        carbs: 24,
        fats: 7
      },
      {
        meal: "Lunch (01:30 PM)",
        items: "2 Multigrain Rotis + 1 bowl Thick Dal Tadka + 150g Low-fat Paneer Bhurji + Big Cucumber & Tomato Salad",
        calories: 520,
        protein: 42,
        carbs: 56,
        fats: 16
      },
      {
        meal: "Evening Snack / Pre-Workout (05:00 PM)",
        items: "1 scoop Whey Protein in water OR 200g Fresh Hung Curd with roasted Jeera + 1 small Apple",
        calories: 210,
        protein: 24,
        carbs: 18,
        fats: 4
      },
      {
        meal: "Dinner (08:30 PM)",
        items: "1 bowl Soya Chunks Curry (50g raw soya) + 1 small bowl Steamed Brown Rice (80g) + Steamed Greens",
        calories: 320,
        protein: 30,
        carbs: 35,
        fats: 6
      }
    ]
  },
  {
    id: "DIET-MUSCLE-NONVEG",
    title: "High-Protein Muscle Hypertrophy Protocol",
    calories: 2800,
    macros: { protein: 185, carbs: 320, fats: 75 },
    type: "Non-Vegetarian",
    goal: "Muscle Gain",
    description: "Designed for progressive overload and maximal muscle tissue repair with chicken breast, whole eggs, oats, and peanut butter.",
    meals: [
      {
        meal: "Breakfast (07:30 AM)",
        items: "3 Whole Eggs + 3 Egg Whites Scrambled + 2 slices Whole Wheat Toast with 1 tbsp Peanut butter + 1 Banana",
        calories: 620,
        protein: 44,
        carbs: 62,
        fats: 22
      },
      {
        meal: "Mid-Morning (11:00 AM)",
        items: "Overnight Rolled Oats (70g) with 200ml Toned Milk, 1 scoop Whey, chia seeds & crushed walnuts",
        calories: 510,
        protein: 38,
        carbs: 58,
        fats: 14
      },
      {
        meal: "Lunch (01:45 PM)",
        items: "200g Grilled Chicken Breast / Tandoori Tikka + 150g Basmati Rice + 1 bowl Rajma/Chole + Cucumbers",
        calories: 680,
        protein: 52,
        carbs: 78,
        fats: 16
      },
      {
        meal: "Pre-Workout (05:00 PM)",
        items: "2 Boiled Potatoes with pinch of rock salt OR 1 bowl Poha with roasted peanuts + Black Coffee",
        calories: 340,
        protein: 10,
        carbs: 64,
        fats: 6
      },
      {
        meal: "Dinner (09:00 PM)",
        items: "180g Fish Fillet or Chicken Curry + 3 Phulkas + 1 cup Curd + Stir-fried French Beans & Carrots",
        calories: 650,
        protein: 48,
        carbs: 58,
        fats: 17
      }
    ]
  },
  {
    id: "DIET-MAINTAIN-EGG",
    title: "Balanced Daily Vitality Protocol",
    calories: 2150,
    macros: { protein: 140, carbs: 240, fats: 60 },
    type: "Eggitarian",
    goal: "Maintenance",
    description: "Sustainable everyday lifestyle nutrition promoting steady energy, healthy hormonal profile, and clean digestion.",
    meals: [
      {
        meal: "Breakfast (08:00 AM)",
        items: "4 Boiled Egg Whites + 1 Whole Egg + 1 bowl Vegetable Upma with curry leaves + Ginger tea",
        calories: 420,
        protein: 28,
        carbs: 46,
        fats: 12
      },
      {
        meal: "Mid-Morning (11:15 AM)",
        items: "1 glass Roasted Chana Sattu drink (40g) with lemon, roasted cumin & black salt",
        calories: 210,
        protein: 12,
        carbs: 32,
        fats: 3
      },
      {
        meal: "Lunch (01:30 PM)",
        items: "2 Ragi/Jowar Rotis + 1 bowl Yellow Moong Dal + 100g Paneer Tawa Bhurji + Green salad",
        calories: 580,
        protein: 36,
        carbs: 65,
        fats: 18
      },
      {
        meal: "Evening Snack (05:00 PM)",
        items: "Handful Roasted Makhana (Foxnuts) + 1 cup Masala Chai (no sugar) + 1 boiled egg",
        calories: 220,
        protein: 11,
        carbs: 22,
        fats: 9
      },
      {
        meal: "Dinner (08:30 PM)",
        items: "1 bowl Paneer & Mixed Vegetable Biryani with Brown Rice + 1 bowl Cucumber Mint Raita",
        calories: 520,
        protein: 29,
        carbs: 65,
        fats: 15
      }
    ]
  }
];

export const indianFoodDatabase = [
  { name: "Phulka / Roti (Whole Wheat, 1 pc)", serving: "35g", calories: 85, protein: 3.1, carbs: 17.5, fats: 0.5, category: "Grains" },
  { name: "Steamed White Basmati Rice (1 bowl)", serving: "150g cooked", calories: 195, protein: 4.0, carbs: 43.0, fats: 0.4, category: "Grains" },
  { name: "Steamed Brown Rice (1 bowl)", serving: "150g cooked", calories: 180, protein: 4.5, carbs: 38.0, fats: 1.5, category: "Grains" },
  { name: "Poha with Vegetables & Peanuts (1 bowl)", serving: "150g", calories: 240, protein: 5.5, carbs: 38.0, fats: 7.2, category: "Breakfast" },
  { name: "Moong Dal Chilla (1 large)", serving: "70g", calories: 140, protein: 9.0, carbs: 18.0, fats: 3.2, category: "Breakfast" },
  { name: "Besan Chilla with Onions (1 pc)", serving: "80g", calories: 165, protein: 8.5, carbs: 20.0, fats: 4.8, category: "Breakfast" },
  { name: "Paneer (Fresh Cow Milk, Raw)", serving: "100g", calories: 265, protein: 18.3, carbs: 3.2, fats: 20.8, category: "Dairy & Protein" },
  { name: "Low-Fat Paneer", serving: "100g", calories: 160, protein: 25.0, carbs: 4.0, fats: 4.5, category: "Dairy & Protein" },
  { name: "Tofu (Soya Paneer)", serving: "100g", calories: 95, protein: 12.0, carbs: 2.5, fats: 4.5, category: "Dairy & Protein" },
  { name: "Chicken Breast (Boneless, Raw)", serving: "100g", calories: 120, protein: 26.0, carbs: 0.0, fats: 1.5, category: "Non-Veg Protein" },
  { name: "Tandoori Chicken (1 breast piece)", serving: "150g", calories: 220, protein: 34.0, carbs: 3.0, fats: 7.5, category: "Non-Veg Protein" },
  { name: "Boiled Whole Egg (Large, 1 pc)", serving: "50g", calories: 74, protein: 6.3, carbs: 0.4, fats: 5.0, category: "Non-Veg Protein" },
  { name: "Boiled Egg White (1 pc)", serving: "33g", calories: 17, protein: 3.6, carbs: 0.2, fats: 0.1, category: "Non-Veg Protein" },
  { name: "Yellow Moong Dal Tadka (1 bowl)", serving: "150g", calories: 155, protein: 9.2, carbs: 22.0, fats: 3.5, category: "Lentils" },
  { name: "Rajma Masala (Red Kidney Beans)", serving: "150g", calories: 195, protein: 11.5, carbs: 28.0, fats: 4.2, category: "Lentils" },
  { name: "Chole / Chana Masala", serving: "150g", calories: 215, protein: 10.8, carbs: 30.5, fats: 5.5, category: "Lentils" },
  { name: "Soya Chunks (Raw Uncooked)", serving: "50g", calories: 172, protein: 26.0, carbs: 16.5, fats: 0.5, category: "Dairy & Protein" },
  { name: "Fresh Curd / Dahi (Whole Milk)", serving: "100g", calories: 98, protein: 4.1, carbs: 4.5, fats: 6.5, category: "Dairy & Protein" },
  { name: "Greek Style Hung Curd (Low Fat)", serving: "100g", calories: 72, protein: 10.5, carbs: 3.8, fats: 1.2, category: "Dairy & Protein" },
  { name: "Roasted Chana Sattu Powder", serving: "40g (1 glass)", calories: 164, protein: 10.2, carbs: 26.0, fats: 2.1, category: "Beverages" },
  { name: "Roasted Makhana (Foxnuts, Plain)", serving: "30g", calories: 105, protein: 3.0, carbs: 20.0, fats: 0.3, category: "Snacks" },
  { name: "Roasted Peanuts (Unsalted)", serving: "30g", calories: 170, protein: 7.5, carbs: 5.0, fats: 14.5, category: "Snacks" },
  { name: "Almonds (Raw, 10 pcs)", serving: "14g", calories: 82, protein: 3.0, carbs: 2.8, fats: 7.0, category: "Snacks" },
  { name: "Whey Protein Isolate (1 scoop)", serving: "30g", calories: 120, protein: 27.0, carbs: 1.0, fats: 0.8, category: "Supplements" },
  { name: "Natural Peanut Butter (1 tbsp)", serving: "16g", calories: 95, protein: 4.0, carbs: 3.0, fats: 8.0, category: "Spreads" },
  { name: "Sprouted Moong Beans (Boiled)", serving: "100g", calories: 105, protein: 7.2, carbs: 18.0, fats: 0.4, category: "Lentils" },
  { name: "Palak Paneer (1 bowl)", serving: "150g", calories: 245, protein: 14.0, carbs: 8.0, fats: 17.0, category: "Vegetables" },
  { name: "Bhindi Masala (Stir-Fried Okra)", serving: "120g", calories: 110, protein: 2.5, carbs: 11.0, fats: 6.2, category: "Vegetables" },
  { name: "Aloo Gobhi (Dry)", serving: "120g", calories: 135, protein: 3.2, carbs: 16.5, fats: 6.5, category: "Vegetables" },
  { name: "Fish Curry (Rohu / Katla)", serving: "150g", calories: 210, protein: 22.0, carbs: 4.5, fats: 11.5, category: "Non-Veg Protein" }
];

export const workoutSplits = [
  {
    id: "SPLIT-PPL",
    name: "Push / Pull / Legs Hypertrophy Split",
    daysPerWeek: 6,
    level: "Intermediate - Advanced",
    description: "The gold standard split for maximal muscle hypertrophy and strength progression.",
    schedule: [
      {
        day: "Day 1: Push (Chest, Shoulders, Triceps)",
        exercises: [
          { name: "Barbell Flat Bench Press", sets: "4", reps: "6 - 8", rest: "90s", muscle: "Chest", notes: "Heavy compound. Focus on scapula retraction." },
          { name: "Incline Dumbbell Press", sets: "3", reps: "8 - 10", rest: "75s", muscle: "Upper Chest", notes: "30 degree bench angle." },
          { name: "Standing Overhead Barbell Press", sets: "3", reps: "6 - 8", rest: "90s", muscle: "Shoulders", notes: "Tight core, full lock overhead." },
          { name: "Dumbbell Lateral Raises", sets: "4", reps: "12 - 15", rest: "60s", muscle: "Side Delts", notes: "Control the eccentric descent." },
          { name: "Tricep Rope Pushdowns", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Triceps", notes: "Flaring ropes at the bottom." },
          { name: "Overhead Dumbbell Tricep Extension", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Tricep Long Head", notes: "Deep stretch behind the neck." }
        ]
      },
      {
        day: "Day 2: Pull (Back, Rear Delts, Biceps)",
        exercises: [
          { name: "Barbell Conventional Deadlift", sets: "4", reps: "5", rest: "120s", muscle: "Posterior Chain", notes: "Drive floor away, lock hips." },
          { name: "Wide Grip Lat Pulldown", sets: "4", reps: "8 - 10", rest: "75s", muscle: "Lats", notes: "Pull to collarbone, hold for 1 sec." },
          { name: "Chest-Supported T-Bar Row", sets: "3", reps: "8 - 10", rest: "75s", muscle: "Mid Back", notes: "Full stretch at bottom." },
          { name: "Face Pulls on Cable", sets: "4", reps: "15", rest: "60s", muscle: "Rear Delts / Rotators", notes: "Pull towards eyes with external rotation." },
          { name: "Incline Dumbbell Bicep Curls", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Biceps", notes: "Keep elbows pinned back." },
          { name: "Hammer Curls", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Brachialis & Forearms", notes: "Thick arm development." }
        ]
      },
      {
        day: "Day 3: Legs & Abs",
        exercises: [
          { name: "Barbell Back Squat", sets: "4", reps: "6 - 8", rest: "120s", muscle: "Quads & Glutes", notes: "Hit parallel depth with bracing." },
          { name: "Romanian Deadlift (Dumbbell or Bar)", sets: "3", reps: "8 - 10", rest: "90s", muscle: "Hamstrings", notes: "Push hips straight back." },
          { name: "Leg Press (45 Degree)", sets: "3", reps: "10 - 12", rest: "90s", muscle: "Quads", notes: "Deep knee bend without lower back rounding." },
          { name: "Lying Leg Curl", sets: "3", reps: "12 - 15", rest: "60s", muscle: "Hamstrings", notes: "Slow 3-second negative." },
          { name: "Standing Calf Raises", sets: "4", reps: "15 - 20", rest: "45s", muscle: "Calves", notes: "2-second pause at peak stretch." },
          { name: "Hanging Leg Raises", sets: "3", reps: "12 - 15", rest: "60s", muscle: "Lower Abs", notes: "Tuck pelvis at top." }
        ]
      }
    ]
  },
  {
    id: "SPLIT-UPPERLOWER",
    name: "Upper / Lower Heavy Strength Split",
    daysPerWeek: 4,
    level: "All Levels",
    description: "4-day split maximizing recovery and frequency for busy professionals.",
    schedule: [
      {
        day: "Monday: Upper Strength A",
        exercises: [
          { name: "Barbell Bench Press", sets: "4", reps: "5", rest: "90s", muscle: "Chest" },
          { name: "Bent-Over Barbell Row", sets: "4", reps: "6 - 8", rest: "90s", muscle: "Back" },
          { name: "Overhead Military Press", sets: "3", reps: "6 - 8", rest: "90s", muscle: "Shoulders" },
          { name: "Pull-Ups (Weighted if possible)", sets: "3", reps: "6 - 10", rest: "75s", muscle: "Lats" },
          { name: "Dumbbell Bicep Curl & Skullcrusher Superset", sets: "3", reps: "10", rest: "60s", muscle: "Arms" }
        ]
      },
      {
        day: "Tuesday: Lower Strength A",
        exercises: [
          { name: "Barbell Back Squat", sets: "4", reps: "5", rest: "120s", muscle: "Quads" },
          { name: "Romanian Deadlift", sets: "4", reps: "6 - 8", rest: "90s", muscle: "Hamstrings" },
          { name: "Bulgarian Split Squat", sets: "3", reps: "8 per leg", rest: "75s", muscle: "Glutes & Quads" },
          { name: "Seated Calf Raise", sets: "4", reps: "12 - 15", rest: "60s", muscle: "Calves" },
          { name: "Cable Woodchoppers", sets: "3", reps: "12 per side", rest: "45s", muscle: "Obliques" }
        ]
      }
    ]
  },
  {
    id: "SPLIT-BEGINNER",
    name: "Beginner 3-Day Full Body Foundation",
    daysPerWeek: 3,
    level: "Beginner",
    description: "Master motor patterns, neuromuscular adaptation, and core stability.",
    schedule: [
      {
        day: "Day 1: Full Body Fundamentals",
        exercises: [
          { name: "Goblet Squat with Dumbbell", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Legs" },
          { name: "Seated Cable Chest Press", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Chest" },
          { name: "Seated Cable Row", sets: "3", reps: "10 - 12", rest: "60s", muscle: "Back" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "10", rest: "60s", muscle: "Shoulders" },
          { name: "Plank Hold", sets: "3", reps: "30 - 45s", rest: "45s", muscle: "Core" }
        ]
      }
    ]
  }
];

