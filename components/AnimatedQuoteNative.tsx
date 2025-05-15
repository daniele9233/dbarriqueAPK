import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Platform } from 'react-native';
import Colors from '@/constants/colors';

interface AnimatedQuoteProps {
  quote: string;
  author: string;
}

export default function AnimatedQuoteNative({ quote, author }: AnimatedQuoteProps) {
  // Split the quote into individual characters
  const quoteChars = quote.split('');
  
  // Create animated values for each character
  const [opacityAnimations] = useState(() => 
    quoteChars.map(() => new Animated.Value(0))
  );
  
  const [translateAnimations] = useState(() => 
    quoteChars.map(() => new Animated.Value(20))
  );
  
  // Create animated value for author
  const [authorOpacity] = useState(new Animated.Value(0));
  const [authorTranslate] = useState(new Animated.Value(20));
  
  useEffect(() => {
    // Delay before starting animation
    const initialDelay = 500;
    
    // Create animation sequence for each character
    const animationSequence = quoteChars.map((_, index) => {
      const delay = initialDelay + index * 80; // 80ms between each character
      
      return Animated.parallel([
        Animated.timing(opacityAnimations[index], {
          toValue: 1,
          duration: 1000, // 1 second duration
          delay: delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(translateAnimations[index], {
          toValue: 0,
          duration: 1000, // 1 second duration
          delay: delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        })
      ]);
    });
    
    // Add author animation at the end
    const authorDelay = initialDelay + quoteChars.length * 80 + 600;
    
    const authorAnimation = Animated.parallel([
      Animated.timing(authorOpacity, {
        toValue: 0.7,
        duration: 1000,
        delay: authorDelay,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(authorTranslate, {
        toValue: 0,
        duration: 1000,
        delay: authorDelay,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      })
    ]);
    
    // Start all animations
    Animated.parallel([
      ...animationSequence,
      authorAnimation
    ]).start();
    
    // Cleanup function
    return () => {
      opacityAnimations.forEach(anim => anim.stopAnimation());
      translateAnimations.forEach(anim => anim.stopAnimation());
      authorOpacity.stopAnimation();
      authorTranslate.stopAnimation();
    };
  }, []);
  
  // On native platforms, we can't use CSS blur filter
  // We'll simulate the effect with opacity and translation
  
  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        {quoteChars.map((char, index) => {
          return (
            <Animated.Text
              key={index}
              style={[
                styles.quoteChar,
                {
                  opacity: opacityAnimations[index],
                  transform: [{ 
                    translateY: translateAnimations[index] 
                  }],
                  // Note: blur effect is not directly available in React Native
                  // We're simulating the effect with opacity and translation
                }
              ]}
            >
              {char}
            </Animated.Text>
          );
        })}
      </View>
      
      <Animated.Text
        style={[
          styles.author,
          {
            opacity: authorOpacity,
            transform: [{
              translateY: authorTranslate,
            }],
          }
        ]}
      >
        {author}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  quoteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quoteChar: {
    color: Colors.dark.text,
    fontSize: 24,
    fontFamily: 'serif',
    fontStyle: 'italic',
    lineHeight: 36,
  },
  author: {
    color: Colors.dark.subtext,
    fontSize: 16,
    fontFamily: 'serif',
    marginTop: 16,
  },
});