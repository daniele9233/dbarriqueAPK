import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import { Wine } from 'lucide-react-native';

interface LegendItem {
  color: string;
  label: string;
}

interface NetworkLegendProps {
  items: LegendItem[];
}

export default function NetworkLegend({ items }: NetworkLegendProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Wine size={14} color={Colors.dark.text} style={styles.icon} />
        <Text style={styles.title}>Legenda</Text>
      </View>
      
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    margin: 20,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 12,
  },
});