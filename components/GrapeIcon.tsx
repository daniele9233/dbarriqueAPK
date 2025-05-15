import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function GrapeIcon({ size = 60 }) {
  const grapeSize = size / 6;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Top row */}
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: 0, left: size/2 - grapeSize/2 }]} />
      
      {/* Second row */}
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*0.8, left: size/2 - grapeSize*1.5 }]} />
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*0.8, left: size/2 + grapeSize*0.5 }]} />
      
      {/* Third row */}
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*1.8, left: size/2 - grapeSize*2.2 }]} />
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*1.8, left: size/2 - grapeSize*0.5 }]} />
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*1.8, left: size/2 + grapeSize*1.2 }]} />
      
      {/* Fourth row */}
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*2.8, left: size/2 - grapeSize*1.5 }]} />
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*2.8, left: size/2 + grapeSize*0.5 }]} />
      
      {/* Fifth row */}
      <View style={[styles.grape, { width: grapeSize, height: grapeSize, top: grapeSize*3.8, left: size/2 - grapeSize*0.5 }]} />
      
      {/* Stem */}
      <View style={[styles.stem, { 
        top: -grapeSize*0.5, 
        left: size/2, 
        width: grapeSize*0.3, 
        height: grapeSize*1.2,
        transform: [{ rotate: '15deg' }]
      }]} />
      
      {/* Leaf */}
      <View style={[styles.leaf, { 
        top: -grapeSize*1.2, 
        left: size/2 + grapeSize*0.8, 
        width: grapeSize*2.5, 
        height: grapeSize*2,
        transform: [{ rotate: '30deg' }]
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  grape: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: Colors.dark.accent,
  },
  stem: {
    position: 'absolute',
    backgroundColor: '#4a6741', // Green stem color
  },
  leaf: {
    position: 'absolute',
    backgroundColor: '#4a6741', // Green leaf color
    borderRadius: 100,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  }
});