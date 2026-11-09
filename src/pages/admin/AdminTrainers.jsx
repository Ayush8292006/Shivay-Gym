import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import ImageFallback from '../../components/common/ImageFallback';
import Modal from '../../components/common/Modal';
import { UserCheck, Phone, DollarSign, Award, Clock, Users, IndianRupee } from 'lucide-react';

export default function AdminTrainers() {
  const { trainers, members, showToast } = useGym();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerDetailModal, setTrainerDetailModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Trainers & Coaching Staff ({trainers.length})
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Staff payroll, floor shifts, client allocations, and PT commission metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map(tr => {
          const assignedMembers = members.filter(m => m.trainerId === tr.id || m.trainer === tr.name);

          return (
            <div key={tr.id} className="rounded-lg border border-[#2A2A2A] bg-[#161616] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <ImageFallback
                    src={tr.image}
                    alt={tr.name}
                    className="w-full h-full"
                    zoomOnHover={true}
                    overlay={true}
                    overlayOpacity="bg-black/30"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[11px] font-mono text-[#E8590C] font-semibold">
                    {tr.id}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">{tr.name}</h3>
                    <div className="text-xs text-[#E8590C] font-semibold">{tr.role}</div>
                    <div className="text-[11px] text-[#9A9A9A] mt-0.5">{tr.certification}</div>
                  </div>

                  <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#9A9A9A] uppercase">Assigned</span>
                      <div className="font-heading text-base font-bold text-[#F2F2F2] mt-0.5">{assignedMembers.length}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9A9A9A] uppercase">Base Salary</span>
                      <div className="font-heading text-base font-bold text-[#2F9E44] mt-0.5">₹{(tr.salary / 1000).toFixed(0)}k</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9A9A9A] uppercase">PT Comm.</span>
                      <div className="font-heading text-base font-bold text-[#E8590C] mt-0.5">{tr.ptCommissionPct}%</div>
                    </div>
                  </div>

                  <div className="text-xs text-[#9A9A9A] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                      <span>{tr.shift}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#2F9E44]" />
                      <span>{tr.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#242424] bg-[#121212]">
                <button
                  onClick={() => {
                    setSelectedTrainer({ ...tr, assignedMembers });
                    setTrainerDetailModal(true);
                  }}
                  className="w-full py-2 rounded bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-xs font-semibold text-[#F2F2F2] transition-colors"
                >
                  View Client Roster ({assignedMembers.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TRAINER DETAIL & CLIENTS MODAL */}
      <Modal
        isOpen={trainerDetailModal}
        onClose={() => setTrainerDetailModal(false)}
        title={`Trainer Profile: ${selectedTrainer?.name}`}
        subtitle={`${selectedTrainer?.role} • Experience: ${selectedTrainer?.experience}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] space-y-1">
            <span className="text-[#9A9A9A]">Bio & Philosophy:</span>
            <p className="text-[#F2F2F2] leading-relaxed">{selectedTrainer?.bio}</p>
          </div>

          <div>
            <h4 className="font-heading uppercase text-sm font-bold text-[#F2F2F2] mb-2">
              Assigned Members Roster ({selectedTrainer?.assignedMembers?.length || 0})
            </h4>
            <div className="divide-y divide-[#242424] max-h-56 overflow-y-auto rounded border border-[#2A2A2A] bg-[#121212]">
              {selectedTrainer?.assignedMembers?.map(m => (
                <div key={m.id} className="p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#F2F2F2]">{m.name}</span>
                    <span className="text-[11px] text-[#9A9A9A] ml-2">({m.plan})</span>
                  </div>
                  <span className="text-[#E8590C] font-mono font-medium">{m.attendanceStreak}d streak</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

