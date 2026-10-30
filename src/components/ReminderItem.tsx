import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { Priority, Reminder } from '../types/reminder';

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onSnooze: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'urgent':
      return COLORS.urgent;
    case 'high':
      return COLORS.high;
    case 'medium':
      return COLORS.medium;
    case 'low':
      return COLORS.low;
  }
};

const getCategoryColor = (cat: string): string => {
  switch (cat) {
    case 'İş':
      return COLORS.primary;
    case 'Kişisel':
      return COLORS.purple;
    case 'Sağlık':
      return COLORS.low;
    case 'Finans':
      return COLORS.medium;
    case 'Eğitim':
      return COLORS.teal;
    default:
      return COLORS.textSecondary;
  }
};

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onToggle,
  onSnooze,
  onDelete,
}) => {
  const priorityColor = getPriorityColor(reminder.priority);
  const categoryColor = getCategoryColor(reminder.category);

  // Check if overdue
  const isOverdue = useMemo(() => {
    if (reminder.isCompleted || !reminder.dueDate) return false;
    const due = new Date(reminder.dueDate);
    if (reminder.dueTime) {
      const [h, m] = reminder.dueTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        due.setHours(h, m, 0, 0);
      }
    }
    return due < new Date();
  }, [reminder]);

  // Format date preview
  let dateText = '';
  if (reminder.dueDate) {
    const d = new Date(reminder.dueDate);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();

    if (isToday) {
      dateText = reminder.dueTime ? `Bugün ${reminder.dueTime}` : 'Bugün';
    } else if (isTomorrow) {
      dateText = reminder.dueTime ? `Yarın ${reminder.dueTime}` : 'Yarın';
    } else {
      dateText = `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'short' })} ${reminder.dueTime || ''}`.trim();
    }
  }

  return (
    <View
      style={[
        styles.card,
        reminder.isCompleted && styles.cardCompleted,
        isOverdue && styles.cardOverdue,
      ]}
    >
      {/* Priority accent stripe */}
      <View
        style={[
          styles.priorityStripe,
          { backgroundColor: isOverdue ? '#FF3B30' : priorityColor },
        ]}
      />

      <View style={styles.content}>
        {/* Checkbox & Title Row */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              reminder.isCompleted && styles.checkboxChecked,
              isOverdue && !reminder.isCompleted && styles.checkboxOverdue,
            ]}
            onPress={() => onToggle(reminder.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {reminder.isCompleted && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                reminder.isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {reminder.title}
            </Text>

            {reminder.notes ? (
              <Text style={styles.notes} numberOfLines={1}>
                {reminder.notes}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Badges and Actions Row */}
        <View style={styles.footerRow}>
          <View style={styles.badgeContainer}>
            {/* Category */}
            <View style={[styles.tag, { borderColor: categoryColor + '55', backgroundColor: categoryColor + '15' }]}>
              <Text style={[styles.tagText, { color: categoryColor }]}>{reminder.category}</Text>
            </View>

            {/* Overdue Badge */}
            {isOverdue && (
              <View style={styles.overdueBadge}>
                <Ionicons name="lock-closed" size={11} color="#FF453A" />
                <Text style={styles.overdueBadgeText}>EK SÜRE YOK</Text>
              </View>
            )}

            {/* Due Time */}
            {dateText ? (
              <View style={[styles.dateBadge, isOverdue && styles.dateBadgeOverdue]}>
                <Ionicons
                  name={isOverdue ? 'alert-circle' : 'time-outline'}
                  size={12}
                  color={isOverdue ? '#FF453A' : COLORS.teal}
                />
                <Text style={[styles.dateBadgeText, isOverdue && { color: '#FF453A' }]}>
                  {dateText}
                </Text>
              </View>
            ) : null}

            {/* Snooze counter if any */}
            {(reminder.snoozedCount || 0) > 0 && (
              <View style={styles.snoozeBadge}>
                <Ionicons name="refresh" size={11} color="#FF9F0A" />
                <Text style={styles.snoozeBadgeText}>{reminder.snoozedCount}x</Text>
              </View>
            )}
          </View>

          {/* Quick Actions: Snooze & Delete */}
          <View style={styles.actionsContainer}>
            {!reminder.isCompleted && !isOverdue && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => onSnooze(reminder)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="alarm-outline" size={18} color={COLORS.high} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onDelete(reminder.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={17} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardCompleted: {
    opacity: 0.55,
    backgroundColor: '#121216',
  },
  cardOverdue: {
    borderColor: '#FF3B3088',
    backgroundColor: '#1C1012',
  },
  priorityStripe: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.low,
    borderColor: COLORS.low,
  },
  checkboxOverdue: {
    borderColor: '#FF3B30',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 22,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  notes: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder + '66',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#380E10',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#73181C',
  },
  overdueBadgeText: {
    color: '#FF453A',
    fontSize: 10,
    fontWeight: '800',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#102230',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1D4566',
  },
  dateBadgeOverdue: {
    backgroundColor: '#301315',
    borderColor: '#591E21',
  },
  dateBadgeText: {
    fontSize: 11,
    color: COLORS.teal,
    fontWeight: '600',
  },
  snoozeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#33230A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  snoozeBadgeText: {
    fontSize: 10,
    color: '#FFB340',
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 2,
  },
});
