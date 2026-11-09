import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { CalendarCheck, Clock, Users, CheckCircle2 } from 'lucide-react';

export default function MemberBookings() {
  const { classes, trainers, showToast } = useGym();
  const [bookedClasses, setBookedClasses] = useState(['CLS-01']);

  const toggleBooking = (clsId, clsName) => {
    if (bookedClasses.includes(clsId)) {
      setBookedClasses(bookedClasses.filter(id => id !== clsId));
      showToast(`Cancelled reservation for ${clsName}`, 'info');
    } else {
      setBookedClasses([...bookedClasses, clsId]);
      showToast(`Slot reserved for ${clsName}! See you on the turf.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Class & Studio Reservations
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Reserve your spot in weekly HIIT, CrossFit, Yoga, and Strength workshops.
        </p>
      </div>

      <div className="space-y-4">
        {classes.map(cls => {
          const isBooked = bookedClasses.includes(cls.id);

          return (
            <div key={cls.id} className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E8590C]/15 text-[#E8590C]">
                      {cls.category}
                    </span>
                    <span className="text-xs font-semibold text-[#F2F2F2]">{cls.day}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold uppercase text-[#F2F2F2]">
                    {cls.name}
                  </h3>
                  <div className="text-xs text-[#9A9A9A] mt-0.5 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                    <span>{cls.time} • Coach: {cls.trainer}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBooking(cls.id, cls.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isBooked
                      ? 'bg-[#2F9E44] text-white'
                      : 'bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-[#F2F2F2]'
                  }`}
                >
                  {isBooked ? 'Reserved ✓' : 'Book Spot'}
                </button>
              </div>

              <div className="pt-2 border-t border-[#242424] flex items-center justify-between text-xs text-[#9A9A9A]">
                <span>Location: {cls.room}</span>
                <span>Capacity: {cls.enrolled + (isBooked ? 1 : 0)} / {cls.capacity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

