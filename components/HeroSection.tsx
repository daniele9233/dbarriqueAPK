import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import { ChevronDown } from 'lucide-react-native';
import GrapeIcon from './GrapeIcon';
import AnimatedQuote from './AnimatedQuote';
import AnimatedQuoteNative from './AnimatedQuoteNative';

const { width, height } = Dimensions.get('window');

export default function HeroSection() {
  // Use the appropriate component based on platform
  const QuoteComponent = Platform.OS === 'web' ? AnimatedQuote : AnimatedQuoteNative;
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1507434965515-31d3ae681d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.logoContainer}>
            <GrapeIcon size={60} />
            <View style={styles.logoTextWrapper}>
              <Text style={styles.logoText}>
                <Text style={styles.logoD}>D</Text>
                <Text style={styles.logoBarrique}>Barrique</Text>
              </Text>
              <Text style={styles.logoSubtitle}>WINE COLLECTION</Text>
            </View>
          </View>
          
          <View style={styles.quoteContainer}>
            <QuoteComponent 
              quote="Aprire una bottiglia di vino è come aprire una porta sulla storia."
              author="— Ernest Hemingway"
            />
          </View>
          
          <View style={styles.scrollIndicator}>
            <ChevronDown size={24} color={Colors.dark.text} />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.9,
    width: width,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTextWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoText: {
    fontSize: width < 400 ? 40 : 60,
  },
  logoD: {
    color: Colors.dark.text,
    fontFamily: 'serif',
    fontSize: width < 400 ? 50 : 70,
    fontStyle: 'italic',
  },
  logoBarrique: {
    color: Colors.dark.accent,
    fontFamily: 'serif',
    fontSize: width < 400 ? 45 : 65,
    fontStyle: 'italic',
  },
  logoSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    letterSpacing: 4,
    marginTop: 8,
    fontFamily: 'sans-serif-light',
  },
  quoteContainer: {
    alignItems: 'center',
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
});