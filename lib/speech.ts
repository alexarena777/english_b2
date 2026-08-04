function getVoiceScore(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (/siri/i.test(name)) score += 100;
  if (/serena/i.test(name)) score += 90;
  if (/samantha/i.test(name)) score += 85;
  if (/arthur/i.test(name)) score += 80;
  if (/enhanced|premium|neural|natural|online/i.test(name)) score += 70;
  if (/google/i.test(name)) score += 60;
  if (/apple/i.test(name)) score += 50;
  if (name.includes("daniel")) score += 10;
  if (voice.lang.toLowerCase() === "en-gb" || voice.lang.toLowerCase() === "en-us") score += 5;
  return score;
}

export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );

  return english.sort((a, b) => getVoiceScore(b) - getVoiceScore(a));
}

export function isNaturalVoice(voice?: SpeechSynthesisVoice): boolean {
  if (!voice) return false;
  return /siri|serena|samantha|arthur|enhanced|premium|neural|natural|google|apple|online/i.test(
    voice.name,
  );
}
