import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import { CalendarDays, Plus, Clock, Users, MapPin } from 'lucide-react';

export default function AdminSchedule() {
  const { classes, trainers, showToast } = useGym();
  const [addClassModal, setAddClassModal] = useState(false);
  const [classList, setClassList] = useState(classes);

  const [classForm, setClassForm] = useState({
    name: '',
    category: 'Strength',
    day: 'Monday',
    time: '06:30 AM - 07:30 AM',
    trainer: 'Vikram Chauhan',
    room: 'Studio Hall A',
    capacity: 20
  });

  const handleAddClass = (e) => {
    e.preventDefault();
    const newCls = {
      id: `CLS-${Date.now().toString().slice(-4)}`,
      ...classForm,
      enrolled: 0,
      description: 'Scheduled group fitness session.'
    };
    setClassList([...classList, newCls]);
    setAddClassModal(false);
    showToast(`New group class "${newCls.name}" added to timetable!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Weekly Classes & Studio Schedule
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Manage group classes, booking limits, and trainer assignments.
          </p>
        </div>

        <button
          onClick={() => setAddClassModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Timetable Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classList.map(cls => (
          <div key={cls.id} className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8590C]/15 text-[#E8590C] border border-[#E8590C]/30">
                  {cls.category}
                </span>
                <span className="text-xs font-semibold text-[#F2F2F2]">{cls.day}</span>
              </div>

              <h3 className="font-heading text-lg font-bold uppercase text-[#F2F2F2] mb-1">
                {cls.name}
              </h3>
              <p className="text-xs text-[#9A9A9A] mb-4">
                {cls.description}
              </p>

              <div className="space-y-2 text-xs text-[#9A9A9A] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>{cls.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#2F9E44]" />
                  <span>Instructor: <strong className="text-[#F2F2F2]">{cls.trainer}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#666666]" />
                  <span>{cls.room}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#242424] flex items-center justify-between text-xs">
              <span className="text-[#9A9A9A]">
                Bookings: <strong className="text-[#F2F2F2]">{cls.enrolled}</strong> / {cls.capacity}
              </span>
              <div className="w-24 bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#E8590C] h-full rounded-full"
                  style={{ width: `${Math.min(100, (cls.enrolled / cls.capacity) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD CLASS MODAL */}
      <Modal
        isOpen={addClassModal}
        onClose={() => setAddClassModal(false)}
        title="Add Class Timetable Slot"
      >
        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Class Title</label>
            <input
              type="text"
              required
              value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
              placeholder="e.g. Olympic Weightlifting Workshop"
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Day of Week</label>
              <select
                value={classForm.day}
                onChange={(e) => setClassForm({ ...classForm, day: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Category</label>
              <select
                value={classForm.category}
                onChange={(e) => setClassForm({ ...classForm, category: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>Strength</option>
                <option>CrossFit</option>
                <option>Yoga</option>
                <option>HIIT</option>
                <option>Zumba</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Timing</label>
              <input
                type="text"
                required
                value={classForm.time}
                onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                placeholder="e.g. 06:30 AM - 07:30 AM"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Max Capacity</label>
              <input
                type="number"
                min="5"
                max="50"
                value={classForm.capacity}
                onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setAddClassModal(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Add To Timetable
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

