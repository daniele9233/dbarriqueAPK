import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface DashboardStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function DashboardStatCard({ title, value, subtitle, icon }: DashboardStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <View style={styles.iconContainer}>
          {icon}
        </View>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 20,
    width: width > 700 ? '31%' : width > 500 ? '48%' : '100%',
    marginBottom: 20,
  },
  title: {
    color: Colors.dark.subtext,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(178, 34, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    color: Colors.dark.subtext,
    fontSize: 10,
  },
});