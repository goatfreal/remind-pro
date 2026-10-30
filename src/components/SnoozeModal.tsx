import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { Reminder } from '../types/reminder';

interface SnoozeModalProps {
  visible: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onApplySnooze: (reminderId: string, newDueDate: Date, newDueTime: string) => void;
}

export const SnoozeModal: React.FC<SnoozeModalProps> = ({
  visible,
  reminder,
  onClose,
  onApplySnooze,
}) => {
  if (!reminder) return null;

  const handleSnoozeMinutes = (minutes: number) => {
    const d = new Date(Date.now() + minutes * 60000);
    const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    onApplySnooze(reminder.id, d, timeStr);
    onClose();
  };

  const handleSnoozeTonight = () => {
    const d = new Date();
    d.setHours(20, 0, 0, 0);
    onApplySnooze(reminder.id, d, '20:00');
    onClose();
  };

  const handleSnoozeTomorrowMorning = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    onApplySnooze(reminder.id, d, '09:00');
    onClose();
  };

  const handleSnoozeWeekend = () => {
    const d = new Date();
    const day = d.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + daysUntilSaturday);
    d.setHours(10, 0, 0, 0);
    onApplySnooze(reminder.id, d, '10:00');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="alarm-outline" size={22} color={COLORS.high} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>Akıllı Erteleme</Text>
              <Text style={styles.reminderTitle} numberOfLines={1}>
                "{reminder.title}"
              </Text>
            </View>
          </View>

          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleSnoozeMinutes(15)}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.optionText}>15 Dakika Sonra</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => handleSnoozeMinutes(60)}>
              <Ionicons name="hourglass-outline" size={18} color={COLORS.primary} />
              <Text style={styles.optionText}>1 Saat Sonra</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleSnoozeTonight}>
              <Ionicons name="moon-outline" size={18} color={COLORS.purple} />
              <Text style={styles.optionText}>Bu Akşam (20:00)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleSnoozeTomorrowMorning}>
              <Ionicons name="sunny-outline" size={18} color={COLORS.high} />
              <Text style={styles.optionText}>Yarın Sabah (09:00)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={handleSnoozeWeekend}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.low} />
              <Text style={styles.optionText}>Bu Hafta Sonu (Cumartesi 10:00)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#302210',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  reminderTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  optionsList: {
    gap: 10,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 12,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
