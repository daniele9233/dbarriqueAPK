import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import WineCard from '@/components/WineCard';
import WineDetailModal from '@/components/WineDetailModal';
import { Wine } from '@/types/wine';
import AddWineModal from '@/components/AddWineModal';
import { useWineStore } from '@/stores/wineStore';

const { width } = Dimensions.get('window');
const numColumns = width > 900 ? 3 : width > 600 ? 2 : 1;

export default function CollectionScreen() {
  const { wines, addWine, updateWine } = useWineStore();
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addWineModalVisible, setAddWineModalVisible] = useState(false);

  const handleWinePress = (wine: Wine) => {
    setSelectedWine(wine);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUpdateWine = (updatedWine: Wine) => {
    updateWine(updatedWine);
    setSelectedWine(updatedWine);
  };

  const handleAddWine = (newWine: Wine) => {
    addWine(newWine);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerSection}>
            <Text style={styles.premiumText}>PREMIUM SELECTION</Text>
            <Text style={styles.title}>The Collection</Text>
            <Text style={styles.subtitle}>
              Each bottle in our cellar is chosen with care, representing the pinnacle of its region and vintage.
              Discover our selection of exceptional wines.
            </Text>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setAddWineModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Aggiungi Vino</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.wineGrid}>
            <FlatList
              data={wines}
              renderItem={({ item }) => (
                <WineCard wine={item} onPress={handleWinePress} />
              )}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              key={numColumns} // This is important when numColumns can change
              columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
        
        <WineDetailModal
          wine={selectedWine}
          visible={modalVisible}
          onClose={closeModal}
          onUpdate={handleUpdateWine}
        />
        
        <AddWineModal
          visible={addWineModalVisible}
          onClose={() => setAddWineModalVisible(false)}
          onAddWine={handleAddWine}
        />
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
  headerSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumText: {
    color: Colors.dark.accent,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 24,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 20,
  },
  addButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  wineGrid: {
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});