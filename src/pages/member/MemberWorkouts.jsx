import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Dumbbell, Clock, Play, Pause, RotateCcw, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function MemberWorkouts() {
  const { workoutSplits, showToast } = useGym();
  const [selectedSplitId, setSelectedSplitId] = useState(workoutSplits[0].id);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [initialTimer, setInitialTimer] = useState(90);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      showToast('Rest time completed! Time to hit your next set!', 'info');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startTimer = (secs) => {
    setInitialTimer(secs);
    setTimerSeconds(secs);
    setTimerRunning(true);
  };

  const selectedSplit = workoutSplits.find(s => s.id === selectedSplitId) || workoutSplits[0];
  const activeDay = selectedSplit.schedule[activeDayIndex] || selectedSplit.schedule[0];

  // Completed sets tracker
  const [completedSets, setCompletedSets] = useState({});

  const toggleSet = (exIndex, setIndex) => {
    const key = `${exIndex}-${setIndex}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Floor Training & Rest Timer
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Structured progressive overload protocols and active interval clock.
        </p>
      </div>

      {/* Floating / Sticky Rest Timer Widget */}
      <div className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className={`w-6 h-6 ${timerRunning ? 'text-[#E8590C] animate-pulse' : 'text-[#9A9A9A]'}`} />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#9A9A9A]">Inter-Set Rest Timer</div>
            <div className="font-mono text-2xl font-bold text-[#F2F2F2] tabular-nums">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[60, 90, 120].map(s => (
            <button
              key={s}
              onClick={() => startTimer(s)}
              className="px-2.5 py-1.5 rounded bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-xs font-mono font-medium text-[#F2F2F2]"
            >
              {s}s
            </button>
          ))}
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white"
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { setTimerRunning(false); setTimerSeconds(initialTimer); }}
            className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {workoutSplits.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedSplitId(s.id); setActiveDayIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedSplitId === s.id
                ? 'bg-[#E8590C] text-white'
                : 'bg-[#161616] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2]'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Days Tabs within Split */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 text-xs overflow-x-auto">
        {selectedSplit.schedule.map((day, dIdx) => (
          <button
            key={dIdx}
            onClick={() => setActiveDayIndex(dIdx)}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeDayIndex === dIdx
                ? 'bg-[#2A2A2A] text-[#E8590C] font-semibold'
                : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
            }`}
          >
            {day.day.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Exercises List for Selected Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-heading text-lg font-bold uppercase text-[#F2F2F2]">{activeDay.day}</span>
          <span className="text-[#9A9A9A]">{activeDay.exercises.length} Exercises</span>
        </div>

        <div className="space-y-3">
          {activeDay.exercises.map((ex, exIdx) => {
            const numSets = parseInt(ex.sets, 10) || 3;

            return (
              <div key={exIdx} className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-base font-bold uppercase text-[#F2F2F2]">
                      {ex.name}
                    </h3>
                    <div className="text-[11px] text-[#E8590C] font-medium mt-0.5">
                      Target: {ex.muscle} • Rest: {ex.rest}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-[#9A9A9A]">
                    {ex.sets} Sets × {ex.reps} Reps
                  </div>
                </div>

                {ex.notes && (
                  <p className="text-[11px] text-[#9A9A9A] italic bg-[#1A1A1A] p-2 rounded border border-[#242424]">
                    Cue: {ex.notes}
                  </p>
                )}

                {/* Set completion check chips */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-[#666666] uppercase">Log Sets:</span>
                  {Array.from({ length: numSets }).map((_, sIdx) => {
                    const isChecked = !!completedSets[`${exIdx}-${sIdx}`];
                    return (
                      <button
                        key={sIdx}
                        onClick={() => {
                          toggleSet(exIdx, sIdx);
                          if (!isChecked) startTimer(parseInt(ex.rest, 10) || 90);
                        }}
                        className={`px-3 py-1 rounded text-xs font-mono font-semibold border transition-colors ${
                          isChecked
                            ? 'bg-[#2F9E44] border-[#2F9E44] text-white'
                            : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#9A9A9A] hover:border-[#3A3A3A]'
                        }`}
                      >
                        Set {sIdx + 1} {isChecked && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

