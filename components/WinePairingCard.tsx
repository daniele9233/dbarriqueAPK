import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { Wine, ArrowRight, Check } from 'lucide-react-native';

interface WineMatch {
  wine: string;
  inCollection: boolean;
}

interface WinePairingCardProps {
  food: string;
  wines: string[];
  wineMatches?: WineMatch[];
  description: string;
  onPress?: () => void;
  selected?: boolean;
  hasMatchInCollection?: boolean;
}

export default function WinePairingCard({ 
  food, 
  wines, 
  wineMatches = [],
  description, 
  onPress,
  selected = false,
  hasMatchInCollection = false
}: WinePairingCardProps) {
  return (
    <View style={[
      styles.container, 
      selected && styles.containerSelected,
      hasMatchInCollection && styles.containerHasMatch
    ]}>
      <View style={[
        styles.header, 
        selected && styles.headerSelected,
        hasMatchInCollection && styles.headerHasMatch
      ]}>
        <Text style={styles.foodName}>{food}</Text>
        {hasMatchInCollection && (
          <View style={styles.matchBadge}>
            <Check size={12} color="#fff" />
            <Text style={styles.matchBadgeText}>In Cantina</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.winesContainer}>
          <Text style={styles.winesLabel}>Vini consigliati:</Text>
          {wineMatches.length > 0 ? (
            wineMatches.map((match, index) => (
              <View key={index} style={styles.wineItem}>
                <Wine 
                  size={14} 
                  color={match.inCollection ? Colors.dark.accent : Colors.dark.subtext} 
                  style={styles.wineIcon} 
                />
                <Text style={[
                  styles.wineName, 
                  match.inCollection ? styles.wineInCollection : styles.wineNotInCollection
                ]}>
                  {match.wine}
                  {match.inCollection && " ✓"}
                </Text>
              </View>
            ))
          ) : (
            wines.map((wine, index) => (
              <View key={index} style={styles.wineItem}>
                <Wine size={14} color={Colors.dark.accent} style={styles.wineIcon} />
                <Text style={styles.wineName}>{wine}</Text>
              </View>
            ))
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.tryButton, 
          selected && styles.tryButtonSelected,
          hasMatchInCollection && styles.tryButtonHasMatch
        ]}
        onPress={onPress}
      >
        <Text style={styles.tryButtonText}>Chiedi al bot</Text>
        <ArrowRight size={14} color={Colors.dark.text} style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: Colors.dark.accent,
  },
  containerHasMatch: {
    borderColor: 'rgba(178, 34, 34, 0.5)',
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    backgroundColor: Colors.dark.accent,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSelected: {
    backgroundColor: 'rgba(178, 34, 34, 0.8)',
  },
  headerHasMatch: {
    backgroundColor: 'rgba(178, 34, 34, 0.9)',
  },
  foodName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  matchBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchBadgeText: {
    color: Colors.dark.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    padding: 12,
  },
  description: {
    color: Colors.dark.text,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  winesContainer: {
    marginTop: 8,
  },
  winesLabel: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginBottom: 8,
  },
  wineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  wineIcon: {
    marginRight: 6,
  },
  wineName: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  wineInCollection: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  wineNotInCollection: {
    color: Colors.dark.subtext,
    fontStyle: 'italic',
  },
  tryButton: {
    backgroundColor: 'rgba(178, 34, 34, 0.3)',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tryButtonSelected: {
    backgroundColor: 'rgba(178, 34, 34, 0.5)',
  },
  tryButtonHasMatch: {
    backgroundColor: 'rgba(178, 34, 34, 0.6)',
  },
  tryButtonText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
  arrowIcon: {
    marginTop: 1,
  },
});