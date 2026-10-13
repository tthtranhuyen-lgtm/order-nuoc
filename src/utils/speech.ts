/**
 * Speech synthesis utility for Chinese pronunciation practice
 */

let voices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const available = window.speechSynthesis.getVoices();
    if (available.length > 0) {
      voices = available;
      voicesLoaded = true;
      resolve(available);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(voices);
    };

    // Fallback if onvoiceschanged doesn't fire immediately
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    }, 300);
  });
}

// Preload voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

export function getChineseVoice(): SpeechSynthesisVoice | null {
  if (voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    voices = window.speechSynthesis.getVoices();
  }

  // Prioritize Mandarin Chinese voices
  const zhVoices = voices.filter(
    (v) => v.lang.startsWith('zh') || v.lang.includes('cmn') || v.lang === 'zh-CN' || v.lang === 'zh-TW'
  );

  if (zhVoices.length === 0) return null;

  // Prefer zh-CN
  const cnVoice = zhVoices.find((v) => v.lang === 'zh-CN');
  if (cnVoice) return cnVoice;

  return zhVoices[0];
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakChinese(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    stopSpeaking();

    // Small timeout to ensure cancel finishes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate; // 0.8 - 0.9 is great for learners
      utterance.pitch = 1.0;

      const voice = getChineseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        resolve();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
        resolve();
      }
    }, 50);
  });
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
