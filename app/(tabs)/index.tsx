import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { wines } from '@/mocks/wines';
import { Wine, Users, BarChart, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  
  // Select featured wines (top 3 by rating)
  const featuredWines = [...wines]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  // Calculate collection stats
  const totalWines = wines.length;
  const averageRating = (wines.reduce((sum, wine) => sum + wine.rating, 0) / totalWines).toFixed(1);
  const redWines = wines.filter(wine => wine.type === 'RED').length;
  const whiteWines = wines.filter(wine => wine.type === 'WHITE').length;
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <HeroSection />
          
          {/* Featured Wines Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vini in Evidenza</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/collection')}
              >
                <Text style={styles.viewAllText}>Vedi tutti</Text>
                <ArrowRight size={16} color={Colors.dark.accent} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredWinesContainer}
            >
              {featuredWines.map((wine) => (
                <TouchableOpacity 
                  key={wine.id} 
                  style={styles.featuredWineCard}
                  onPress={() => router.push('/collection')}
                >
                  <Image 
                    source={{ uri: wine.image }} 
                    style={styles.featuredWineImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.featuredWineOverlay}>
                    <View style={styles.featuredWineTag}>
                      <Text style={styles.featuredWineTagText}>{wine.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <View style={styles.featuredWineInfo}>
                    <Text style={styles.featuredWineName}>{wine.name}</Text>
                    <Text style={styles.featuredWineRegion}>{wine.region}, {wine.year}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>La Nostra Filosofia</Text>
            <Text style={styles.aboutText}>
              dBarrique è nato dalla passione per il vino e dalla necessità di organizzare una collezione personale in modo elegante e funzionale.
            </Text>
            <Text style={styles.aboutText}>
              La nostra app ti permette di catalogare i tuoi vini, tenere traccia delle tue degustazioni e scoprire nuove etichette da aggiungere alla tua cantina.
            </Text>
            
            <View style={styles.featureCards}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Wine size={24} color={Colors.dark.accent} />
                </View>
                <Text style={styles.featureTitle}>Collezione</Text>
                <Text style={styles.featureDescription}>
                  Cataloga i tuoi vini con dettagli completi e valutazioni personali
                </Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <BarChart size={24} color={Colors.dark.accent} />
                </View>
                <Text style={styles.featureTitle}>Statistiche</Text>
                <Text style={styles.featureDescription}>
                  Visualizza dati e grafici sulla tua collezione di vini
                </Text>
              </View>
              
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Users size={24} color={Colors.dark.accent} />
                </View>
                <Text style={styles.featureTitle}>Comunità</Text>
                <Text style={styles.featureDescription}>
                  Connettiti con altri appassionati e condividi le tue scoperte
                </Text>
              </View>
            </View>
          </View>
          
          {/* Stats Section */}
          <View style={[styles.section, styles.statsSection]}>
            <Text style={styles.sectionTitle}>La Tua Collezione</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalWines}</Text>
                <Text style={styles.statLabel}>Vini Totali</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{averageRating}</Text>
                <Text style={styles.statLabel}>Valutazione Media</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{redWines}</Text>
                <Text style={styles.statLabel}>Vini Rossi</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{whiteWines}</Text>
                <Text style={styles.statLabel}>Vini Bianchi</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.viewDashboardButton}
              onPress={() => router.push('/dashboard')}
            >
              <Text style={styles.viewDashboardText}>Visualizza Dashboard</Text>
            </TouchableOpacity>
          </View>
          
          {/* Join Community Section */}
          <View style={[styles.section, styles.joinSection]}>
            <Text style={styles.joinTitle}>Unisciti alla Comunità</Text>
            <Text style={styles.joinSubtitle}>
              Connettiti con altri appassionati di vino, condividi le tue esperienze e scopri nuove etichette.
            </Text>
            
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={() => router.push('/wine-network')}
            >
              <Text style={styles.joinButtonText}>Esplora la Community</Text>
            </TouchableOpacity>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLogoContainer}>
              <Wine size={24} color={Colors.dark.accent} />
              <Text style={styles.footerLogo}>
                <Text style={styles.footerLogoD}>d</Text>
                <Text style={styles.footerLogoBarrique}>Barrique</Text>
              </Text>
            </View>
            
            <Text style={styles.footerText}>
              © 2025 dBarrique. Tutti i diritti riservati.
            </Text>
            <Text style={styles.footerTagline}>
              Progettato con passione per gli amanti del vino.
            </Text>
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
  section: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.dark.accent,
    marginRight: 4,
    fontSize: 14,
  },
  featuredWinesContainer: {
    paddingRight: 20,
  },
  featuredWineCard: {
    width: 200,
    height: 280,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.dark.card,
  },
  featuredWineImage: {
    width: '100%',
    height: 200,
  },
  featuredWineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  featuredWineTag: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  featuredWineTagText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  featuredWineInfo: {
    padding: 12,
  },
  featuredWineName: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  featuredWineRegion: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  aboutText: {
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  featureCard: {
    width: width > 700 ? '30%' : width > 500 ? '48%' : '100%',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(178, 34, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  featureDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
    lineHeight: 20,
  },
  statsSection: {
    backgroundColor: '#121212',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: width > 700 ? '22%' : '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.dark.accent,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  viewDashboardButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 16,
  },
  viewDashboardText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  joinSection: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  joinTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  joinSubtitle: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 32,
    lineHeight: 24,
  },
  joinButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  joinButtonText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLogo: {
    fontSize: 24,
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
  footerText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  footerTagline: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
});