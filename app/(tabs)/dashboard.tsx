import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { Wine, Grape } from 'lucide-react-native';
import { Wine as WineType } from '@/types/wine';
import DashboardStatCard from '@/components/DashboardStatCard';
import WineRatingRow from '@/components/WineRatingRow';
import AddWineModal from '@/components/AddWineModal';
import { useWineStore } from '@/stores/wineStore';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { wines, addWine } = useWineStore();
  const [addWineModalVisible, setAddWineModalVisible] = useState(false);
  
  // Calculate stats from the wines data
  const totalWines = wines.length;
  const averageRating = totalWines > 0 ? (wines.reduce((sum, wine) => sum + wine.rating, 0) / totalWines).toFixed(1) : "0.0";
  
  // Count wine types
  const wineTypeCount = wines.reduce((acc, wine) => {
    acc[wine.type] = (acc[wine.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find most common type
  let mostCommonType = 'RED';
  let maxCount = 0;
  
  Object.entries(wineTypeCount).forEach(([type, count]) => {
    if (count > maxCount) {
      mostCommonType = type;
      maxCount = count;
    }
  });
  
  const mostCommonTypeLabel = mostCommonType === 'RED' ? 'Rosso' : 
                             mostCommonType === 'WHITE' ? 'Bianco' : 
                             mostCommonType === 'SPARKLING' ? 'Spumante' : 'Rosé';
  
  // Sort wines by rating (descending)
  const sortedWines = [...wines].sort((a, b) => b.rating - a.rating);

  const handleAddWine = (newWine: WineType) => {
    addWine(newWine);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>La Tua <Text style={styles.titleAccent}>Collezione</Text></Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setAddWineModalVisible(true)}
              >
                <Text style={styles.addButtonText}>+ Aggiungi Vino</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.quote}>"Una bottiglia di vino contiene più filosofia che tutti i libri del mondo." - Louis Pasteur</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <DashboardStatCard 
              title="TOTALE VINI"
              value={totalWines.toString()}
              subtitle="NELLA TUA COLLEZIONE"
              icon={<Grape size={24} color={Colors.dark.accent} />}
            />
            
            <DashboardStatCard 
              title="VALUTAZIONE MEDIA"
              value={averageRating}
              subtitle="SU 10 PUNTI"
              icon={<Wine size={24} color={Colors.dark.accent} />}
            />
            
            <DashboardStatCard 
              title="TIPO PIÙ COMUNE"
              value={mostCommonTypeLabel}
              subtitle={`${maxCount} BOTTIGLIE IN COLLEZIONE`}
              icon={<Wine size={24} color={Colors.dark.accent} />}
            />
          </View>
          
          <View style={styles.bestWinesSection}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionTitleLine} />
              <Text style={styles.sectionTitle}>I TUOI MIGLIORI VINI</Text>
              <View style={styles.sectionTitleLine} />
            </View>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.wineColumn]}>VINO</Text>
              <Text style={[styles.tableHeaderText, styles.yearColumn]}>ANNATA</Text>
              <Text style={[styles.tableHeaderText, styles.regionColumn]}>REGIONE</Text>
              <Text style={[styles.tableHeaderText, styles.ratingColumn]}>VALUTAZIONE</Text>
            </View>
            
            {sortedWines.map((wine, index) => (
              <WineRatingRow 
                key={wine.id}
                wine={wine}
                index={index}
              />
            ))}
          </View>
          
          <View style={styles.footer}>
            <View style={styles.footerLogoSection}>
              <View style={styles.footerLogoContainer}>
                <Wine size={24} color={Colors.dark.accent} />
                <Text style={styles.footerLogo}>
                  <Text style={styles.footerLogoD}>D</Text>
                  <Text style={styles.footerLogoBarrique}>Barrique</Text>
                </Text>
              </View>
              <Text style={styles.footerDescription}>
                A personal wine cellar management system for the discerning collector. Store, track, and showcase your finest wines.
              </Text>
            </View>
            
            <View style={styles.footerNavSection}>
              <Text style={styles.footerSectionTitle}>Navigation</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Collection</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.footerLink}>About</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footerContactSection}>
              <Text style={styles.footerSectionTitle}>Connect</Text>
              <View style={styles.footerSocialLinks}>
                <TouchableOpacity style={styles.socialIcon}>
                  <Text style={styles.socialIconText}>IG</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Text style={styles.socialIconText}>FB</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <Text style={styles.socialIconText}>@</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.contactEmail}>Contact: info@dbarrique.com</Text>
            </View>
          </View>
          
          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>© 2025 DBarrique. All rights reserved.</Text>
            <Text style={styles.designedWith}>Designed with ❤️ for wine lovers</Text>
          </View>
        </ScrollView>
        
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
    paddingTop: 30,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 10,
  },
  titleAccent: {
    color: Colors.dark.accent,
  },
  addButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 10,
  },
  addButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.dark.subtext,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    flexWrap: 'wrap',
  },
  bestWinesSection: {
    padding: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    marginHorizontal: 10,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tableHeaderText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    fontWeight: 'bold',
  },
  wineColumn: {
    flex: 3,
  },
  yearColumn: {
    flex: 1,
    textAlign: 'center',
  },
  regionColumn: {
    flex: 2,
  },
  ratingColumn: {
    flex: 2,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 40,
    flexWrap: 'wrap',
  },
  footerLogoSection: {
    flex: 2,
    minWidth: 200,
    marginBottom: 20,
    marginRight: 20,
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footerLogoD: {
    color: Colors.dark.text,
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  footerLogoBarrique: {
    color: Colors.dark.accent,
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  footerDescription: {
    color: Colors.dark.subtext,
    fontSize: 12,
    lineHeight: 18,
  },
  footerNavSection: {
    flex: 1,
    minWidth: 120,
    marginBottom: 20,
    marginRight: 20,
  },
  footerContactSection: {
    flex: 1,
    minWidth: 120,
    marginBottom: 20,
  },
  footerSectionTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  footerLink: {
    color: Colors.dark.subtext,
    marginBottom: 10,
  },
  footerSocialLinks: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  socialIconText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  contactEmail: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  copyright: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  copyrightText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginBottom: 5,
  },
  designedWith: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginBottom: 5,
  },
});