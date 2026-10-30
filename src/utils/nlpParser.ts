import { Category, EisenhowerQuadrant, Priority } from '../types/reminder';

export interface ParsedReminderInfo {
  cleanTitle: string;
  dueDate?: Date;
  dueTimeString?: string;
  priority: Priority;
  quadrant: EisenhowerQuadrant;
  category: Category;
  detectedTokens: string[];
}

export function parseNaturalLanguage(input: string): ParsedReminderInfo {
  let title = input.trim();
  const detectedTokens: string[] = [];
  const now = new Date();

  let targetDate: Date | undefined;
  let targetTime: string | undefined;
  let priority: Priority = 'medium';
  let category: Category = 'Genel';

  // 1. Hashtags for category
  if (/#(is|iş)/i.test(title)) {
    category = 'İş';
    detectedTokens.push('#İş');
    title = title.replace(/#(is|iş)/gi, '');
  } else if (/#(kisisel|kişisel)/i.test(title)) {
    category = 'Kişisel';
    detectedTokens.push('#Kişisel');
    title = title.replace(/#(kisisel|kişisel)/gi, '');
  } else if (/#(saglik|sağlık)/i.test(title)) {
    category = 'Sağlık';
    detectedTokens.push('#Sağlık');
    title = title.replace(/#(saglik|sağlık)/gi, '');
  } else if (/#(finans|para)/i.test(title)) {
    category = 'Finans';
    detectedTokens.push('#Finans');
    title = title.replace(/#(finans|para)/gi, '');
  } else if (/#(egitim|eğitim|ders)/i.test(title)) {
    category = 'Eğitim';
    detectedTokens.push('#Eğitim');
    title = title.replace(/#(egitim|eğitim|ders)/gi, '');
  }

  // 2. Priority detection
  if (/(!acil|!urgent|!kritik|çorba gibi acil)/i.test(title)) {
    priority = 'urgent';
    detectedTokens.push('Acil');
    title = title.replace(/(!acil|!urgent|!kritik)/gi, '');
  } else if (/(!yuksek|!yüksek|!high|çok önemli)/i.test(title)) {
    priority = 'high';
    detectedTokens.push('Yüksek Öncelik');
    title = title.replace(/(!yuksek|!yüksek|!high)/gi, '');
  } else if (/(!dusuk|!düşük|!low)/i.test(title)) {
    priority = 'low';
    detectedTokens.push('Düşük Öncelik');
    title = title.replace(/(!dusuk|!düşük|!low)/gi, '');
  }

  // 3. Relative minutes / hours: "30 dk sonra", "1 saat sonra"
  const relMinutesMatch = title.match(/(\d+)\s*(dk|dakika|min)\s*sonra/i);
  if (relMinutesMatch) {
    const mins = parseInt(relMinutesMatch[1], 10);
    const d = new Date(now.getTime() + mins * 60000);
    targetDate = d;
    targetTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    detectedTokens.push(`${mins} dk sonra`);
    title = title.replace(relMinutesMatch[0], '');
  }

  const relHoursMatch = title.match(/(\d+)\s*(saat|hr)\s*sonra/i);
  if (relHoursMatch && !relMinutesMatch) {
    const hrs = parseInt(relHoursMatch[1], 10);
    const d = new Date(now.getTime() + hrs * 3600000);
    targetDate = d;
    targetTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    detectedTokens.push(`${hrs} saat sonra`);
    title = title.replace(relHoursMatch[0], '');
  }

  // 4. Day detection: Bugün, Yarın, vb.
  if (!targetDate) {
    if (/\b(yarin|yarın|tomorrow)\b/i.test(title)) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      targetDate = tomorrow;
      detectedTokens.push('Yarın');
      title = title.replace(/\b(yarin|yarın|tomorrow)\b/gi, '');
    } else if (/\b(bugun|bugün|today)\b/i.test(title)) {
      targetDate = new Date(now);
      detectedTokens.push('Bugün');
      title = title.replace(/\b(bugun|bugün|today)\b/gi, '');
    }
  }

  // 5. Explicit time: "saat 15:30", "14:00", "20.45"
  const timeRegex = /(saat\s*)?([01]?\d|2[0-3])[:.]([0-5]\d)/i;
  const timeMatch = title.match(timeRegex);
  if (timeMatch) {
    const hours = String(timeMatch[2]).padStart(2, '0');
    const minutes = String(timeMatch[3]).padStart(2, '0');
    targetTime = `${hours}:${minutes}`;
    if (!targetDate) {
      targetDate = new Date(now);
    }
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    detectedTokens.push(`Saat ${targetTime}`);
    title = title.replace(timeMatch[0], '');
  }

  // Part of day presets if time is not explicit
  if (!targetTime) {
    if (/\b(aksam|akşam)\b/i.test(title)) {
      targetTime = '20:00';
      if (!targetDate) targetDate = new Date(now);
      targetDate.setHours(20, 0, 0, 0);
      detectedTokens.push('Akşam (20:00)');
      title = title.replace(/\b(aksam|akşam)\b/gi, '');
    } else if (/\b(sabah)\b/i.test(title)) {
      targetTime = '09:00';
      if (!targetDate) {
        targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + 1); // Sabah dediyse ertesi sabah
      }
      targetDate.setHours(9, 0, 0, 0);
      detectedTokens.push('Sabah (09:00)');
      title = title.replace(/\b(sabah)\b/gi, '');
    } else if (/\b(ogle|öğle|oglen|öğlen)\b/i.test(title)) {
      targetTime = '12:30';
      if (!targetDate) targetDate = new Date(now);
      targetDate.setHours(12, 30, 0, 0);
      detectedTokens.push('Öğle (12:30)');
      title = title.replace(/\b(ogle|öğle|oglen|öğlen)\b/gi, '');
    }
  }

  // 6. Calculate Eisenhower Quadrant automatically
  let quadrant: EisenhowerQuadrant = 'schedule';
  if (priority === 'urgent') {
    quadrant = 'do_first';
  } else if (priority === 'high') {
    quadrant = 'schedule';
  } else if (priority === 'medium') {
    quadrant = 'delegate';
  } else {
    quadrant = 'dont_do';
  }

  // Clean trailing punctuations, multiple spaces
  const cleanTitle = title
    .replace(/[,;:@]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    cleanTitle: cleanTitle || input.trim(),
    dueDate: targetDate,
    dueTimeString: targetTime,
    priority,
    quadrant,
    category,
    detectedTokens,
  };
}
