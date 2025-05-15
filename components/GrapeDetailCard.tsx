import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Grape } from '@/types/grape';
import Colors from '@/constants/colors';
import { X, Wine, Grape as GrapeIcon, MapPin, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GrapeDetailCardProps {
  grape: Grape | null;
  onClose: () => void;
  isSmallScreen?: boolean;
}

const { width, height } = Dimensions.get('window');

export default function GrapeDetailCard({ grape, onClose, isSmallScreen = false }: GrapeDetailCardProps) {
  if (!grape) return null;
  
  // Get gradient colors based on wine type
  const getGradientColors = () => {
    switch (grape.color) {
      case 'red':
        return ['#8b0000', '#b22222', '#dc143c'] as const;
      case 'white':
        return ['#e6e6c8', '#f5f5dc', '#fffff0'] as const;
      case 'rosé':
        return ['#ff9aa2', '#ffb6c1', '#ffc0cb'] as const;
      case 'sparkling':
        return ['#5f9ea0', '#87ceeb', '#add8e6'] as const;
      default:
        return ['#8b0000', '#b22222', '#dc143c'] as const;
    }
  };
  
  // Get text color based on wine type
  const getTextColor = () => {
    return grape.color === 'white' ? '#333333' : '#ffffff';
  };
  
  // Get icon color based on wine type
  const getIconColor = () => {
    return grape.color === 'white' ? '#333333' : '#ffffff';
  };
  
  const gradientColors = getGradientColors();
  const textColor = getTextColor();
  const iconColor = getIconColor();
  
  // Default image if none provided
  const imageUrl = grape.image || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  
  return (
    <View style={[
      styles.container,
      isSmallScreen ? styles.containerMobile : styles.containerDesktop
    ]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Wine size={18} color={iconColor} style={styles.wineIcon} />
            <Text style={[styles.title, { color: textColor }]}>{grape.name}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={16} color={textColor} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.wineTypeLabel}>
                {grape.color === 'red' ? 'Vino Rosso' : 
                 grape.color === 'white' ? 'Vino Bianco' : 
                 grape.color === 'rosé' ? 'Vino Rosato' : 'Spumante'}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <MapPin size={14} color={Colors.dark.text} />
              </View>
              <Text style={styles.detailLabel}>Regioni:</Text>
              <Text style={styles.detailValue}>{grape.region.join(', ')}</Text>
            </View>
            
            <View style={styles.characteristicsContainer}>
              <View style={styles.sectionHeader}>
                <Tag size={14} color={Colors.dark.text} style={styles.sectionIcon} />
                <Text style={styles.characteristicsLabel}>Caratteristiche:</Text>
              </View>
              <View style={styles.characteristicsTags}>
                {grape.characteristics.map((characteristic, index) => {
                  // Get tag color based on characteristic
                  let tagColor = 'rgba(178, 34, 34, 0.2)';
                  if (characteristic === 'Tannico') tagColor = 'rgba(139, 0, 0, 0.3)';
                  else if (characteristic === 'Fruttato') tagColor = 'rgba(255, 99, 71, 0.3)';
                  else if (characteristic === 'Floreale') tagColor = 'rgba(221, 160, 221, 0.3)';
                  else if (characteristic === 'Speziato') tagColor = 'rgba(205, 133, 63, 0.3)';
                  else if (characteristic === 'Acido') tagColor = 'rgba(154, 205, 50, 0.3)';
                  else if (characteristic === 'Minerale') tagColor = 'rgba(70, 130, 180, 0.3)';
                  else if (characteristic === 'Secco') tagColor = 'rgba(210, 180, 140, 0.3)';
                  else if (characteristic === 'Corposo') tagColor = 'rgba(128, 0, 0, 0.3)';
                  else if (characteristic === 'Aromatico') tagColor = 'rgba(147, 112, 219, 0.3)';
                  else if (characteristic === 'Morbido') tagColor = 'rgba(188, 143, 143, 0.3)';
                  
                  return (
                    <View key={index} style={[styles.characteristicTag, { backgroundColor: tagColor }]}>
                      <Text style={styles.characteristicText}>{characteristic}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{grape.description}</Text>
            </View>
            
            <View style={styles.relatedContainer}>
              <View style={styles.sectionHeader}>
                <GrapeIcon size={14} color={Colors.dark.text} style={styles.sectionIcon} />
                <Text style={styles.relatedLabel}>Vitigni correlati:</Text>
              </View>
              <View style={styles.relatedTags}>
                {grape.relatedGrapes.map((relatedGrape, index) => (
                  <View key={index} style={styles.relatedTag}>
                    <Text style={styles.relatedTagText}>{relatedGrape}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  containerDesktop: {
    bottom: 20,
    right: 20,
    width: width > 700 ? 350 : width > 500 ? 300 : 250,
    maxHeight: 400,
  },
  containerMobile: {
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7, // Take up 70% of screen height on mobile
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerGradient: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wineIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8, // Increased touch target
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  content: {
    padding: 12,
  },
  imageContainer: {
    height: 120,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 4,
  },
  wineTypeLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    marginRight: 4,
  },
  detailLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
    width: 60,
    marginRight: 4,
  },
  detailValue: {
    color: Colors.dark.text,
    fontSize: 12,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionIcon: {
    marginRight: 4,
  },
  characteristicsContainer: {
    marginTop: 4,
  },
  characteristicsLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  characteristicsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  characteristicTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  characteristicText: {
    color: Colors.dark.text,
    fontSize: 10,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  descriptionText: {
    color: Colors.dark.text,
    fontSize: 12,
    lineHeight: 16,
  },
  relatedContainer: {
    marginTop: 4,
  },
  relatedLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  relatedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relatedTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  relatedTagText: {
    color: Colors.dark.text,
    fontSize: 10,
  },
});