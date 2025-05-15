import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { Wine, Send, Bot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FoodWinePairingChart from '@/components/FoodWinePairingChart';
import WinePairingCard from '@/components/WinePairingCard';
import { foodPairings } from '@/mocks/food-pairings';
import { useWineStore } from '@/stores/wineStore';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 768;

export default function WineBotScreen() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: 'Ciao! Sono il tuo sommelier virtuale. Dimmi cosa vorresti mangiare e ti suggerirò il vino perfetto dalla tua collezione.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string | null>(null);
  const [recommendedDishes, setRecommendedDishes] = useState<string[]>([]);
  const [recommendedWines, setRecommendedWines] = useState<string[]>([]);
  const [collectionMatches, setCollectionMatches] = useState<{wine: string, inCollection: boolean}[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const { wines: collectionWines } = useWineStore();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const chatScrollViewRef = useRef<ScrollView>(null);
  
  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatScrollViewRef.current) {
      setTimeout(() => {
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);
  
  // Scroll to recommendations when they appear
  useEffect(() => {
    if (showRecommendations && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 500, animated: true });
      }, 300);
    }
  }, [showRecommendations]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process the message and find wine recommendations
      const botResponse = generateWineRecommendation(userMessage);
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Mi dispiace, ho avuto un problema nel generare una risposta. Puoi riprovare?' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enhanced wine recommendation logic based on food keywords
  const generateWineRecommendation = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Check for food keywords from our expanded food pairings
    let matchedFoods: string[] = [];
    let matchedWines: string[] = [];
    
    // First, check for exact dish matches
    const foodPairings = [
      { food: 'bistecca', wines: ['Barolo', 'Brunello di Montalcino', 'Cabernet Sauvignon'] },
      { food: 'pesce', wines: ['Vermentino', 'Pinot Grigio', 'Sauvignon Blanc'] },
      { food: 'frutti di mare', wines: ['Vermentino', 'Falanghina', 'Prosecco'] },
      { food: 'pasta', wines: ['Chianti', 'Montepulciano d\'Abruzzo', 'Barbera'] },
      { food: 'risotto', wines: ['Chardonnay', 'Pinot Grigio', 'Soave'] },
      { food: 'pizza', wines: ['Chianti', 'Sangiovese', 'Montepulciano d\'Abruzzo'] },
      { food: 'formaggi', wines: ['Barolo', 'Amarone', 'Passito di Pantelleria'] },
      { food: 'dolci', wines: ['Moscato d\'Asti', 'Passito di Pantelleria', 'Vin Santo'] },
      { food: 'carne rossa', wines: ['Barolo', 'Brunello di Montalcino', 'Amarone'] },
      { food: 'carne bianca', wines: ['Chardonnay', 'Pinot Nero', 'Verdicchio'] },
      { food: 'verdure', wines: ['Sauvignon Blanc', 'Verdicchio', 'Pinot Grigio'] },
    ];
    
    foodPairings.forEach(pairing => {
      if (message.includes(pairing.food.toLowerCase())) {
        matchedFoods.push(pairing.food);
        matchedWines = [...matchedWines, ...pairing.wines];
      }
    });
    
    // Remove duplicates
    matchedFoods = [...new Set(matchedFoods)];
    matchedWines = [...new Set(matchedWines)];
    
    // If no specific food was mentioned, provide a generic response
    if (matchedWines.length === 0) {
      return `Non ho trovato un abbinamento specifico per "${userMessage}". Posso aiutarti meglio se mi dici che tipo di piatto stai preparando, ad esempio "bistecca alla fiorentina", "spaghetti alle vongole", "risotto ai funghi" o "tiramisù".`;
    }
    
    // Find the recommended wines in our collection
    const recommendedWines = collectionWines.filter(wine => 
      matchedWines.some(recommendedWine => 
        wine.name.toLowerCase().includes(recommendedWine.toLowerCase())
      )
    );
    
    if (recommendedWines.length === 0) {
      return `Per "${userMessage}" consiglierei ${matchedWines.join(' o ')}, ma non sembrano essere presenti nella tua collezione attuale.`;
    }
    
    // Format the response with wine details
    let response = `Per "${userMessage}" dalla tua collezione ti consiglio:

`;
    
    recommendedWines.forEach(wine => {
      response += `• ${wine.name} (${wine.year}) - ${wine.region}, ${wine.country}
`;
      response += `  ${wine.details.description.substring(0, 100)}...

`;
    });
    
    return response;
  };

  // Handle food category selection from the chart
  const handleFoodCategorySelect = (category: string) => {
    if (category === '') {
      setSelectedFoodCategory(null);
      setRecommendedDishes([]);
      setRecommendedWines([]);
      setCollectionMatches([]);
      setShowRecommendations(false);
      return;
    }
    
    setSelectedFoodCategory(category);
    
    // Find dishes and recommended wines for this category
    const foodCategory = foodPairings.filter(item => 
      item.category === category.split(' ')[0] && 
      item.food.toLowerCase().includes(category.toLowerCase())
    );
    
    if (foodCategory.length > 0) {
      // Get specific dishes for this category
      const dishes = foodCategory.map(item => item.food);
      setRecommendedDishes(dishes);
      
      // Get recommended wines for this category
      const wines = [...new Set(foodCategory.flatMap(item => item.wines))];
      setRecommendedWines(wines);
      
      // Check which recommended wines are in the user's collection
      const matches = wines.map(wine => {
        const inCollection = collectionWines.some(
          collectionWine => collectionWine.name.includes(wine)
        );
        return { wine, inCollection };
      });
      
      setCollectionMatches(matches);
      setShowRecommendations(true);
      
      // Auto-scroll to show the recommendation card
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 500, animated: true });
      }, 300);
    } else {
      setRecommendedDishes([]);
      setRecommendedWines([]);
      setCollectionMatches([]);
      setShowRecommendations(false);
    }
  };
  
  // Handle clicking on a wine pairing card
  const handleWinePairingCardPress = (food: string) => {
    // Set the message to the selected food
    setMessage(food);
    
    // Auto-scroll to the chat section
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 1000, animated: true });
    }, 300);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <SafeAreaView style={styles.safeArea}>
        <Header />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.mainScrollView}
            contentContainerStyle={styles.mainScrollViewContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Wine Bot</Text>
                <Text style={styles.subtitle}>Il tuo sommelier personale</Text>
              </View>
              
              <View style={styles.chartContainer}>
                <FoodWinePairingChart onSelectFood={handleFoodCategorySelect} />
              </View>
              
              {/* Recommended wines section */}
              {showRecommendations && (
                <View style={styles.recommendationsContainer}>
                  <LinearGradient
                    colors={['rgba(178, 34, 34, 0.2)', 'rgba(0, 0, 0, 0)']}
                    style={styles.recommendationsGradient}
                  >
                    <Text style={styles.recommendationsTitle}>
                      Abbinamenti consigliati per {selectedFoodCategory}
                    </Text>
                    
                    {collectionMatches.length > 0 && (
                      <View style={styles.collectionSummary}>
                        <Text style={styles.collectionSummaryText}>
                          {collectionMatches.filter(m => m.inCollection).length} vini disponibili nella tua collezione
                        </Text>
                      </View>
                    )}
                    
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.recommendationsScrollContent}
                    >
                      {recommendedDishes.map((dish, index) => {
                        // Find the matching food pairing
                        const pairing = foodPairings.find(p => p.food === dish);
                        if (!pairing) return null;
                        
                        // Check which wines for this dish are in the collection
                        const dishWineMatches = pairing.wines.map(wine => {
                          const inCollection = collectionWines.some(
                            collectionWine => collectionWine.name.includes(wine)
                          );
                          return { wine, inCollection };
                        });
                        
                        const hasMatchInCollection = dishWineMatches.some(m => m.inCollection);
                        
                        return (
                          <WinePairingCard
                            key={index}
                            food={dish}
                            wines={pairing.wines}
                            wineMatches={dishWineMatches}
                            description={pairing.description}
                            onPress={() => handleWinePairingCardPress(dish)}
                            hasMatchInCollection={hasMatchInCollection}
                          />
                        );
                      })}
                    </ScrollView>
                  </LinearGradient>
                </View>
              )}
              
              <View style={styles.chatContainer}>
                <LinearGradient
                  colors={['rgba(178, 34, 34, 0.1)', 'rgba(0, 0, 0, 0)']}
                  style={styles.chatHeader}
                >
                  <View style={styles.botIconContainer}>
                    <Bot size={20} color={Colors.dark.accent} />
                  </View>
                  <Text style={styles.chatTitle}>Chiedi al Sommelier</Text>
                </LinearGradient>
                
                <ScrollView 
                  ref={chatScrollViewRef}
                  style={styles.messagesContainer}
                  contentContainerStyle={styles.messagesContent}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {chatHistory.map((msg, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.messageBubble,
                        msg.role === 'user' ? styles.userBubble : styles.botBubble
                      ]}
                    >
                      {msg.role === 'assistant' ? (
                        <View style={styles.botAvatarContainer}>
                          <Bot size={16} color={Colors.dark.text} />
                        </View>
                      ) : null}
                      <View style={[
                        styles.messageContent,
                        msg.role === 'user' ? styles.userMessageContent : styles.botMessageContent
                      ]}>
                        <Text style={styles.messageText}>{msg.content}</Text>
                      </View>
                    </View>
                  ))}
                  
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.botAvatarContainer}>
                        <Bot size={16} color={Colors.dark.text} />
                      </View>
                      <View style={styles.loadingBubble}>
                        <ActivityIndicator size="small" color={Colors.dark.accent} />
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Cosa vorresti mangiare oggi?"
                    placeholderTextColor={Colors.dark.subtext}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity 
                    style={[
                      styles.sendButton,
                      !message.trim() && styles.sendButtonDisabled
                    ]} 
                    onPress={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send size={20} color={Colors.dark.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollViewContent: {
    paddingBottom: 100, // Ensure there's space at the bottom
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  recommendationsContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(178, 34, 34, 0.3)',
  },
  recommendationsGradient: {
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  collectionSummary: {
    marginBottom: 16,
    backgroundColor: 'rgba(178, 34, 34, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  collectionSummaryText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationsScrollContent: {
    paddingBottom: 8,
  },
  chatContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 300, // Ensure minimum height for the chat container
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  botIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(178, 34, 34, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  messagesContainer: {
    maxHeight: 400, // Set a maximum height for the messages container
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  botBubble: {
    alignSelf: 'flex-start',
  },
  botAvatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(178, 34, 34, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '90%',
  },
  userMessageContent: {
    backgroundColor: Colors.dark.accent,
    borderBottomRightRadius: 4,
  },
  botMessageContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: Colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  loadingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.dark.text,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(178, 34, 34, 0.5)',
  },
});