import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { checkServer, isValidWhatsAppNumber } from '../../services/whatsapp';
import { MessageCircle, Server, Hand, PlugZap, RefreshCw, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

const inputCls =
  'w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none';

export default function WhatsAppSettings() {
  const { whatsappConfig, updateWhatsappConfig, triggerSendMessage, serverSync, syncNow, showToast } = useGym();
  const [health, setHealth] = useState(null); // { ok, info, error }
  const [checking, setChecking] = useState(false);

  const cfg = whatsappConfig;
  const testNumberValid = isValidWhatsAppNumber(cfg.testNumber);

  const runCheck = async () => {
    setChecking(true);
    try {
      const info = await checkServer(cfg);
      setHealth({ ok: true, info });
    } catch (err) {
      setHealth({ ok: false, error: err.message });
    } finally {
      setChecking(false);
    }
  };

  const sendTest = () => {
    if (!testNumberValid) {
      showToast('Enter your own WhatsApp number first (with country code, e.g. +91 98xxxxxxxx).', 'warning');
      return;
    }
    triggerSendMessage({
      recipientId: 'TEST',
      recipientName: 'Test (you)',
      recipientPhone: cfg.testNumber,
      text: 'This is a test message from SHIVAY GYM. WhatsApp notifications are working!',
      automationTitle: 'WhatsApp Test Message',
      automationId: 'TEST',
      channel: 'WhatsApp'
    });
  };

  const ModeCard = ({ value, icon: Icon, title, text }) => {
    const active = cfg.mode === value;
    return (
      <button
        type="button"
        onClick={() => updateWhatsappConfig({ mode: value })}
        className={`text-left p-4 rounded-lg border transition-colors ${
          active ? 'border-[#2F9E44] bg-[#142918]' : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#3A3A3A]'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-4 h-4 ${active ? 'text-[#2F9E44]' : 'text-[#9A9A9A]'}`} />
          <span className="text-sm font-semibold text-[#F2F2F2]">{title}</span>
          {active && <span className="ml-auto text-[10px] uppercase font-bold text-[#2F9E44]">Selected</span>}
        </div>
        <p className="text-[11px] text-[#9A9A9A] leading-relaxed">{text}</p>
      </button>
    );
  };

  return (
    <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] space-y-5">
      <div>
        <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#2F9E44]" />
          WhatsApp Delivery
        </h2>
        <p className="text-xs text-[#9A9A9A] mt-1">
          Choose how reminders, offers, good morning messages and festival wishes reach members on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ModeCard
          value="manual"
          icon={Hand}
          title="Manual (no setup)"
          text="Each message opens WhatsApp with the member's number and text ready — you press Send. Works today on phone, WhatsApp Desktop or WhatsApp Web."
        />
        <ModeCard
          value="server"
          icon={Server}
          title="Automatic (WhatsApp Business API)"
          text="Messages are sent automatically by the Shivay notification server using Meta's official WhatsApp Cloud API. Scheduled automations run even when this app is closed."
        />
      </div>

      {/* Test mode */}
      <div className="p-4 rounded-lg border border-[#E8A317]/40 bg-[#292211]/60 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#E8A317] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#F2F2F2]">Test mode {cfg.testMode ? 'ON' : 'OFF'}</p>
              <p className="text-[11px] text-[#9A9A9A] leading-relaxed">
                While ON, every WhatsApp message goes to your own number instead of the member. Keep it ON until
                real member numbers are entered — the demo members have made-up numbers.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={cfg.testMode}
            onClick={() => updateWhatsappConfig({ testMode: !cfg.testMode })}
            className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors ${cfg.testMode ? 'bg-[#E8A317]' : 'bg-[#3A3A3A]'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${cfg.testMode ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Your WhatsApp number (test number)</label>
            <input
              type="tel"
              value={cfg.testNumber}
              onChange={(e) => updateWhatsappConfig({ testNumber: e.target.value })}
              placeholder="+91 98XXXXXXXX"
              className={`${inputCls} font-mono`}
            />
          </div>
          <button
            type="button"
            onClick={sendTest}
            className="px-4 py-2 rounded bg-[#2F9E44] hover:bg-[#278A3A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
          >
            Send test message
          </button>
        </div>
        {cfg.testNumber && !testNumberValid && (
          <p className="text-[11px] text-[#E03131]">Enter a full number with country code, e.g. +91 98101 23451.</p>
        )}
      </div>

      {cfg.mode === 'server' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Notification server URL</label>
              <input
                type="url"
                value={cfg.serverUrl}
                onChange={(e) => updateWhatsappConfig({ serverUrl: e.target.value })}
                placeholder="http://localhost:8787"
                className={`${inputCls} font-mono`}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Server API key (ADMIN_API_KEY)</label>
              <input
                type="password"
                value={cfg.apiKey}
                onChange={(e) => updateWhatsappConfig({ apiKey: e.target.value })}
                placeholder="same value as in server/.env"
                className={`${inputCls} font-mono`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runCheck}
              disabled={checking}
              className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#3A3A3A] text-xs text-[#F2F2F2]"
            >
              <PlugZap className="w-3.5 h-3.5" />
              {checking ? 'Checking...' : 'Test connection'}
            </button>
            <button
              type="button"
              onClick={syncNow}
              className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#3A3A3A] text-xs text-[#F2F2F2]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${serverSync.state === 'syncing' ? 'animate-spin' : ''}`} />
              Sync members to server
            </button>
            <span className="text-[11px] text-[#9A9A9A]">
              {serverSync.state === 'ok' && `Last synced ${serverSync.at}`}
              {serverSync.state === 'error' && <span className="text-[#E03131]">Sync failed: {serverSync.error}</span>}
            </span>
          </div>

          {health && (
            <div
              className={`p-3 rounded border text-xs flex items-start gap-2 ${
                health.ok ? 'border-[#2F9E44]/40 bg-[#142918]' : 'border-[#E03131]/40 bg-[#2A1414]'
              }`}
            >
              {health.ok ? <CheckCircle2 className="w-4 h-4 text-[#2F9E44] flex-shrink-0" /> : <XCircle className="w-4 h-4 text-[#E03131] flex-shrink-0" />}
              {health.ok ? (
                <div className="space-y-0.5 text-[#CCCCCC]">
                  <p className="font-semibold text-[#F2F2F2]">Server connected</p>
                  <p>WhatsApp API: {health.info.whatsappConfigured ? 'configured' : 'not configured — running in DRY RUN (messages are logged, not sent)'}</p>
                  <p>Scheduler: {health.info.schedulerEnabled ? `running (timezone ${health.info.timezone})` : 'off'}</p>
                  <p>Members on server: {health.info.members ?? 0}</p>
                </div>
              ) : (
                <div className="text-[#CCCCCC]">
                  <p className="font-semibold text-[#F2F2F2]">Could not connect</p>
                  <p>{health.error}. Start it with <code className="text-[#E8590C]">cd server &amp;&amp; node index.js</code>.</p>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-[#666666] leading-relaxed">
            WhatsApp only allows a business to start a conversation with an approved message template. Approve one
            template per automation in Meta WhatsApp Manager and map it in <code>server/templates.json</code>. See
            server/README.md for the step-by-step setup.
          </p>
        </div>
      )}
    </div>
  );
}
