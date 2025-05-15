import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function WineIcon({ size = 60 }) {
  const circleSize = size / 3;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { width: circleSize, height: circleSize, top: 0, left: 0 }]} />
      <View style={[styles.circle, { width: circleSize, height: circleSize, top: 0, right: 0 }]} />
      <View style={[styles.circle, { width: circleSize, height: circleSize, bottom: 0, left: 0 }]} />
      <View style={[styles.circle, { width: circleSize, height: circleSize, bottom: 0, right: 0 }]} />
      <View style={[styles.circle, { width: circleSize, height: circleSize, top: size/2 - circleSize/2, left: size/2 - circleSize/2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: Colors.dark.accent,
  },
});