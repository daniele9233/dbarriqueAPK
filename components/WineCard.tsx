import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Wine } from '@/types/wine';
import Colors from '@/constants/colors';
import { Star } from 'lucide-react-native';

interface WineCardProps {
  wine: Wine;
  onPress: (wine: Wine) => void;
}

const { width } = Dimensions.get('window');
const getCardWidth = () => {
  if (width > 900) return (width - 80) / 3 - 20; // 3 columns
  if (width > 600) return (width - 60) / 2 - 10; // 2 columns
  return width - 40; // 1 column
};

export default function WineCard({ wine, onPress }: WineCardProps) {
  const cardWidth = getCardWidth();
  
  const renderRating = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= wine.rating ? Colors.dark.rating.filled : 'transparent'}
          color={i <= wine.rating ? Colors.dark.rating.filled : Colors.dark.rating.empty}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => onPress(wine)}
      activeOpacity={0.9}
    >
      <View style={styles.typeTag}>
        <Text style={styles.typeText}>{wine.type}</Text>
      </View>
      
      <Image
        source={{ uri: wine.image }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.ratingContainer}>
        {renderRating()}
      </View>
      
      <Text style={styles.name}>{wine.name}</Text>
      <Text style={styles.region}>{wine.region}, {wine.country}</Text>
      <Text style={styles.year}>{wine.year}</Text>
      
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 350,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    marginHorizontal: 5,
  },
  image: {
    width: '100%',
    height: 200,
    opacity: 0.8,
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.dark.tag.red.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    zIndex: 1,
  },
  typeText: {
    color: Colors.dark.tag.red.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 12,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 8,
    marginHorizontal: 12,
  },
  region: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 4,
    marginHorizontal: 12,
  },
  year: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 2,
    marginHorizontal: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
});