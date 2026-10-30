import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { Category, EisenhowerQuadrant, Priority, Reminder } from '../types/reminder';
import { parseNaturalLanguage } from '../utils/nlpParser';

interface AddReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => void;
}

const CATEGORIES: Category[] = ['Genel', 'İş', 'Kişisel', 'Sağlık', 'Finans', 'Eğitim'];

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState('');
  const [overrideCategory, setOverrideCategory] = useState<Category | null>(null);
  const [overridePriority, setOverridePriority] = useState<Priority | null>(null);
  const [overrideQuadrant, setOverrideQuadrant] = useState<EisenhowerQuadrant | null>(null);

  // Live NLP parsing
  const parsed = useMemo(() => parseNaturalLanguage(text), [text]);

  const activeCategory = overrideCategory || parsed.category;
  const activePriority = overridePriority || parsed.priority;
  const activeQuadrant = overrideQuadrant || parsed.quadrant;

  const handleSave = () => {
    if (!text.trim()) return;

    onAdd({
      title: parsed.cleanTitle || text.trim(),
      notes: notes.trim() || undefined,
      dueDate: parsed.dueDate ? parsed.dueDate.toISOString() : undefined,
      dueTime: parsed.dueTimeString,
      priority: activePriority,
      quadrant: activeQuadrant,
      category: activeCategory,
    });

    // Reset state
    setText('');
    setNotes('');
    setOverrideCategory(null);
    setOverridePriority(null);
    setOverrideQuadrant(null);
    onClose();
  };

  const appendTag = (snippet: string) => {
    setText((prev) => (prev ? `${prev.trim()} ${snippet}` : snippet));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {/* Modal Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Yeni Akıllı Anımsatıcı</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Smart Input Field */}
            <TextInput
              style={styles.input}
              placeholder="Örn: Yarın 14:30'da proje toplantısı #iş !acil"
              placeholderTextColor={COLORS.textMuted}
              value={text}
              onChangeText={setText}
              autoFocus
              multiline
            />

            {/* Live NLP Extraction Pill Badges */}
            {parsed.detectedTokens.length > 0 && (
              <View style={styles.detectedContainer}>
                <Text style={styles.detectedLabel}>Yapay Zeka Tarafından Algılandı:</Text>
                <View style={styles.tokenRow}>
                  {parsed.detectedTokens.map((token, idx) => (
                    <View key={idx} style={styles.tokenBadge}>
                      <Ionicons name="sparkles" size={12} color="#0A84FF" />
                      <Text style={styles.tokenText}>{token}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Quick Helper Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              <TouchableOpacity style={styles.chip} onPress={() => appendTag('bugün saat 18:00')}>
                <Text style={styles.chipText}>+ Bugün 18:00</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => appendTag('yarın sabah 09:00')}>
                <Text style={styles.chipText}>+ Yarın 09:00</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => appendTag('30 dk sonra')}>
                <Text style={styles.chipText}>+ 30 dk sonra</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => appendTag('!acil')}>
                <Text style={styles.chipText}>+ !acil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chip} onPress={() => appendTag('#iş')}>
                <Text style={styles.chipText}>+ #iş</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Notes input */}
            <TextInput
              style={styles.notesInput}
              placeholder="Ek not veya açıklama (isteğe bağlı)..."
              placeholderTextColor={COLORS.textMuted}
              value={notes}
              onChangeText={setNotes}
            />

            {/* Category Selector */}
            <Text style={styles.sectionLabel}>Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    activeCategory === cat && styles.categoryBtnActive,
                  ]}
                  onPress={() => setOverrideCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      activeCategory === cat && styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!text.trim()}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Anımsatıcıyı Ekle</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderTopWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 16,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
    minHeight: 60,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    textAlignVertical: 'top',
  },
  detectedContainer: {
    backgroundColor: '#0F2033',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#184670',
  },
  detectedLabel: {
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tokenText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  chipsRow: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 13,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryBtn: {
    backgroundColor: COLORS.cardSecondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
