import React from 'react';
import { useGym } from '../../context/GymContext';
import Modal from './Modal';
import { buildWhatsAppLink } from '../../services/whatsapp';
import { Send, SkipForward, CheckCircle2, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Manual WhatsApp delivery queue.
 * Browsers block opening dozens of tabs at once, so bulk messages are sent
 * one at a time: each click opens WhatsApp with the text ready, the owner
 * presses Send there, and the queue moves to the next member.
 */
export default function WhatsAppQueue() {
  const { waQueue, markQueueItemSent, skipQueueItem, closeQueue, whatsappConfig } = useGym();
  if (!waQueue) return null;

  const { items, index, done, title } = waQueue;
  const finished = index >= items.length;
  const current = items[index];
  const progress = Math.round((Math.min(index, items.length) / items.length) * 100);

  const openCurrent = () => {
    if (!current) return;
    window.open(buildWhatsAppLink(current.to, current.text), '_blank');
    markQueueItemSent(current.msgId);
  };

  return (
    <Modal
      isOpen
      onClose={closeQueue}
      title="Send on WhatsApp"
      subtitle={`${title} · ${items.length} recipient${items.length > 1 ? 's' : ''}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs">
        <div>
          <div className="flex items-center justify-between text-[#9A9A9A] mb-1.5">
            <span>{finished ? 'All done' : `Message ${index + 1} of ${items.length}`}</span>
            <span className="font-mono">{done.length} opened</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#242424] overflow-hidden">
            <div className="h-full bg-[#2F9E44] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {whatsappConfig.testMode && whatsappConfig.testNumber && (
          <p className="px-3 py-2 rounded border border-[#E8A317]/40 bg-[#292211] text-[#E8A317]">
            Test mode is on — every message opens for your test number {whatsappConfig.testNumber}.
          </p>
        )}

        {!finished && current ? (
          <>
            <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#121212] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#F2F2F2] text-sm">{current.recipientName}</span>
                <span className="font-mono text-[#9A9A9A]">{current.to || 'No number'}</span>
              </div>
              <p className="text-[#CCCCCC] leading-relaxed whitespace-pre-line">{current.text}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={openCurrent}
                disabled={!current.to}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#2F9E44] hover:bg-[#278A3A] disabled:opacity-40 text-white font-semibold uppercase tracking-wider transition-colors"
              >
                <Send className="w-4 h-4" />
                Open in WhatsApp
              </button>
              <button
                type="button"
                onClick={skipQueueItem}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A] hover:text-[#F2F2F2] transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </button>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed">
              WhatsApp opens with the message typed. Press Send there, come back to this tab, and click again for the next member.
            </p>
          </>
        ) : (
          <div className="p-5 rounded-lg border border-[#2F9E44]/40 bg-[#142918] text-center space-y-1">
            <CheckCircle2 className="w-7 h-7 text-[#2F9E44] mx-auto" />
            <p className="font-semibold text-[#F2F2F2] text-sm">Queue finished</p>
            <p className="text-[#9A9A9A]">{done.length} of {items.length} messages opened in WhatsApp.</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
          <Link
            to="/admin/settings"
            onClick={closeQueue}
            className="inline-flex items-center gap-1 text-[#9A9A9A] hover:text-[#F2F2F2]"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Send automatically instead
          </Link>
          <button
            type="button"
            onClick={closeQueue}
            className="px-4 py-2 rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#F2F2F2] hover:border-[#3A3A3A]"
          >
            {finished ? 'Close' : 'Stop'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
