import React, { useState } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Phone, 
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { ContactMessage } from '../../types';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onMarkAsRead: (id: string) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onMarkAsRead,
  onDeleteMessage
}) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return m.status === 'unread';
    if (filter === 'read') return m.status === 'read';
    return true;
  });

  const handleOpen = (m: ContactMessage) => {
    setSelectedMessage(m);
    if (m.status === 'unread') {
      onMarkAsRead(m.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1E4B57]">پیام‌های تماس و استعلام قیمت عمده</h2>
          <p className="text-xs text-[#7FA69C] mt-1 font-medium">
            درخواست‌های همکاری نمایندگی، استعلام قیمت تیراژ و پیام‌های فرم تماس
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#EDEAE4]/70 backdrop-blur-sm p-1.5 rounded-2xl border border-[#7FA69C]/20">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-[#346D80] text-white shadow-xs' 
                : 'text-[#1E4B57] hover:bg-white/60'
            }`}
          >
            همه ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'unread' 
                ? 'bg-[#346D80] text-white shadow-xs' 
                : 'text-[#1E4B57] hover:bg-white/60'
            }`}
          >
            جدید ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('read')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'read' 
                ? 'bg-[#346D80] text-white shadow-xs' 
                : 'text-[#1E4B57] hover:bg-white/60'
            }`}
          >
            پاسخ داده شده ({messages.filter(m => m.status === 'read').length})
          </button>
        </div>
      </div>

      {/* Messages List Card */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-[#1E4B57]/10">
          {filteredMessages.map((m) => (
            <div
              key={m.id}
              onClick={() => handleOpen(m)}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                m.status === 'unread' 
                  ? 'bg-[#346D80]/10 hover:bg-[#346D80]/15' 
                  : 'hover:bg-[#EDEAE4]/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                  m.status === 'unread' ? 'bg-[#C9A24B] shadow-xs' : 'bg-gray-300'
                }`}></div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#1E4B57]">{m.name}</h4>
                    <span className="text-[11px] text-[#7FA69C] dir-ltr font-mono font-medium">{m.phone}</span>
                  </div>

                  <p className="font-bold text-xs text-[#346D80] mt-0.5">{m.subject}</p>
                  <p className="text-xs text-[#1E4B57]/80 line-clamp-1 mt-1 leading-relaxed">
                    {m.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                <span className="text-[11px] text-[#7FA69C] font-medium">{m.date}</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMessage(m.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="حذف پیام"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="p-12 text-center text-[#7FA69C] text-xs font-medium">
              پیامی با فیلتر انتخابی یافت نشد.
            </div>
          )}
        </div>
      </div>

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#EDEAE4]/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/70 relative animate-in zoom-in-95 duration-200 text-[#1E4B57]">
            {/* Modal Header */}
            <div className="bg-[#1E4B57] text-[#EDEAE4] p-5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C9A24B]" />
                <h3 className="font-bold text-sm">جزئیات پیام و استعلام</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="text-white/70 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="bg-white/80 p-4 rounded-2xl space-y-2 text-xs border border-white/80">
                <div className="flex justify-between">
                  <span className="text-[#7FA69C] font-medium">نام فرستنده:</span>
                  <span className="font-bold text-[#1E4B57]">{selectedMessage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7FA69C] font-medium">شماره تماس:</span>
                  <a href={`tel:${selectedMessage.phone}`} className="font-mono text-[#346D80] font-bold dir-ltr hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
                {selectedMessage.email && (
                  <div className="flex justify-between">
                    <span className="text-[#7FA69C] font-medium">ایمیل:</span>
                    <span className="font-mono text-[#1E4B57]">{selectedMessage.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#7FA69C] font-medium">زمان ارسال:</span>
                  <span>{selectedMessage.date}</span>
                </div>
                <div className="flex justify-between border-t border-[#1E4B57]/10 pt-2">
                  <span className="text-[#7FA69C] font-medium">موضوع:</span>
                  <span className="font-bold text-[#346D80]">{selectedMessage.subject}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  متن پیام یا استعلام:
                </label>
                <div className="bg-white/90 p-4 rounded-2xl border border-[#7FA69C]/30 text-xs text-[#1E4B57] leading-relaxed whitespace-pre-line shadow-xs">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>پاسخ در واتساپ</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteMessage(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-2xl cursor-pointer"
                  >
                    حذف پیام
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="bg-[#346D80] hover:bg-[#1E4B57] text-[#EDEAE4] text-xs font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};