import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';

interface AnimatedQuoteProps {
  quote: string;
  author: string;
}

export default function AnimatedQuote({ quote, author }: AnimatedQuoteProps) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Split the quote into individual characters
  const quoteChars = quote.split('');
  
  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        {quoteChars.map((char, index) => (
          <Text
            key={index}
            style={[
              styles.quoteChar,
              {
                opacity: visible ? 1 : 0,
                transform: [{ 
                  translateY: visible ? 0 : 20 
                }],
                transitionProperty: 'opacity, transform, filter',
                transitionDuration: '1000ms',
                transitionTimingFunction: 'ease-in-out',
                transitionDelay: `${400 + index * 80}ms`,
                filter: visible ? 'blur(0px)' : 'blur(4px)',
              }
            ]}
          >
            {char}
          </Text>
        ))}
      </View>
      
      <Text
        style={[
          styles.author,
          {
            opacity: visible ? 0.7 : 0,
            transform: [{ 
              translateY: visible ? 0 : 20 
            }],
            transitionProperty: 'opacity, transform, filter',
            transitionDuration: '1000ms',
            transitionTimingFunction: 'ease-in-out',
            transitionDelay: `${quoteChars.length * 80 + 600}ms`,
            filter: visible ? 'blur(0px)' : 'blur(4px)',
          }
        ]}
      >
        {author}
      </Text>
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