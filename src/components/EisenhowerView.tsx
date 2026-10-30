import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { EisenhowerQuadrant, Reminder } from '../types/reminder';

interface EisenhowerViewProps {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onSelectQuadrant?: (q: EisenhowerQuadrant) => void;
}

export const EisenhowerView: React.FC<EisenhowerViewProps> = ({
  reminders,
  onToggle,
}) => {
  const activeReminders = reminders.filter((r) => !r.isCompleted);

  const q1 = activeReminders.filter((r) => r.quadrant === 'do_first');
  const q2 = activeReminders.filter((r) => r.quadrant === 'schedule');
  const q3 = activeReminders.filter((r) => r.quadrant === 'delegate');
  const q4 = activeReminders.filter((r) => r.quadrant === 'dont_do');

  const renderQuadrantCard = (
    title: string,
    subtitle: string,
    color: string,
    icon: keyof typeof Ionicons.glyphMap,
    items: Reminder[]
  ) => {
    return (
      <View style={[styles.quadrantCard, { borderColor: color + '40' }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.cardTitle, { color }]}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: color + '25' }]}>
            <Text style={[styles.badgeText, { color }]}>{items.length}</Text>
          </View>
        </View>

        <ScrollView style={styles.itemList} nestedScrollEnabled>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>Görev yok</Text>
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.taskRow}
                onPress={() => onToggle(item.id)}
              >
                <Ionicons name="ellipse-outline" size={14} color={color} />
                <Text style={styles.taskText} numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>
        Eisenhower Öncelik Matrisi ile anımsatıcılarını önem ve aciliyet derecesine göre yönet:
      </Text>

      <View style={styles.grid}>
        {renderQuadrantCard(
          '1. Hemen Yap',
          'Acil & Çok Önemli',
          COLORS.urgent,
          'flash',
          q1
        )}
        {renderQuadrantCard(
          '2. Planla',
          'Önemli & Acil Değil',
          COLORS.primary,
          'calendar',
          q2
        )}
        {renderQuadrantCard(
          '3. Hızlı Bitir',
          'Acil & Önemsiz',
          COLORS.high,
          'people',
          q3
        )}
        {renderQuadrantCard(
          '4. Ele / Ertele',
          'Ne Acil Ne Önemli',
          COLORS.textMuted,
          'file-tray',
          q4
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  introText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quadrantCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    minHeight: 180,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemList: {
    maxHeight: 120,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  taskText: {
    color: COLORS.text,
    fontSize: 12,
    flex: 1,
  },
});
