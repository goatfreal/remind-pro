export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type EisenhowerQuadrant = 'do_first' | 'schedule' | 'delegate' | 'dont_do';

export type Category = 'Genel' | 'İş' | 'Kişisel' | 'Sağlık' | 'Finans' | 'Eğitim';

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string; // ISO string
  dueTime?: string; // HH:mm format
  priority: Priority;
  quadrant: EisenhowerQuadrant;
  category: Category;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  snoozedCount?: number;
}

export type ViewFilter = 'today' | 'upcoming' | 'all' | 'matrix' | 'completed';
