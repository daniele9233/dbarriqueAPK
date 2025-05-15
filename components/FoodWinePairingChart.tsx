import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const CHART_WIDTH = Math.min(width - 60, 500);
const CHART_HEIGHT = CHART_WIDTH;
const CENTER_X = CHART_WIDTH / 2;
const CENTER_Y = CHART_HEIGHT / 2;
const RADIUS = Math.min(CENTER_X, CENTER_Y) - 40;

// Wine types with their colors
const wineTypes = [
  { name: 'Rossi corposi', color: '#8B0000', radius: RADIUS },
  { name: 'Rossi medi', color: '#B22222', radius: RADIUS },
  { name: 'Rossi leggeri', color: '#CD5C5C', radius: RADIUS },
  { name: 'Bianchi corposi', color: '#DAA520', radius: RADIUS },
  { name: 'Bianchi medi', color: '#F0E68C', radius: RADIUS },
  { name: 'Bianchi leggeri', color: '#FFFACD', radius: RADIUS },
  { name: 'Rosati', color: '#FFB6C1', radius: RADIUS },
  { name: 'Spumanti', color: '#87CEEB', radius: RADIUS },
];

// Food categories with specific dishes
const foodCategories = [
  { 
    name: 'Carni rosse', 
    dishes: [
      'Bistecca alla fiorentina', 
      'Brasato al Barolo', 
      'Filetto al pepe verde'
    ],
    wines: ['Rossi corposi', 'Rossi medi'] 
  },
  { 
    name: 'Carni bianche', 
    dishes: [
      'Pollo arrosto', 
      'Tacchino ripieno', 
      'Coniglio alla cacciatora'
    ],
    wines: ['Rossi medi', 'Rossi leggeri', 'Bianchi corposi'] 
  },
  { 
    name: 'Pesce', 
    dishes: [
      'Branzino al forno', 
      'Salmone alla griglia', 
      'Tonno scottato'
    ],
    wines: ['Bianchi medi', 'Bianchi leggeri', 'Rosati'] 
  },
  { 
    name: 'Frutti di mare', 
    dishes: [
      'Risotto ai frutti di mare', 
      'Spaghetti alle vongole', 
      'Cozze alla marinara'
    ],
    wines: ['Bianchi leggeri', 'Spumanti'] 
  },
  { 
    name: 'Formaggi stagionati', 
    dishes: [
      'Parmigiano Reggiano', 
      'Pecorino Romano', 
      'Gorgonzola piccante'
    ],
    wines: ['Rossi corposi', 'Rossi medi'] 
  },
  { 
    name: 'Formaggi freschi', 
    dishes: [
      'Mozzarella di bufala', 
      'Ricotta', 
      'Stracchino'
    ],
    wines: ['Bianchi medi', 'Rosati'] 
  },
  { 
    name: 'Pasta', 
    dishes: [
      'Pasta al ragù', 
      'Carbonara', 
      'Pasta al pesto'
    ],
    wines: ['Rossi medi', 'Bianchi corposi'] 
  },
  { 
    name: 'Pizza', 
    dishes: [
      'Margherita', 
      'Quattro stagioni', 
      'Diavola'
    ],
    wines: ['Rossi medi', 'Rossi leggeri'] 
  },
  { 
    name: 'Dolci', 
    dishes: [
      'Tiramisù', 
      'Panna cotta', 
      'Cannoli siciliani'
    ],
    wines: ['Spumanti', 'Bianchi corposi'] 
  },
  { 
    name: 'Verdure', 
    dishes: [
      'Melanzane alla parmigiana', 
      'Peperoni ripieni', 
      'Insalata caprese'
    ],
    wines: ['Bianchi medi', 'Rosati'] 
  },
];

// Define types for the chart
interface WinePosition {
  name: string;
  color: string;
  radius: number;
  x: number;
  y: number;
  angle: number;
}

interface FoodPosition {
  name: string;
  dishes: string[];
  wines: string[];
  x: number;
  y: number;
  angle: number;
}

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}

interface FoodWinePairingChartProps {
  onSelectFood?: (food: string) => void;
}

export default function FoodWinePairingChart({ onSelectFood }: FoodWinePairingChartProps) {
  const [selectedFood, setSelectedFood] = useState<number | null>(null);
  const [selectedWine, setSelectedWine] = useState<string | null>(null);
  
  // Calculate positions for wine types in a circle
  const winePositions: WinePosition[] = wineTypes.map((wine, index) => {
    const angle = (index / wineTypes.length) * 2 * Math.PI;
    return {
      ...wine,
      x: CENTER_X + wine.radius * Math.cos(angle),
      y: CENTER_Y + wine.radius * Math.sin(angle),
      angle,
    };
  });
  
  // Calculate positions for food categories (inner circle)
  const foodPositions: FoodPosition[] = foodCategories.map((food, index) => {
    const angle = (index / foodCategories.length) * 2 * Math.PI;
    const innerRadius = RADIUS * 0.5;
    return {
      ...food,
      x: CENTER_X + innerRadius * Math.cos(angle),
      y: CENTER_Y + innerRadius * Math.sin(angle),
      angle,
    };
  });
  
  // Create connections between food and wine
  const connections: Connection[] = [];
  
  foodPositions.forEach((food, foodIndex) => {
    // If a food is selected, only show its connections
    if (selectedFood !== null && selectedFood !== foodIndex) {
      return;
    }
    
    food.wines.forEach(wineName => {
      const wine = winePositions.find(w => w.name === wineName);
      // If a wine is selected, only show its connections
      if (selectedWine !== null && wine?.name !== selectedWine) {
        return;
      }
      
      if (wine) {
        connections.push({
          from: { x: food.x, y: food.y },
          to: { x: wine.x, y: wine.y },
          color: wine.color,
        });
      }
    });
  });
  
  const handleFoodClick = (index: number) => {
    // If already selected, deselect
    if (selectedFood === index) {
      setSelectedFood(null);
      if (onSelectFood) onSelectFood('');
    } else {
      setSelectedFood(index);
      // Call the parent component's callback with the selected food category
      if (onSelectFood) onSelectFood(foodCategories[index].name);
    }
    setSelectedWine(null); // Reset wine selection when food is clicked
  };
  
  const handleWineClick = (wineName: string) => {
    setSelectedWine(selectedWine === wineName ? null : wineName);
    setSelectedFood(null); // Reset food selection when wine is clicked
    if (onSelectFood) onSelectFood('');
  };
  
  // Platform-specific event handlers
  const getCircleEventHandlers = (handler: () => void) => {
    if (Platform.OS === 'web') {
      return {
        onClick: handler,
        cursor: 'pointer'
      };
    } else {
      return {
        onPress: handler
      };
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mappa degli Abbinamenti</Text>
      
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        {/* Background circles */}
        <Circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS} fill="transparent" stroke="rgba(255,255,255,0.1)" />
        <Circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS * 0.5} fill="transparent" stroke="rgba(255,255,255,0.1)" />
        
        {/* Connections */}
        {connections.map((connection, index) => (
          <Line
            key={`connection-${index}`}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke={connection.color}
            strokeWidth={1.5}
            opacity={0.7}
          />
        ))}
        
        {/* Wine nodes */}
        {winePositions.map((wine, index) => {
          const isSelected = selectedWine === wine.name;
          const isHighlighted = selectedFood !== null && 
            foodCategories[selectedFood].wines.includes(wine.name);
          
          const circleEventHandlers = getCircleEventHandlers(() => handleWineClick(wine.name));
          
          return (
            <G key={`wine-${index}`}>
              <Circle
                cx={wine.x}
                cy={wine.y}
                r={isSelected || isHighlighted ? 15 : 12}
                fill={wine.color}
                opacity={isSelected || isHighlighted || selectedWine === null ? 1 : 0.5}
                {...circleEventHandlers}
              />
              <SvgText
                x={wine.x}
                y={wine.y + (wine.y > CENTER_Y ? 24 : -16)}
                fontSize="10"
                fill={Colors.dark.text}
                textAnchor="middle"
                opacity={isSelected || isHighlighted || selectedWine === null ? 1 : 0.5}
              >
                {wine.name}
              </SvgText>
            </G>
          );
        })}
        
        {/* Food nodes */}
        {foodPositions.map((food, index) => {
          const isSelected = selectedFood === index;
          const isHighlighted = selectedWine !== null && 
            food.wines.includes(selectedWine);
          
          const circleEventHandlers = getCircleEventHandlers(() => handleFoodClick(index));
          
          return (
            <G key={`food-${index}`}>
              <Circle
                cx={food.x}
                cy={food.y}
                r={isSelected || isHighlighted ? 12 : 8}
                fill={isSelected || isHighlighted ? "#555" : "#333"}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                opacity={isSelected || isHighlighted || selectedFood === null ? 1 : 0.5}
                {...circleEventHandlers}
              />
              <SvgText
                x={food.x}
                y={food.y}
                fontSize="8"
                fill={Colors.dark.text}
                textAnchor="middle"
                dy="3"
              >
                {index + 1}
              </SvgText>
            </G>
          );
        })}
      </Svg>
      
      <View style={styles.legendContainer}>
        {foodPositions.map((food, index) => (
          <TouchableOpacity 
            key={`legend-${index}`} 
            style={[
              styles.legendItem,
              selectedFood === index && styles.legendItemSelected
            ]}
            onPress={() => handleFoodClick(index)}
          >
            <View style={[
              styles.legendNumber,
              selectedFood === index && styles.legendNumberSelected
            ]}>
              <Text style={styles.legendNumberText}>{index + 1}</Text>
            </View>
            <Text style={[
              styles.legendText,
              selectedFood === index && styles.legendTextSelected
            ]}>
              {food.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.interactionHintContainer}>
        <Text style={styles.interactionHint}>
          Tocca un elemento per vedere le connessioni
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
    width: '45%',
    padding: 4,
    borderRadius: 4,
  },
  legendItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendNumber: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  legendNumberSelected: {
    backgroundColor: '#555',
    borderColor: 'rgba(255,255,255,0.8)',
  },
  legendNumberText: {
    color: Colors.dark.text,
    fontSize: 8,
  },
  legendText: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  legendTextSelected: {
    fontWeight: 'bold',
  },
  interactionHintContainer: {
    marginTop: 12,
  },
  interactionHint: {
    color: Colors.dark.subtext,
    fontSize: 12,
    fontStyle: 'italic',
  },
});