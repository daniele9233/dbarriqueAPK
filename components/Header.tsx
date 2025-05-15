import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';
import WineIcon from './WineIcon';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 600;

export default function Header() {
  const router = useRouter();
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
        <Text style={styles.logo}>
          <Text style={styles.logoD}>d</Text>
          <Text style={styles.logoBarrique}>Barrique</Text>
        </Text>
      </TouchableOpacity>
      
      {!isSmallScreen && (
        <View style={styles.nav}>
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.push('/')}
          >
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.push('/collection')}
          >
            <Text style={styles.navText}>Collection</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.push('/wine-network')}
          >
            <Text style={styles.navText}>Wine Network</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => router.push('/wine-bot')}
          >
            <Text style={styles.navText}>Wine Bot</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoD: {
    color: Colors.dark.text,
    fontFamily: 'serif',
    fontSize: 28,
    fontStyle: 'italic',
  },
  logoBarrique: {
    color: Colors.dark.accent,
    fontFamily: 'serif',
    fontSize: 26,
    fontStyle: 'italic',
  },
  nav: {
    flexDirection: 'row',
  },
  navItem: {
    marginLeft: 20,
  },
  navText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
});