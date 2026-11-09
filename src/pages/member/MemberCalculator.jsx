import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Calculator, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function MemberCalculator() {
  const { currentMember } = useGym();

  const [form, setForm] = useState({
    age: currentMember?.age || 27,
    gender: currentMember?.gender === 'Female' ? 'Female' : 'Male',
    height: currentMember?.measurements?.height || 178,
    weight: currentMember?.measurements?.weight || 76,
    activityLevel: 1.55, // 1.2 Sedentary, 1.375 Light, 1.55 Moderate, 1.725 Heavy, 1.9 Athlete
    goal: 'fat_loss' // 'fat_loss', 'maintain', 'muscle_gain'
  });

  const [result, setResult] = useState(() => calculateMetrics(form));

  function calculateMetrics(data) {
    const { age, gender, height, weight, activityLevel, goal } = data;

    // BMI calculation
    const hM = height / 100;
    const bmi = Number((weight / (hM * hM)).toFixed(1));
    let bmiCategory = 'Normal Weight';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obese';

    // Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'Male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = Math.round(bmr * Number(activityLevel));

    // Goal calories
    let targetCalories = tdee;
    if (goal === 'fat_loss') targetCalories = Math.round(tdee * 0.82); // -18% deficit
    else if (goal === 'muscle_gain') targetCalories = Math.round(tdee * 1.12); // +12% surplus

    // Protein: 2.0g per kg of bodyweight
    const proteinGrams = Math.round(weight * 2.0);
    const proteinCalories = proteinGrams * 4;

    // Fats: 25% of target calories
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: remainder
    const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const carbGrams = Math.round(carbCalories / 4);

    // Water: 35ml per kg
    const waterLitres = Number(((weight * 35) / 1000).toFixed(1));

    return {
      bmi,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      proteinGrams,
      fatGrams,
      carbGrams,
      waterLitres
    };
  }

  const handleCalculate = (e) => {
    e.preventDefault();
    setResult(calculateMetrics(form));
  };

  const macroData = [
    { name: `Protein (${result.proteinGrams}g)`, value: result.proteinGrams * 4, color: '#E8590C' },
    { name: `Carbs (${result.carbGrams}g)`, value: result.carbGrams * 4, color: '#4DABF7' },
    { name: `Fats (${result.fatGrams}g)`, value: result.fatGrams * 9, color: '#E8A317' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8590C]/15 text-[#E8590C] mb-1">
          <Calculator className="w-3.5 h-3.5" />
          Mifflin-St Jeor Clinical Formula
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Calorie & Macro Calculator
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Calculates your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and optimal Indian macro split.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Age (Yrs)</label>
            <input
              type="number"
              min="14"
              max="90"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="200"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Height (cm)</label>
            <input
              type="number"
              min="100"
              max="240"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Weekly Physical Activity</label>
            <select
              value={form.activityLevel}
              onChange={(e) => setForm({ ...form, activityLevel: Number(e.target.value) })}
              className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              <option value={1.2}>Sedentary (Desk job, little exercise)</option>
              <option value={1.375}>Lightly Active (1-3 gym workouts/week)</option>
              <option value={1.55}>Moderately Active (3-5 heavy lifts/week)</option>
              <option value={1.725}>Very Active (6-7 intense sessions/week)</option>
              <option value={1.9}>Extra Active (Twice daily training / Athlete)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Primary Physical Target</label>
            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              <option value="fat_loss">Fat Loss (-18% Deficit)</option>
              <option value="maintain">Maintenance (Maintain Lean Mass)</option>
              <option value="muscle_gain">Lean Muscle Hypertrophy (+12% Surplus)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          Compute Nutrition Breakdown
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Daily Calories</span>
              <div className="font-heading text-3xl font-bold text-[#E8590C] tabular-nums mt-0.5">
                {result.targetCalories}
              </div>
              <span className="text-[10px] text-[#9A9A9A]">kcal / day</span>
            </div>

            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">TDEE / BMR</span>
              <div className="font-heading text-xl font-bold text-[#F2F2F2] tabular-nums mt-1">
                {result.tdee} / {result.bmr}
              </div>
              <span className="text-[10px] text-[#9A9A9A]">Maintenance kcal</span>
            </div>

            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Body Mass Index</span>
              <div className="font-heading text-xl font-bold text-[#F2F2F2] tabular-nums mt-1">
                {result.bmi}
              </div>
              <span className="text-[10px] text-[#2F9E44]">{result.bmiCategory}</span>
            </div>

            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
              <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Water Requirement</span>
              <div className="font-heading text-xl font-bold text-[#4DABF7] tabular-nums mt-1">
                {result.waterLitres} L
              </div>
              <span className="text-[10px] text-[#9A9A9A]">~35 ml / kg</span>
            </div>
          </div>

          {/* Macro Donut Chart & Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-2 border-t border-[#242424]">
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                    formatter={(val) => [`${Math.round(val)} kcal`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Protein (2.0 g/kg)</div>
                  <div className="text-sm font-bold text-[#E8590C]">{result.proteinGrams} grams</div>
                </div>
                <span className="font-mono text-xs text-[#9A9A9A]">{result.proteinGrams * 4} kcal</span>
              </div>

              <div className="p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Carbohydrates</div>
                  <div className="text-sm font-bold text-[#4DABF7]">{result.carbGrams} grams</div>
                </div>
                <span className="font-mono text-xs text-[#9A9A9A]">{result.carbGrams * 4} kcal</span>
              </div>

              <div className="p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Healthy Dietary Fats</div>
                  <div className="text-sm font-bold text-[#E8A317]">{result.fatGrams} grams</div>
                </div>
                <span className="font-mono text-xs text-[#9A9A9A]">{result.fatGrams * 9} kcal</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#121212] rounded-lg border border-[#242424] text-[11px] text-[#666666] leading-relaxed">
            *General nutritional guidance based on sports science principles. Consult a registered physician or dietitian before making drastic calorie cuts if you have underlying conditions.
          </div>
        </div>
      )}
    </div>
  );
}

