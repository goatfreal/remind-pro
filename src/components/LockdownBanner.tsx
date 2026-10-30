import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LockdownBannerProps {
  overdueCount: number;
}

export const LockdownBanner: React.FC<LockdownBannerProps> = ({ overdueCount }) => {
  if (overdueCount === 0) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={20} color="#FF3B30" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>🚨 TAVİZSİZ MOD AKTİF: {overdueCount} GÖREV GECİKTİ!</Text>
        <Text style={styles.subtitle}>
          Ek süre verilmeyecek. Bahaneleri bırak ve görevi hemen tamamla!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#260B0D',
    borderWidth: 1.5,
    borderColor: '#FF3B30',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#401014',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FF453A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#FFB2B6',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
});
