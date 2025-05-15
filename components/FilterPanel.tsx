import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Animated, Dimensions } from 'react-native';
import { Grape, GrapeCharacteristic } from '@/types/grape';
import Colors from '@/constants/colors';
import { Search, X, ChevronDown, Check, Filter } from 'lucide-react-native';

interface FilterPanelProps {
  grapes: Grape[];
  selectedGrapes: string[];
  selectedRegions: string[];
  selectedCharacteristics: string[];
  onSelectGrape: (grapeId: string) => void;
  onSelectRegion: (region: string) => void;
  onSelectCharacteristic: (characteristic: GrapeCharacteristic) => void;
  isSmallScreen?: boolean;
  onClearSelection: () => void;
}

export default function FilterPanel({ 
  grapes, 
  selectedGrapes,
  selectedRegions,
  selectedCharacteristics,
  onSelectGrape,
  onSelectRegion,
  onSelectCharacteristic,
  isSmallScreen = false,
  onClearSelection
}: FilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'vitigni' | 'regioni' | 'caratteristiche' | null>(null);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');
  
  // Get unique regions
  const regions = Array.from(new Set(grapes.flatMap(grape => grape.region))).sort();
  
  // Get unique characteristics
  const characteristics = Array.from(new Set(grapes.flatMap(grape => grape.characteristics))) as GrapeCharacteristic[];
  characteristics.sort();
  
  // Filter grapes based on search query
  const filteredGrapes = grapes.filter(grape => 
    grape.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter regions based on search query
  const filteredRegions = regions.filter(region => 
    region.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter characteristics based on search query
  const filteredCharacteristics = characteristics.filter(characteristic => 
    characteristic.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get color for grape item
  const getGrapeColor = (grape: Grape) => {
    switch (grape.color) {
      case 'red':
        return { background: 'rgba(178, 34, 34, 0.2)', text: '#ff5252' };
      case 'white':
        return { background: 'rgba(245, 245, 220, 0.2)', text: '#f5f5dc' };
      case 'rosé':
        return { background: 'rgba(255, 182, 193, 0.2)', text: '#ffb6c1' };
      case 'sparkling':
        return { background: 'rgba(135, 206, 235, 0.2)', text: '#87ceeb' };
      default:
        return { background: 'rgba(178, 34, 34, 0.2)', text: '#ff5252' };
    }
  };
  
  // Get color for region item
  const getRegionColor = (region: string) => {
    // Get all grapes in this region
    const grapesInRegion = grapes.filter(grape => grape.region.includes(region));
    
    // If region has only red wines
    if (grapesInRegion.every(grape => grape.color === 'red')) {
      return { background: 'rgba(178, 34, 34, 0.2)', text: '#ff5252' };
    }
    
    // If region has only white wines
    if (grapesInRegion.every(grape => grape.color === 'white')) {
      return { background: 'rgba(245, 245, 220, 0.2)', text: '#f5f5dc' };
    }
    
    // Mixed region
    return { background: 'rgba(255, 255, 255, 0.1)', text: Colors.dark.text };
  };
  
  // Get color for characteristic item
  const getCharacteristicColor = (characteristic: GrapeCharacteristic) => {
    switch (characteristic) {
      case 'Tannico':
        return { background: 'rgba(139, 0, 0, 0.3)', text: '#ff5252' };
      case 'Fruttato':
        return { background: 'rgba(255, 99, 71, 0.3)', text: '#ff6347' };
      case 'Floreale':
        return { background: 'rgba(221, 160, 221, 0.3)', text: '#dda0dd' };
      case 'Speziato':
        return { background: 'rgba(205, 133, 63, 0.3)', text: '#cd853f' };
      case 'Acido':
        return { background: 'rgba(154, 205, 50, 0.3)', text: '#9acd32' };
      case 'Minerale':
        return { background: 'rgba(70, 130, 180, 0.3)', text: '#4682b4' };
      case 'Secco':
        return { background: 'rgba(210, 180, 140, 0.3)', text: '#d2b48c' };
      case 'Corposo':
        return { background: 'rgba(128, 0, 0, 0.3)', text: '#800000' };
      case 'Aromatico':
        return { background: 'rgba(147, 112, 219, 0.3)', text: '#9370db' };
      case 'Morbido':
        return { background: 'rgba(188, 143, 143, 0.3)', text: '#bc8f8f' };
      default:
        return { background: 'rgba(255, 255, 255, 0.1)', text: Colors.dark.text };
    }
  };
  
  const toggleDropdown = (dropdown: 'vitigni' | 'regioni' | 'caratteristiche') => {
    if (activeDropdown === dropdown) {
      // Close dropdown
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setActiveDropdown(null);
      });
    } else {
      // Open dropdown
      setActiveDropdown(dropdown);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };
  
  // Calculate dropdown height based on screen size
  const getDropdownHeight = () => {
    if (isSmallScreen) {
      return Math.min(height * 0.4, 300);
    }
    return 300;
  };
  
  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, getDropdownHeight()],
  });
  
  const getSelectedCount = (type: 'vitigni' | 'regioni' | 'caratteristiche') => {
    switch (type) {
      case 'vitigni':
        return selectedGrapes.length;
      case 'regioni':
        return selectedRegions.length;
      case 'caratteristiche':
        return selectedCharacteristics.length;
      default:
        return 0;
    }
  };
  
  const getDropdownTitle = (type: 'vitigni' | 'regioni' | 'caratteristiche') => {
    const count = getSelectedCount(type);
    switch (type) {
      case 'vitigni':
        return count > 0 ? `Vitigni (${count})` : 'Vitigni';
      case 'regioni':
        return count > 0 ? `Regioni (${count})` : 'Regioni';
      case 'caratteristiche':
        return count > 0 ? `Caratteristiche (${count})` : 'Caratteristiche';
      default:
        return '';
    }
  };
  
  const renderSelectedItems = (type: 'vitigni' | 'regioni' | 'caratteristiche') => {
    let items: React.ReactNode[] = [];
    
    switch (type) {
      case 'vitigni':
        items = selectedGrapes.map(id => {
          const grape = grapes.find(g => g.id === id);
          if (!grape) return null;
          const colors = getGrapeColor(grape);
          
          return (
            <TouchableOpacity
              key={`selected-${grape.id}`}
              style={[
                styles.selectedItem,
                { backgroundColor: colors.background }
              ]}
              onPress={() => onSelectGrape(grape.id)}
            >
              <Text style={[styles.selectedItemText, { color: colors.text }]}>
                {grape.name}
              </Text>
              <X size={12} color={colors.text} />
            </TouchableOpacity>
          );
        });
        break;
      
      case 'regioni':
        items = selectedRegions.map(region => {
          const colors = getRegionColor(region);
          
          return (
            <TouchableOpacity
              key={`selected-${region}`}
              style={[
                styles.selectedItem,
                { backgroundColor: colors.background }
              ]}
              onPress={() => onSelectRegion(region)}
            >
              <Text style={[styles.selectedItemText, { color: colors.text }]}>
                {region}
              </Text>
              <X size={12} color={colors.text} />
            </TouchableOpacity>
          );
        });
        break;
      
      case 'caratteristiche':
        items = selectedCharacteristics.map(characteristic => {
          // Type assertion to ensure characteristic is treated as GrapeCharacteristic
          const typedCharacteristic = characteristic as GrapeCharacteristic;
          const colors = getCharacteristicColor(typedCharacteristic);
          
          return (
            <TouchableOpacity
              key={`selected-${characteristic}`}
              style={[
                styles.selectedItem,
                { backgroundColor: colors.background }
              ]}
              onPress={() => onSelectCharacteristic(typedCharacteristic)}
            >
              <Text style={[styles.selectedItemText, { color: colors.text }]}>
                {characteristic}
              </Text>
              <X size={12} color={colors.text} />
            </TouchableOpacity>
          );
        });
        break;
    }
    
    return items.filter(Boolean);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Filter size={16} color={Colors.dark.text} style={styles.titleIcon} />
          <Text style={styles.title}>Filtri</Text>
        </View>
        
        {(selectedGrapes.length > 0 || selectedRegions.length > 0 || selectedCharacteristics.length > 0) && (
          <TouchableOpacity 
            style={styles.clearSelectionButton}
            onPress={onClearSelection}
          >
            <X size={12} color={Colors.dark.text} />
            <Text style={styles.clearSelectionText}>Cancella</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={16} color={Colors.dark.subtext} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca filtri..."
          placeholderTextColor={Colors.dark.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <X size={16} color={Colors.dark.subtext} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.dropdownsContainer}>
        {/* Vitigni Dropdown */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              activeDropdown === 'vitigni' && styles.activeDropdownButton,
              selectedGrapes.length > 0 && styles.hasSelectionButton
            ]}
            onPress={() => toggleDropdown('vitigni')}
          >
            <Text style={[
              styles.dropdownButtonText,
              activeDropdown === 'vitigni' && styles.activeDropdownButtonText,
              selectedGrapes.length > 0 && styles.hasSelectionText
            ]}>
              {getDropdownTitle('vitigni')}
            </Text>
            <ChevronDown 
              size={16} 
              color={activeDropdown === 'vitigni' ? Colors.dark.accent : Colors.dark.text} 
              style={[
                styles.dropdownIcon,
                activeDropdown === 'vitigni' && styles.activeDropdownIcon
              ]}
            />
          </TouchableOpacity>
          
          {activeDropdown === 'vitigni' && (
            <Animated.View style={[styles.dropdownContent, { height: dropdownHeight }]}>
              <ScrollView 
                style={styles.dropdownScrollView}
                contentContainerStyle={[styles.dropdownScrollViewContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {filteredGrapes.map(grape => {
                  const isSelected = selectedGrapes.includes(grape.id);
                  const colors = getGrapeColor(grape);
                  
                  return (
                    <TouchableOpacity
                      key={grape.id}
                      style={[
                        styles.dropdownItem,
                        { backgroundColor: isSelected ? colors.background : 'transparent' }
                      ]}
                      onPress={() => onSelectGrape(grape.id)}
                    >
                      <View style={styles.dropdownItemContent}>
                        <View style={[styles.colorDot, { backgroundColor: colors.text }]} />
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && { color: colors.text, fontWeight: 'bold' }
                        ]}>
                          {grape.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <Check size={16} color={colors.text} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}
          
          {selectedGrapes.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.selectedItemsScroll}
              contentContainerStyle={styles.selectedItemsContainer}
            >
              {renderSelectedItems('vitigni')}
            </ScrollView>
          )}
        </View>
        
        {/* Regioni Dropdown */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              activeDropdown === 'regioni' && styles.activeDropdownButton,
              selectedRegions.length > 0 && styles.hasSelectionButton
            ]}
            onPress={() => toggleDropdown('regioni')}
          >
            <Text style={[
              styles.dropdownButtonText,
              activeDropdown === 'regioni' && styles.activeDropdownButtonText,
              selectedRegions.length > 0 && styles.hasSelectionText
            ]}>
              {getDropdownTitle('regioni')}
            </Text>
            <ChevronDown 
              size={16} 
              color={activeDropdown === 'regioni' ? Colors.dark.accent : Colors.dark.text} 
              style={[
                styles.dropdownIcon,
                activeDropdown === 'regioni' && styles.activeDropdownIcon
              ]}
            />
          </TouchableOpacity>
          
          {activeDropdown === 'regioni' && (
            <Animated.View style={[styles.dropdownContent, { height: dropdownHeight }]}>
              <ScrollView 
                style={styles.dropdownScrollView}
                contentContainerStyle={[styles.dropdownScrollViewContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {filteredRegions.map(region => {
                  const isSelected = selectedRegions.includes(region);
                  const colors = getRegionColor(region);
                  
                  return (
                    <TouchableOpacity
                      key={region}
                      style={[
                        styles.dropdownItem,
                        { backgroundColor: isSelected ? colors.background : 'transparent' }
                      ]}
                      onPress={() => onSelectRegion(region)}
                    >
                      <View style={styles.dropdownItemContent}>
                        <View style={[styles.colorDot, { backgroundColor: colors.text }]} />
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && { color: colors.text, fontWeight: 'bold' }
                        ]}>
                          {region}
                        </Text>
                      </View>
                      {isSelected && (
                        <Check size={16} color={colors.text} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}
          
          {selectedRegions.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.selectedItemsScroll}
              contentContainerStyle={styles.selectedItemsContainer}
            >
              {renderSelectedItems('regioni')}
            </ScrollView>
          )}
        </View>
        
        {/* Caratteristiche Dropdown */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              activeDropdown === 'caratteristiche' && styles.activeDropdownButton,
              selectedCharacteristics.length > 0 && styles.hasSelectionButton
            ]}
            onPress={() => toggleDropdown('caratteristiche')}
          >
            <Text style={[
              styles.dropdownButtonText,
              activeDropdown === 'caratteristiche' && styles.activeDropdownButtonText,
              selectedCharacteristics.length > 0 && styles.hasSelectionText
            ]}>
              {getDropdownTitle('caratteristiche')}
            </Text>
            <ChevronDown 
              size={16} 
              color={activeDropdown === 'caratteristiche' ? Colors.dark.accent : Colors.dark.text} 
              style={[
                styles.dropdownIcon,
                activeDropdown === 'caratteristiche' && styles.activeDropdownIcon
              ]}
            />
          </TouchableOpacity>
          
          {activeDropdown === 'caratteristiche' && (
            <Animated.View style={[styles.dropdownContent, { height: dropdownHeight }]}>
              <ScrollView 
                style={styles.dropdownScrollView}
                contentContainerStyle={[styles.dropdownScrollViewContent, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {filteredCharacteristics.map(characteristic => {
                  const isSelected = selectedCharacteristics.includes(characteristic);
                  const colors = getCharacteristicColor(characteristic);
                  
                  return (
                    <TouchableOpacity
                      key={characteristic}
                      style={[
                        styles.dropdownItem,
                        { backgroundColor: isSelected ? colors.background : 'transparent' }
                      ]}
                      onPress={() => onSelectCharacteristic(characteristic)}
                    >
                      <View style={styles.dropdownItemContent}>
                        <View style={[styles.colorDot, { backgroundColor: colors.text }]} />
                        <Text style={[
                          styles.dropdownItemText,
                          isSelected && { color: colors.text, fontWeight: 'bold' }
                        ]}>
                          {characteristic}
                        </Text>
                      </View>
                      {isSelected && (
                        <Check size={16} color={colors.text} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}
          
          {selectedCharacteristics.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.selectedItemsScroll}
              contentContainerStyle={styles.selectedItemsContainer}
            >
              {renderSelectedItems('caratteristiche')}
            </ScrollView>
          )}
        </View>
      </View>
      
      {(selectedRegions.length > 0 || selectedCharacteristics.length > 0) && (
        <View style={styles.filterInfoContainer}>
          <Text style={styles.filterInfoText}>
            I filtri si combinano per affinare la selezione
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    height: '100%',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  clearSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearSelectionText: {
    color: Colors.dark.text,
    fontSize: 12,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    color: Colors.dark.text,
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  dropdownsContainer: {
    flex: 1,
  },
  dropdownWrapper: {
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  activeDropdownButton: {
    backgroundColor: 'rgba(178, 34, 34, 0.2)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  hasSelectionButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(178, 34, 34, 0.3)',
  },
  dropdownButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  activeDropdownButtonText: {
    color: Colors.dark.accent,
    fontWeight: 'bold',
  },
  hasSelectionText: {
    fontWeight: 'bold',
  },
  dropdownIcon: {
    transform: [{ rotate: '0deg' }],
  },
  activeDropdownIcon: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContent: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(178, 34, 34, 0.2)',
    borderTopWidth: 0,
  },
  dropdownScrollView: {
    flex: 1,
  },
  dropdownScrollViewContent: {
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    marginBottom: 2,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dropdownItemText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  selectedItemsScroll: {
    marginTop: 8,
    maxHeight: 36,
  },
  selectedItemsContainer: {
    paddingRight: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedItemText: {
    fontSize: 12,
    marginRight: 4,
  },
  filterInfoContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    marginTop: 'auto',
  },
  filterInfoText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});