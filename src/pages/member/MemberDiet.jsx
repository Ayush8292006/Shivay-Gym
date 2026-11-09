import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Utensils, Search, Plus, CheckCircle2, Flame, Droplets } from 'lucide-react';

export default function MemberDiet() {
  const { indianMealPlans, indianFoodDatabase, showToast } = useGym();

  const [activePlanId, setActivePlanId] = useState(indianMealPlans[0].id);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [loggedItems, setLoggedItems] = useState([
    { name: 'Moong Dal Chilla (1 large)', calories: 140, protein: 9 },
    { name: 'Fresh Curd / Dahi (100g)', calories: 98, protein: 4.1 },
    { name: 'Chicken Breast (100g)', calories: 120, protein: 26 },
    { name: 'Phulka / Roti (2 pcs)', calories: 170, protein: 6.2 }
  ]);

  const activePlan = indianMealPlans.find(p => p.id === activePlanId) || indianMealPlans[0];

  const totalLoggedCalories = loggedItems.reduce((acc, item) => acc + item.calories, 0);
  const totalLoggedProtein = loggedItems.reduce((acc, item) => acc + item.protein, 0);

  const filteredFoods = indianFoodDatabase.filter(food =>
    food.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  const handleAddFoodToLog = (food) => {
    setLoggedItems([...loggedItems, { name: food.name, calories: food.calories, protein: food.protein }]);
    showToast(`Added ${food.name} to today's log!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Indian Diet & Nutrition Tracker
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Structured Indian meal plans (poha, paneer, dal, chicken) and verified calorie lookup.
        </p>
      </div>

      {/* Daily Tracker Card: Total vs Target */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#F2F2F2]">Today's Intake vs Target</span>
          <span className="font-mono text-xs text-[#E8590C] font-bold">
            {totalLoggedCalories} / {activePlan.calories} kcal
          </span>
        </div>

        <div className="w-full bg-[#1E1E1E] h-2.5 rounded-full overflow-hidden mb-4 border border-[#2A2A2A]">
          <div
            className="bg-[#E8590C] h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (totalLoggedCalories / activePlan.calories) * 100)}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#9A9A9A]">Protein Consumed</span>
            <div className="font-heading text-lg font-bold text-[#E8590C] mt-0.5">
              {Math.round(totalLoggedProtein)}g / {activePlan.macros.protein}g
            </div>
          </div>
          <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#9A9A9A]">Calories Remaining</span>
            <div className="font-heading text-lg font-bold text-[#2F9E44] mt-0.5">
              {Math.max(0, activePlan.calories - totalLoggedCalories)} kcal
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {indianMealPlans.map(plan => (
          <button
            key={plan.id}
            onClick={() => setActivePlanId(plan.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activePlanId === plan.id
                ? 'bg-[#E8590C] text-white'
                : 'bg-[#161616] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2]'
            }`}
          >
            {plan.goal} ({plan.type})
          </button>
        ))}
      </div>

      {/* Active Meal Plan Breakdown */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">
              {activePlan.title}
            </h2>
            <span className="font-mono text-xs text-[#E8590C] font-bold">
              {activePlan.calories} Calories
            </span>
          </div>
          <p className="text-xs text-[#9A9A9A] mt-1 leading-relaxed">
            {activePlan.description}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {activePlan.meals.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F2F2F2]">{m.meal}</span>
                <span className="font-mono text-[#E8590C] font-semibold">{m.calories} kcal • {m.protein}g protein</span>
              </div>
              <p className="text-xs text-[#CCCCCC] leading-relaxed">
                {m.items}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indian Food Calorie Lookup Database */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div>
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
            Indian Food Calorie Lookup ({indianFoodDatabase.length}+ Items)
          </h2>
          <p className="text-xs text-[#9A9A9A]">
            Accurate nutritional values for roti, paneer, dal, sattu, and common home foods.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={foodSearchQuery}
            onChange={(e) => setFoodSearchQuery(e.target.value)}
            placeholder="Search food item (e.g. paneer, roti, dal, chicken)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#F2F2F2] placeholder-[#666666] focus:border-[#E8590C] focus:outline-none"
          />
        </div>

        <div className="divide-y divide-[#242424] max-h-72 overflow-y-auto rounded border border-[#2A2A2A] bg-[#121212]">
          {filteredFoods.slice(0, 10).map((food, fIdx) => (
            <div key={fIdx} className="p-3 flex items-center justify-between text-xs hover:bg-[#1A1A1A] transition-colors">
              <div>
                <div className="font-semibold text-[#F2F2F2]">{food.name}</div>
                <div className="text-[11px] text-[#9A9A9A]">
                  Serving: {food.serving} • P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#E8590C]">{food.calories} kcal</span>
                <button
                  onClick={() => handleAddFoodToLog(food)}
                  className="p-1 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-[#9A9A9A]"
                  title="Add to daily log"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

