import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [squadType, setSquadType] = useState('Outbound SDR Squad');
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    currentTeamSize: '1-10',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E4B57]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-[28px] border border-[#EDEAE4]/25 shadow-2xl bg-[#1E4B57]/95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#346D80] flex items-center justify-center text-[#C9A24B]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FA69C]">
                14-Day Deployment Strategy
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-[#EDEAE4] tracking-tight mb-2">
              Schedule Your Discovery Call
            </h3>
            <p className="text-xs text-[#EDEAE4]/70 mb-6">
              Connect with our Growth Directors to evaluate your ICP, cadence infrastructure, and squad requirements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Squad Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#EDEAE4]/90 mb-1.5">
                  Desired Squad Configuration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Outbound SDR Squad', 'Full-Cycle Account Execs', 'Inbound Speed-to-Lead', 'RevOps & Playbook'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSquadType(type)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                        squadType === type
                          ? 'bg-[#346D80] border-[#C9A24B] text-[#EDEAE4]'
                          : 'bg-[#EDEAE4]/[0.05] border-[#EDEAE4]/10 text-[#EDEAE4]/70 hover:bg-[#EDEAE4]/[0.08]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/90 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-xs text-[#EDEAE4] placeholder-[#EDEAE4]/40 focus:outline-none focus:border-[#7FA69C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/90 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    placeholder="marcus@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-xs text-[#EDEAE4] placeholder-[#EDEAE4]/40 focus:outline-none focus:border-[#7FA69C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/90 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Acme SaaS Inc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-xs text-[#EDEAE4] placeholder-[#EDEAE4]/40 focus:outline-none focus:border-[#7FA69C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/90 mb-1">
                    Current Sales Reps
                  </label>
                  <select
                    value={formData.currentTeamSize}
                    onChange={(e) => setFormData({ ...formData, currentTeamSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E4B57] border border-[#EDEAE4]/15 text-xs text-[#EDEAE4] focus:outline-none focus:border-[#7FA69C]"
                  >
                    <option value="0">0 (Founder-led sales)</option>
                    <option value="1-5">1 - 5 Sales Reps</option>
                    <option value="6-20">6 - 20 Sales Reps</option>
                    <option value="20+">20+ Enterprise Reps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EDEAE4]/90 mb-1">
                  Target Market / ICP Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Targeting VP of Engineering at US FinTech companies with 100+ devs..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-xs text-[#EDEAE4] placeholder-[#EDEAE4]/40 focus:outline-none focus:border-[#7FA69C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-gold w-full py-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Custom Squad Architecture</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-[#EDEAE4]/60 pt-1">
                <span>✓ 24-hr response SLA</span>
                <span>✓ NDA upon request</span>
                <span>✓ Zero recruiter fees</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#C9A24B]/20 border border-[#C9A24B] flex items-center justify-center mx-auto text-[#C9A24B]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#EDEAE4]">
              Strategy Call Requested!
            </h3>
            <p className="text-sm text-[#EDEAE4]/80 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-[#C9A24B]">{formData.fullName || 'there'}</span>. A RepTeam Growth Director has received your request for <span className="font-bold text-[#EDEAE4]">{formData.companyName || 'your company'}</span> and will reach out with calendar options within 2 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setStep('form');
                  onClose();
                }}
                className="btn-gold px-6 py-2.5 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};