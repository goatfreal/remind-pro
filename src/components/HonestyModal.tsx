import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { Reminder } from '../types/reminder';

interface HonestyModalProps {
  visible: boolean;
  reminder: Reminder | null;
  onConfirm: (reminderId: string) => void;
  onCancel: () => void;
}

const COUNTDOWN_SECONDS = 7;

export const HonestyModal: React.FC<HonestyModalProps> = ({
  visible,
  reminder,
  onConfirm,
  onCancel,
}) => {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!visible) {
      setTimeLeft(COUNTDOWN_SECONDS);
      return;
    }

    setTimeLeft(COUNTDOWN_SECONDS);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!reminder) return null;

  const isReady = timeLeft === 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Warning Icon Badge */}
          <View style={styles.iconCircle}>
            <Ionicons name="eye-outline" size={36} color="#FF453A" />
          </View>

          {/* Psychological Honesty Header */}
          <Text style={styles.mainTitle}>Kendine Karşı Dürüst Ol!</Text>
          <Text style={styles.subtitle}>
            Bu görevi gerçekten hakkıyla ve eksiksiz bitirdin mi, yoksa sadece vicdanını rahatlatmak için mi basıyorsun?
          </Text>

          {/* Task Preview Card */}
          <View style={styles.taskPreview}>
            <Ionicons name="checkbox-outline" size={18} color={COLORS.primary} />
            <Text style={styles.taskTitle} numberOfLines={2}>
              "{reminder.title}"
            </Text>
          </View>

          {/* Countdown Display */}
          <View style={styles.timerContainer}>
            {!isReady ? (
              <>
                <Text style={styles.timerNumber}>{timeLeft}</Text>
                <Text style={styles.timerLabel}>Saniye Düşün & Karar Ver</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={40} color={COLORS.low} />
                <Text style={[styles.timerLabel, { color: COLORS.low, fontWeight: '700' }]}>
                  Kararın kesinse onayla
                </Text>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.confirmBtn, !isReady && styles.confirmBtnDisabled]}
              disabled={!isReady}
              onPress={() => onConfirm(reminder.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>
                {isReady ? 'Evet, Gerçekten Bitirdim' : `Düşünüyorsun (${timeLeft}s)`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Hayır, henüz bitmedi (Geri Dön)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#16161C',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#381C1D',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#301315',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#601F22',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF453A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  taskPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  taskTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    minHeight: 70,
  },
  timerNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FF9F0A',
  },
  timerLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: COLORS.low,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#2A2A35',
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#22222B',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
