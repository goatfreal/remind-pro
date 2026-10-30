import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './src/components/Header';
import { ReminderItem } from './src/components/ReminderItem';
import { AddReminderModal } from './src/components/AddReminderModal';
import { SnoozeModal } from './src/components/SnoozeModal';
import { EisenhowerView } from './src/components/EisenhowerView';
import { HonestyModal } from './src/components/HonestyModal';
import { LockdownBanner } from './src/components/LockdownBanner';
import { COLORS } from './src/theme/colors';
import { Reminder, ViewFilter } from './src/types/reminder';
import {
  loadReminders,
  loadUserStats,
  recordCompletion,
  saveReminders,
  UserStats,
} from './src/storage/reminderStorage';

export default function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<UserStats>({
    streakDays: 3,
    lastCompletedDate: null,
    totalCompleted: 14,
  });
  const [currentFilter, setCurrentFilter] = useState<ViewFilter>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [snoozeTarget, setSnoozeTarget] = useState<Reminder | null>(null);
  const [honestyTarget, setHonestyTarget] = useState<Reminder | null>(null);

  // Load persisted reminders and stats on startup
  useEffect(() => {
    async function init() {
      const stored = await loadReminders();
      setReminders(stored);
      const userStats = await loadUserStats();
      setStats(userStats);
    }
    init();
  }, []);

  // Update storage on reminders changes
  const updateReminders = (updated: Reminder[]) => {
    setReminders(updated);
    saveReminders(updated);
  };

  // Checkbox tapped -> trigger Honesty Check if completing
  const handleToggle = (id: string) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    if (!target.isCompleted) {
      // Trying to complete: Must pass honesty countdown check!
      setHonestyTarget(target);
    } else {
      // Uncompleting: Direct toggle
      const updated = reminders.map((r) =>
        r.id === id ? { ...r, isCompleted: false, completedAt: undefined } : r
      );
      updateReminders(updated);
    }
  };

  // Confirmed completion after 7-second countdown
  const handleConfirmCompletion = async (id: string) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    updateReminders(updated);
    const newStats = await recordCompletion();
    setStats(newStats);
    setHonestyTarget(null);
  };

  // Delete
  const handleDelete = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    updateReminders(updated);
  };

  // Snooze
  const handleApplySnooze = (reminderId: string, newDueDate: Date, newDueTime: string) => {
    const updated = reminders.map((r) => {
      if (r.id === reminderId) {
        return {
          ...r,
          dueDate: newDueDate.toISOString(),
          dueTime: newDueTime,
          snoozedCount: (r.snoozedCount || 0) + 1,
        };
      }
      return r;
    });
    updateReminders(updated);
  };

  // Add new
  const handleAddReminder = (newReminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    const created: Reminder = {
      ...newReminder,
      id: Date.now().toString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    updateReminders([created, ...reminders]);
  };

  // Counts for header
  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return reminders.filter((r) => {
      if (r.isCompleted) return false;
      if (!r.dueDate) return false;
      return new Date(r.dueDate).toDateString() === today;
    }).length;
  }, [reminders]);

  const activeCount = useMemo(() => {
    return reminders.filter((r) => !r.isCompleted).length;
  }, [reminders]);

  // Overdue count for Tavizsiz Kilit Modu (No extra time)
  const overdueCount = useMemo(() => {
    return reminders.filter((r) => {
      if (r.isCompleted || !r.dueDate) return false;
      const due = new Date(r.dueDate);
      if (r.dueTime) {
        const [h, m] = r.dueTime.split(':').map(Number);
        if (!isNaN(h) && !isNaN(m)) due.setHours(h, m, 0, 0);
      }
      return due < new Date();
    }).length;
  }, [reminders]);

  // Filtered Reminders List
  const filteredReminders = useMemo(() => {
    const todayStr = new Date().toDateString();

    return reminders
      .filter((r) => {
        // Search filter
        if (searchQuery.trim()) {
          const matchTitle = r.title.toLowerCase().includes(searchQuery.toLowerCase());
          const matchCategory = r.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchNotes = r.notes?.toLowerCase().includes(searchQuery.toLowerCase());
          if (!matchTitle && !matchCategory && !matchNotes) return false;
        }

        // View Tabs
        if (currentFilter === 'today') {
          if (r.isCompleted) return false;
          if (!r.dueDate) return true;
          return new Date(r.dueDate).toDateString() === todayStr;
        }
        if (currentFilter === 'upcoming') {
          if (r.isCompleted) return false;
          if (!r.dueDate) return false;
          return new Date(r.dueDate) > new Date();
        }
        if (currentFilter === 'completed') {
          return r.isCompleted;
        }
        if (currentFilter === 'all') {
          return true;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        const priorityScore: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      });
  }, [reminders, currentFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.container}>
        {/* Header with Stats & Filter Tabs */}
        <Header
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          streakDays={stats.streakDays}
          totalActiveCount={activeCount}
          todayCount={todayCount}
        />

        {/* Tavizsiz Mod & Overdue Lock Banner */}
        <LockdownBanner overdueCount={overdueCount} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Anımsatıcı veya etiket ara..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Content Body: Eisenhower Matrix or List View */}
        {currentFilter === 'matrix' ? (
          <EisenhowerView reminders={reminders} onToggle={handleToggle} />
        ) : (
          <FlatList
            data={filteredReminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReminderItem
                reminder={item}
                onToggle={handleToggle}
                onSnooze={setSnoozeTarget}
                onDelete={handleDelete}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-done-circle-outline" size={54} color={COLORS.cardBorder} />
                <Text style={styles.emptyTitle}>Her şey tertemiz!</Text>
                <Text style={styles.emptySubtitle}>
                  Bu görünümde bekleyen anımsatıcı bulunmuyor.
                </Text>
              </View>
            }
          />
        )}

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsAddModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add Modal */}
        <AddReminderModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAdd={handleAddReminder}
        />

        {/* Snooze Modal */}
        <SnoozeModal
          visible={!!snoozeTarget}
          reminder={snoozeTarget}
          onClose={() => setSnoozeTarget(null)}
          onApplySnooze={handleApplySnooze}
        />

        {/* Honesty Check Modal ("Kendine Karşı Dürüst Ol!") */}
        <HonestyModal
          visible={!!honestyTarget}
          reminder={honestyTarget}
          onConfirm={handleConfirmCompletion}
          onCancel={() => setHonestyTarget(null)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
});
