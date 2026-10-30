import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types/reminder';

const STORAGE_KEY = '@super_reminders_v1';
const STATS_KEY = '@super_reminders_stats';

export interface UserStats {
  streakDays: number;
  lastCompletedDate: string | null;
  totalCompleted: number;
}

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'demo-1',
    title: 'Yeni iOS uygulamasını test et & deneyimle',
    notes: 'Doğal dil ayrıştırma ve Eisenhower matrisini dene!',
    dueDate: new Date().toISOString(),
    dueTime: '18:00',
    priority: 'urgent',
    quadrant: 'do_first',
    category: 'İş',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Haftalık hedefleri ve bütçeyi gözden geçir',
    notes: 'Öncelikli planlama',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    dueTime: '10:00',
    priority: 'high',
    quadrant: 'schedule',
    category: 'Finans',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Akşam 45 dakika yürüyüş / spor',
    dueDate: new Date().toISOString(),
    dueTime: '20:00',
    priority: 'medium',
    quadrant: 'schedule',
    category: 'Sağlık',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export async function loadReminders(): Promise<Reminder[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REMINDERS));
      return INITIAL_REMINDERS;
    }
    return JSON.parse(json);
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
  }
}

export async function loadUserStats(): Promise<UserStats> {
  try {
    const json = await AsyncStorage.getItem(STATS_KEY);
    if (!json) {
      return { streakDays: 3, lastCompletedDate: null, totalCompleted: 14 };
    }
    return JSON.parse(json);
  } catch (error) {
    return { streakDays: 1, lastCompletedDate: null, totalCompleted: 0 };
  }
}

export async function recordCompletion(): Promise<UserStats> {
  const stats = await loadUserStats();
  const today = new Date().toISOString().split('T')[0];

  let streak = stats.streakDays;
  if (stats.lastCompletedDate !== today) {
    // Check if yesterday was completed
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (stats.lastCompletedDate === yesterday) {
      streak += 1;
    } else if (!stats.lastCompletedDate) {
      streak = 1;
    }
  }

  const newStats: UserStats = {
    streakDays: streak,
    lastCompletedDate: today,
    totalCompleted: stats.totalCompleted + 1,
  };

  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  return newStats;
}
