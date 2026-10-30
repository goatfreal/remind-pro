import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { ViewFilter } from '../types/reminder';

interface HeaderProps {
  currentFilter: ViewFilter;
  onFilterChange: (filter: ViewFilter) => void;
  streakDays: number;
  totalActiveCount: number;
  todayCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentFilter,
  onFilterChange,
  streakDays,
  totalActiveCount,
  todayCount,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar: Title & Streak & Counts */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.appTitle}>RemindPro</Text>
          <Text style={styles.subtitle}>
            {todayCount > 0 ? `Bugün ${todayCount} anımsatıcı var` : 'Bugünlük tüm görevler hazır'}
          </Text>
        </View>

        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={18} color="#FF9F0A" />
          <Text style={styles.streakText}>{streakDays} Gün Seri</Text>
        </View>
      </View>

      {/* Modern Filter Pill Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabPill, currentFilter === 'today' && styles.tabPillActive]}
          onPress={() => onFilterChange('today')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="sunny-outline"
            size={14}
            color={currentFilter === 'today' ? '#FFF' : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, currentFilter === 'today' && styles.tabTextActive]}>
            Bugün ({todayCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, currentFilter === 'upcoming' && styles.tabPillActive]}
          onPress={() => onFilterChange('upcoming')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar-outline"
            size={14}
            color={currentFilter === 'upcoming' ? '#FFF' : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, currentFilter === 'upcoming' && styles.tabTextActive]}>
            Planlanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, currentFilter === 'matrix' && styles.tabPillActive]}
          onPress={() => onFilterChange('matrix')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid-outline"
            size={14}
            color={currentFilter === 'matrix' ? '#FFF' : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, currentFilter === 'matrix' && styles.tabTextActive]}>
            Eisenhower Matrisi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, currentFilter === 'all' && styles.tabPillActive]}
          onPress={() => onFilterChange('all')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="layers-outline"
            size={14}
            color={currentFilter === 'all' ? '#FFF' : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, currentFilter === 'all' && styles.tabTextActive]}>
            Tümü ({totalActiveCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#271F11',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E3612',
    gap: 4,
  },
  streakText: {
    color: '#FFB340',
    fontSize: 13,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  tabPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
