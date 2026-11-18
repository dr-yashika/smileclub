import type { Lang } from './i18n';

// Read-aloud with the phone's own voice. Phase 2: swap for recorded Hindi/English audio files.
export function speak(text: string, lang: Lang, onEnd?: () => void): boolean {
  try {
    const ss = window.speechSynthesis;
    if (!ss || !text) return false;
    ss.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    const voices = ss.getVoices();
    const v = voices.find(x => x.lang === u.lang) || voices.find(x => x.lang?.toLowerCase().startsWith(lang));
    if (v) u.voice = v;
    u.rate = 0.9;
    u.pitch = 1.1;
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
    ss.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
}
