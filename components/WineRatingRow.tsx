import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Wine as WineType } from '@/types/wine';
import Colors from '@/constants/colors';
import { Wine } from 'lucide-react-native';

interface WineRatingRowProps {
  wine: WineType;
  index: number;
}

export default function WineRatingRow({ wine, index }: WineRatingRowProps) {
  // Function to get color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return '#4CAF50'; // Green for excellent
    if (rating >= 7) return '#FFC107'; // Yellow for good
    if (rating >= 5) return '#FF9800'; // Orange for average
    return '#F44336'; // Red for poor
  };
  
  // Function to get background color for alternating rows
  const getRowBackgroundColor = (index: number) => {
    return index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent';
  };
  
  return (
    <TouchableOpacity style={[styles.row, { backgroundColor: getRowBackgroundColor(index) }]}>
      <View style={styles.wineColumn}>
        <View style={styles.wineInfo}>
          <View style={[styles.wineIcon, { backgroundColor: wine.type === 'RED' ? '#8B0000' : 
                                                          wine.type === 'WHITE' ? '#F0E68C' : 
                                                          wine.type === 'SPARKLING' ? '#87CEEB' : '#FFB6C1' }]}>
            <Wine size={12} color={wine.type === 'WHITE' ? '#333' : '#fff'} />
          </View>
          <Text style={styles.wineName} numberOfLines={1} ellipsizeMode="tail">
            {wine.name}
          </Text>
        </View>
      </View>
      <Text style={styles.yearColumn}>{wine.year}</Text>
      <Text style={styles.regionColumn} numberOfLines={1} ellipsizeMode="tail">{wine.region}</Text>
      <View style={styles.ratingColumn}>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(wine.rating) }]}>
          <Text style={styles.ratingText}>{wine.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  wineColumn: {
    flex: 3,
    paddingRight: 8,
  },
  wineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wineIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  wineName: {
    color: Colors.dark.text,
    fontSize: 14,
    flexShrink: 1,
  },
  yearColumn: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: 'center',
  },
  regionColumn: {
    flex: 2,
    color: Colors.dark.text,
    fontSize: 14,
    paddingHorizontal: 4,
  },
  ratingColumn: {
    flex: 2,
    alignItems: 'flex-end',
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});