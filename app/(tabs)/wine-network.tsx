import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, Platform, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { grapes, grapeNetwork } from '@/mocks/grapes';
import { Grape } from '@/types/grape';
import NetworkGraph from '@/components/NetworkGraph';
import FilterPanel from '@/components/FilterPanel';
import GrapeDetailCard from '@/components/GrapeDetailCard';
import NetworkLegend from '@/components/NetworkLegend';
import { ChevronLeft, ChevronRight, Filter, Info, Wine } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 768;

export default function WineNetworkScreen() {
  const [selectedGrapes, setSelectedGrapes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [selectedGrape, setSelectedGrape] = useState<Grape | null>(null);
  const [showFilters, setShowFilters] = useState(!isSmallScreen);
  const [showInfo, setShowInfo] = useState(false);
  
  // Force a re-render when the screen dimensions change (e.g., rotation)
  useEffect(() => {
    const handleDimensionsChange = () => {
      // This will trigger a re-render
      setShowFilters(!isSmallScreen);
    };
    
    // Add event listener for dimension changes
    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    
    // Clean up
    return () => {
      // Use the remove method from the subscription object
      subscription.remove();
    };
  }, []);
  
  const handleSelectGrape = (grapeId: string) => {
    setSelectedGrapes(prev => {
      if (prev.includes(grapeId)) {
        return prev.filter(id => id !== grapeId);
      } else {
        return [...prev, grapeId];
      }
    });
  };
  
  const handleSelectRegion = (region: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        return prev.filter(r => r !== region);
      } else {
        return [...prev, region];
      }
    });
  };
  
  const handleSelectCharacteristic = (characteristic: string) => {
    setSelectedCharacteristics(prev => {
      if (prev.includes(characteristic)) {
        return prev.filter(c => c !== characteristic);
      } else {
        return [...prev, characteristic];
      }
    });
  };
  
  const handleSelectNode = (grape: Grape) => {
    console.log("Node selected in parent:", grape.name); // Debug log
    setSelectedGrape(grape);
    // On small screens, hide filters when a grape is selected
    if (isSmallScreen) {
      setShowFilters(false);
    }
  };
  
  const handleCloseDetail = () => {
    setSelectedGrape(null);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleClearSelection = () => {
    setSelectedGrapes([]);
    setSelectedRegions([]);
    setSelectedCharacteristics([]);
  };
  
  // Legend items - simplified for mobile
  const legendItems = isSmallScreen ? [
    { color: '#b22222', label: 'Vini Rossi' },
    { color: '#f5f5dc', label: 'Vini Bianchi' },
    { color: '#ffb6c1', label: 'Vini Rosati' },
    { color: '#87ceeb', label: 'Spumanti' }
  ] : [
    { color: '#b22222', label: 'Vini Rossi' },
    { color: '#f5f5dc', label: 'Vini Bianchi' },
    { color: '#ffb6c1', label: 'Vini Rosati' },
    { color: '#87ceeb', label: 'Spumanti' },
  ];
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <View style={styles.content}>
            <LinearGradient
              colors={['rgba(139, 0, 0, 0.4)', 'rgba(0, 0, 0, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerSection}>
                <View style={styles.titleRow}>
                  <View style={styles.titleContainer}>
                    <Wine size={24} color={Colors.dark.text} style={styles.titleIcon} />
                    <Text style={styles.title}>Wine Network</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={toggleInfo}
                  >
                    <Info size={16} color={Colors.dark.text} />
                  </TouchableOpacity>
                </View>
                
                {showInfo && (
                  <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                      Esplora le relazioni tra i vitigni in base alle loro caratteristiche e regioni di coltivazione. 
                      Seleziona i filtri per affinare la visualizzazione.
                    </Text>
                    <Text style={styles.infoText}>
                      <Text style={styles.infoTextBold}>Interazione:</Text> Tocca un nodo per visualizzare i dettagli del vitigno. Trascina i nodi per riorganizzare la rete.
                    </Text>
                    <Text style={styles.infoText}>
                      <Text style={styles.infoTextBold}>Filtri:</Text> Usa i menu a tendina per filtrare per vitigno, regione o caratteristiche. I filtri per regione e caratteristiche si combinano per affinare la selezione.
                    </Text>
                  </View>
                )}
                
                <Text style={styles.subtitle}>
                  Esplora le relazioni tra i vini in base alle loro caratteristiche e vitigni. Ogni bolla rappresenta un vitigno, colorato in base al tipo di vino che produce.
                </Text>
                
                {isSmallScreen && (
                  <TouchableOpacity 
                    style={styles.filterToggleButton}
                    onPress={toggleFilters}
                  >
                    <Filter size={16} color={Colors.dark.text} />
                    <Text style={styles.filterToggleText}>
                      {showFilters ? 'Nascondi Filtri' : 'Mostra Filtri'}
                    </Text>
                    {showFilters ? (
                      <ChevronLeft size={16} color={Colors.dark.text} />
                    ) : (
                      <ChevronRight size={16} color={Colors.dark.text} />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
            
            <View style={styles.mainContent}>
              {showFilters && (
                <View style={[
                  styles.filterContainer,
                  isSmallScreen && styles.filterContainerMobile
                ]}>
                  <FilterPanel 
                    grapes={grapes}
                    selectedGrapes={selectedGrapes}
                    selectedRegions={selectedRegions}
                    selectedCharacteristics={selectedCharacteristics}
                    onSelectGrape={handleSelectGrape}
                    onSelectRegion={handleSelectRegion}
                    onSelectCharacteristic={handleSelectCharacteristic}
                    isSmallScreen={isSmallScreen}
                    onClearSelection={handleClearSelection}
                  />
                </View>
              )}
              
              <View style={[
                styles.graphContainer,
                showFilters && isSmallScreen && styles.graphContainerWithFiltersMobile,
                !showFilters && styles.graphContainerFullWidth
              ]}>
                <NetworkGraph 
                  network={grapeNetwork}
                  selectedGrapes={selectedGrapes}
                  selectedRegions={selectedRegions}
                  selectedCharacteristics={selectedCharacteristics}
                  onSelectNode={handleSelectNode}
                />
                
                {selectedGrape && (
                  <GrapeDetailCard 
                    grape={selectedGrape}
                    onClose={handleCloseDetail}
                    isSmallScreen={isSmallScreen}
                  />
                )}
              </View>
            </View>
            
            <NetworkLegend items={legendItems} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerSection: {
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  infoButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#b22222',
  },
  infoText: {
    color: Colors.dark.text,
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 18,
  },
  infoTextBold: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    maxWidth: 600,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  filterToggleText: {
    color: Colors.dark.text,
    fontSize: 14,
    marginHorizontal: 8,
  },
  mainContent: {
    flex: 1,
    flexDirection: width < 768 ? 'column' : 'row',
    padding: 20,
    paddingTop: 0,
  },
  filterContainer: {
    width: 280,
    marginRight: 20,
  },
  filterContainerMobile: {
    width: '100%',
    marginRight: 0,
    marginBottom: 16,
    height: 380, // Increased height for mobile to ensure more content is visible
  },
  graphContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 400, // Ensure minimum height for the graph
  },
  graphContainerWithFiltersMobile: {
    height: width < 500 ? 350 : 400,
  },
  graphContainerFullWidth: {
    width: '100%',
  },
});