import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import { Utensils, Dumbbell, UserCheck, Flame, Plus } from 'lucide-react';

export default function AdminDietsWorkouts() {
  const { indianMealPlans, workoutSplits, members, updateMember, showToast } = useGym();
  const [activeTab, setActiveTab] = useState('diets'); // 'diets' or 'workouts'
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignType, setAssignType] = useState('diet');
  const [selectedPlanTitle, setSelectedPlanTitle] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || 'SHIV-1001');

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (assignType === 'diet') {
      updateMember(selectedMemberId, { assignedDiet: selectedPlanTitle });
      showToast(`Assigned diet "${selectedPlanTitle}" to member!`, 'success');
    } else {
      updateMember(selectedMemberId, { assignedWorkout: selectedPlanTitle });
      showToast(`Assigned workout "${selectedPlanTitle}" to member!`, 'success');
    }
    setAssignModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Diet & Workout Templates
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Standardized Indian macro-calculated nutrition frameworks and training splits.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('diets')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'diets' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          Indian Diet Protocols ({indianMealPlans.length})
        </button>
        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'workouts' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          Workout Splits ({workoutSplits.length})
        </button>
      </div>

      {/* TAB 1: DIET PLANS */}
      {activeTab === 'diets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {indianMealPlans.map(plan => (
            <div key={plan.id} className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8590C]/15 text-[#E8590C]">
                    {plan.goal}
                  </span>
                  <span className="text-xs text-[#9A9A9A]">{plan.type}</span>
                </div>

                <h3 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">
                  {plan.title}
                </h3>
                <p className="text-xs text-[#9A9A9A] mt-1 mb-4 leading-relaxed">
                  {plan.description}
                </p>

                <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] grid grid-cols-4 gap-1 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Calories</span>
                    <div className="font-heading text-sm font-bold text-[#F2F2F2] mt-0.5">{plan.calories}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Protein</span>
                    <div className="font-heading text-sm font-bold text-[#E8590C] mt-0.5">{plan.macros.protein}g</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Carbs</span>
                    <div className="font-heading text-sm font-bold text-[#4DABF7] mt-0.5">{plan.macros.carbs}g</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Fats</span>
                    <div className="font-heading text-sm font-bold text-[#E8A317] mt-0.5">{plan.macros.fats}g</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.meals.slice(0, 3).map((m, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#121212] border border-[#242424] text-xs">
                      <div className="font-semibold text-[#F2F2F2]">{m.meal}</div>
                      <div className="text-[11px] text-[#9A9A9A] truncate">{m.items}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setAssignType('diet');
                  setSelectedPlanTitle(plan.title);
                  setAssignModalOpen(true);
                }}
                className="w-full py-2 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-xs font-semibold text-[#F2F2F2] transition-colors"
              >
                Assign Diet to Member
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: WORKOUT SPLITS */}
      {activeTab === 'workouts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {workoutSplits.map(split => (
            <div key={split.id} className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2F9E44]/15 text-[#2F9E44]">
                    {split.level}
                  </span>
                  <span className="text-xs text-[#9A9A9A]">{split.daysPerWeek} Days / Week</span>
                </div>

                <h3 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">
                  {split.name}
                </h3>
                <p className="text-xs text-[#9A9A9A] mt-1 mb-4 leading-relaxed">
                  {split.description}
                </p>

                <div className="space-y-2 mb-4">
                  {split.schedule.map((day, dIdx) => (
                    <div key={dIdx} className="p-2.5 rounded bg-[#121212] border border-[#242424] text-xs space-y-1">
                      <div className="font-semibold text-[#E8590C]">{day.day}</div>
                      <div className="text-[11px] text-[#9A9A9A]">
                        {day.exercises.map(e => e.name).slice(0, 3).join(' • ')}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setAssignType('workout');
                  setSelectedPlanTitle(split.name);
                  setAssignModalOpen(true);
                }}
                className="w-full py-2 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-xs font-semibold text-[#F2F2F2] transition-colors"
              >
                Assign Split to Member
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ASSIGN MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign ${assignType === 'diet' ? 'Diet' : 'Workout'} Protocol`}
        subtitle={`Selected: ${selectedPlanTitle}`}
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Select Member</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id}) • {m.plan}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

