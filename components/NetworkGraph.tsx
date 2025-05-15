import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated, Platform, TouchableOpacity, Text } from 'react-native';
import { GrapeNetwork, GrapeNode, Grape, GrapeLink } from '@/types/grape';
import { grapes } from '@/mocks/grapes';
import Svg, { Circle, Line, G, Text as SvgText, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import Colors from '@/constants/colors';
import { Play } from 'lucide-react-native';

interface NetworkGraphProps {
  network: GrapeNetwork;
  selectedGrapes: string[];
  selectedRegions: string[];
  selectedCharacteristics: string[];
  onSelectNode: (grape: Grape) => void;
}

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 768;
const GRAPH_WIDTH = isSmallScreen ? width - 40 : width > 600 ? width * 0.7 : width;
const GRAPH_HEIGHT = isSmallScreen ? width * 0.9 : height * 0.7;

// Wine bottle path for all wine types
const wineBottlePath = "M16,5V4c0-1.1-0.9-2-2-2h-4C8.9,2,8,2.9,8,4v1C8,5,8,5,8,5v1h8V5C16,5,16,5,16,5z M10,4h4v1h-4V4z M15,7H9v13 c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2V7z";

export default function NetworkGraph({ network, selectedGrapes, selectedRegions, selectedCharacteristics, onSelectNode }: NetworkGraphProps) {
  const [nodes, setNodes] = useState<GrapeNode[]>([]);
  const [links, setLinks] = useState<GrapeLink[]>(network.links);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isStabilized, setIsStabilized] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const stabilizationCounterRef = useRef(0);
  const [circleLayout, setCircleLayout] = useState(true);
  const isDraggingRef = useRef(false);
  const svgRef = useRef(null);
  const previousNodesCountRef = useRef(0);
  
  // Animation scale values for nodes
  const scaleValues = useRef(network.nodes.map(() => new Animated.Value(1)));
  
  // Initialize nodes with fixed positions in a circle layout
  useEffect(() => {
    arrangeNodesInCircle();
  }, [network.nodes]);
  
  // Filter nodes based on selected filters
  useEffect(() => {
    console.log("Filter changed - Grapes:", selectedGrapes.length, "Regions:", selectedRegions.length, "Characteristics:", selectedCharacteristics.length);
    
    let filteredNodes = [...network.nodes];
    
    // If specific grapes are selected, only show those
    if (selectedGrapes.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        selectedGrapes.includes(node.id)
      );
    } else {
      // Apply region filter if any regions are selected
      if (selectedRegions.length > 0) {
        filteredNodes = filteredNodes.filter(node => {
          const grape = grapes.find(g => g.id === node.id);
          return grape && grape.region.some(region => selectedRegions.includes(region));
        });
      }
      
      // Apply characteristic filter if any characteristics are selected
      if (selectedCharacteristics.length > 0) {
        filteredNodes = filteredNodes.filter(node => {
          const grape = grapes.find(g => g.id === node.id);
          return grape && grape.characteristics.some(char => selectedCharacteristics.includes(char));
        });
      }
    }
    
    console.log("Filtered nodes count:", filteredNodes.length);
    
    // Get IDs of filtered nodes
    const nodeIds = filteredNodes.map(node => node.id);
    
    // Filter links to only include connections between visible nodes
    const filteredLinks = network.links.filter(link => 
      nodeIds.includes(link.source) && nodeIds.includes(link.target)
    );
    
    // Check if number of nodes has changed significantly
    const shouldReorganize = Math.abs(filteredNodes.length - previousNodesCountRef.current) > 2;
    previousNodesCountRef.current = filteredNodes.length;
    
    if (shouldReorganize) {
      // Arrange nodes in a circle if the number of nodes changed significantly
      const centerX = GRAPH_WIDTH / 2;
      const centerY = GRAPH_HEIGHT / 2;
      const radius = Math.min(GRAPH_WIDTH, GRAPH_HEIGHT) * 0.35;
      
      filteredNodes = filteredNodes.map((node, index) => {
        const angle = (index / filteredNodes.length) * 2 * Math.PI;
        return {
          ...node,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          vx: 0,
          vy: 0,
          fixed: false
        };
      });
    } else {
      // Update nodes with positions from current nodes state to maintain layout
      filteredNodes = filteredNodes.map(node => {
        const existingNode = nodes.find(n => n.id === node.id);
        if (existingNode) {
          return {
            ...node,
            x: existingNode.x,
            y: existingNode.y,
            vx: existingNode.vx,
            vy: existingNode.vy,
            fixed: existingNode.fixed
          };
        }
        // For new nodes, position them near the center
        return {
          ...node,
          x: GRAPH_WIDTH / 2 + (Math.random() - 0.5) * 100,
          y: GRAPH_HEIGHT / 2 + (Math.random() - 0.5) * 100,
          vx: 0,
          vy: 0,
          fixed: false
        };
      });
    }
    
    setNodes(filteredNodes);
    setLinks(filteredLinks);
    
    // Start simulation if nodes changed significantly
    if (shouldReorganize) {
      setIsSimulationRunning(true);
      setIsStabilized(false);
      stabilizationCounterRef.current = 0;
    }
  }, [selectedGrapes, selectedRegions, selectedCharacteristics, network]);
  
  // Arrange nodes in a perfect circle
  const arrangeNodesInCircle = () => {
    const centerX = GRAPH_WIDTH / 2;
    const centerY = GRAPH_HEIGHT / 2;
    const radius = Math.min(GRAPH_WIDTH, GRAPH_HEIGHT) * 0.35;
    
    setNodes(prevNodes => {
      const nodesWithPositions = network.nodes.map((node, index) => {
        const angle = (index / network.nodes.length) * 2 * Math.PI;
        return {
          ...node,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          vx: 0,
          vy: 0,
          fixed: false
        };
      });
      return nodesWithPositions;
    });
    
    setIsSimulationRunning(false);
    setIsStabilized(true);
    setCircleLayout(true);
    
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Simple force-directed layout simulation with stabilization
  useEffect(() => {
    if (!isSimulationRunning) return;
    
    const REPULSION = 1000; // Increased repulsion force
    const ATTRACTION = 0.02;
    const DAMPING = 0.8;
    const CENTER_GRAVITY = 0.03; // Increased center gravity
    const STABILIZATION_THRESHOLD = 0.1;
    const MAX_ITERATIONS = 100;
    
    const centerX = GRAPH_WIDTH / 2;
    const centerY = GRAPH_HEIGHT / 2;
    
    const updatePositions = () => {
      let totalMovement = 0;
      
      const updatedNodes = [...nodes];
      
      updatedNodes.forEach((node, i) => {
        if (node.fixed) return;
        
        let fx = 0;
        let fy = 0;
        
        // Repulsion between nodes
        updatedNodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 1) {
              const force = REPULSION / (distance * distance);
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            }
          }
        });
        
        // Attraction along links
        links.forEach(link => {
          if (link.source === node.id || link.target === node.id) {
            const otherNodeId = link.source === node.id ? link.target : link.source;
            const otherNode = updatedNodes.find(n => n.id === otherNodeId);
            
            if (otherNode) {
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                fx -= dx * ATTRACTION * link.strength;
                fy -= dy * ATTRACTION * link.strength;
              }
            }
          }
        });
        
        // Center gravity force
        fx += (centerX - node.x) * CENTER_GRAVITY;
        fy += (centerY - node.y) * CENTER_GRAVITY;
        
        // Update velocity and position
        node.vx = (node.vx + fx) * DAMPING;
        node.vy = (node.vy + fy) * DAMPING;
        
        totalMovement += Math.abs(node.vx) + Math.abs(node.vy);
        
        // Update position with boundary constraints
        node.x += node.vx;
        node.y += node.vy;
        
        // Keep nodes within bounds with padding
        const padding = node.radius * 2;
        node.x = Math.max(padding, Math.min(GRAPH_WIDTH - padding, node.x));
        node.y = Math.max(padding, Math.min(GRAPH_HEIGHT - padding, node.y));
      });
      
      if (totalMovement < STABILIZATION_THRESHOLD * nodes.length || stabilizationCounterRef.current > MAX_ITERATIONS) {
        setIsStabilized(true);
        setIsSimulationRunning(false);
        if (animationRef.current) {
          clearInterval(animationRef.current);
          animationRef.current = null;
        }
      } else {
        stabilizationCounterRef.current += 1;
      }
      
      setNodes(updatedNodes);
    };
    
    animationRef.current = setInterval(updatePositions, 16);
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [nodes, links, isSimulationRunning]);
  
  const handleNodeSelect = (nodeId: string) => {
    if (isDraggingRef.current) return;
    
    console.log("Node selected:", nodeId);
    
    const grape = grapes.find(g => g.id === nodeId);
    if (grape) {
      console.log("Found grape:", grape.name);
      
      onSelectNode(grape);
      setHoveredNode(nodeId);
      
      const index = nodes.findIndex(node => node.id === nodeId);
      if (index !== -1) {
        Animated.sequence([
          Animated.timing(scaleValues.current[index], {
            toValue: 1.5,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scaleValues.current[index], {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: Platform.OS !== 'web',
          })
        ]).start();
      }
    }
  };
  
  const getNodeRadius = (radius: number) => {
    return isSmallScreen ? radius * 0.7 : radius;
  };
  
  const getNodeLabel = (node: GrapeNode) => {
    if (isSmallScreen) {
      return node.id === hoveredNode ? node.name : '';
    }
    return node.name;
  };
  
  const getWineType = (color: string): 'red' | 'white' | 'rosé' | 'sparkling' => {
    if (color === '#b22222') return 'red';
    if (color === '#f5f5dc') return 'white';
    if (color === '#ffb6c1') return 'rosé';
    return 'sparkling';
  };
  
  const getGradientId = (nodeId: string, wineType: 'red' | 'white' | 'rosé' | 'sparkling') => {
    return `gradient-${nodeId}-${wineType}`;
  };
  
  const renderGradientStops = (wineType: 'red' | 'white' | 'rosé' | 'sparkling') => {
    switch (wineType) {
      case 'red':
        return [
          <Stop key="red-0" offset="0%" stopColor="#ff5252" stopOpacity="0.9" />,
          <Stop key="red-1" offset="70%" stopColor="#b22222" stopOpacity="0.9" />,
          <Stop key="red-2" offset="100%" stopColor="#8b0000" stopOpacity="0.9" />
        ];
      case 'white':
        return [
          <Stop key="white-0" offset="0%" stopColor="#fffff0" stopOpacity="0.9" />,
          <Stop key="white-1" offset="70%" stopColor="#f5f5dc" stopOpacity="0.9" />,
          <Stop key="white-2" offset="100%" stopColor="#e6e6c8" stopOpacity="0.9" />
        ];
      case 'rosé':
        return [
          <Stop key="rose-0" offset="0%" stopColor="#ffc0cb" stopOpacity="0.9" />,
          <Stop key="rose-1" offset="70%" stopColor="#ffb6c1" stopOpacity="0.9" />,
          <Stop key="rose-2" offset="100%" stopColor="#ff9aa2" stopOpacity="0.9" />
        ];
      case 'sparkling':
        return [
          <Stop key="sparkling-0" offset="0%" stopColor="#add8e6" stopOpacity="0.9" />,
          <Stop key="sparkling-1" offset="70%" stopColor="#87ceeb" stopOpacity="0.9" />,
          <Stop key="sparkling-2" offset="100%" stopColor="#5f9ea0" stopOpacity="0.9" />
        ];
    }
  };
  
  // Check if we have any nodes to display
  const hasNodesVisible = nodes.length > 0;
  
  return (
    <View style={[styles.container, { width: GRAPH_WIDTH, height: GRAPH_HEIGHT }]}>
      <TouchableOpacity 
        style={styles.simulationToggle}
        onPress={arrangeNodesInCircle}
      >
        <Play size={16} color={Colors.dark.text} />
        <Text style={styles.simulationToggleText}>
          Riorganizza
        </Text>
      </TouchableOpacity>
      
      {!hasNodesVisible && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Nessun vitigno corrisponde ai filtri selezionati
          </Text>
          <Text style={styles.noResultsSubText}>
            Prova a modificare i filtri per visualizzare i risultati
          </Text>
        </View>
      )}
      
      {hasNodesVisible && (
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={styles.svg} ref={svgRef}>
          <Defs>
            {nodes.map(node => {
              const wineType = getWineType(node.color);
              return (
                <RadialGradient
                  key={`gradient-${node.id}`}
                  id={getGradientId(node.id, wineType)}
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  {renderGradientStops(wineType)}
                </RadialGradient>
              );
            })}
          </Defs>
          
          {/* Links */}
          <G>
            {links.map((link, index) => {
              const sourceNode = nodes.find(node => node.id === link.source);
              const targetNode = nodes.find(node => node.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourceWineType = getWineType(sourceNode.color);
              const targetWineType = getWineType(targetNode.color);
              
              let linkColor = "rgba(255, 255, 255, 0.2)";
              if (sourceWineType === targetWineType) {
                if (sourceWineType === 'red') linkColor = "rgba(178, 34, 34, 0.3)";
                else if (sourceWineType === 'white') linkColor = "rgba(245, 245, 220, 0.3)";
                else if (sourceWineType === 'rosé') linkColor = "rgba(255, 182, 193, 0.3)";
                else linkColor = "rgba(135, 206, 235, 0.3)";
              }
              
              return (
                <Line
                  key={`link-${index}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={linkColor}
                  strokeWidth={link.strength * (isSmallScreen ? 1 : 1.5)}
                />
              );
            })}
          </G>
          
          {/* Nodes */}
          <G>
            {nodes.map((node, index) => {
              const isHovered = node.id === hoveredNode;
              const adjustedRadius = getNodeRadius(node.radius);
              const nodeLabel = getNodeLabel(node);
              const wineType = getWineType(node.color);
              const gradientId = getGradientId(node.id, wineType);
              const isSelected = selectedGrapes.includes(node.id);
              
              // Scale factor for the icon
              const iconScale = adjustedRadius * 0.04;
              
              return (
                <G 
                  key={`node-${node.id}`}
                  onPress={() => handleNodeSelect(node.id)}
                >
                  {/* Outer glow for selected nodes */}
                  {isSelected && (
                    <Circle
                      cx={node.x}
                      cy={node.y}
                      r={adjustedRadius * 1.2}
                      fill="transparent"
                      stroke={wineType === 'red' ? "#ff5252" : 
                              wineType === 'white' ? "#fffff0" : 
                              wineType === 'rosé' ? "#ffc0cb" : "#add8e6"}
                      strokeWidth={2}
                      strokeOpacity={0.8}
                    />
                  )}
                  
                  {/* Main bubble with gradient */}
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r={adjustedRadius * (isHovered ? 1.1 : 1)}
                    fill={`url(#${gradientId})`}
                    stroke={isHovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"}
                    strokeWidth={isHovered ? 2 : 1}
                    onPress={() => handleNodeSelect(node.id)}
                  />
                  
                  {/* Wine bottle icon */}
                  <G 
                    transform={`translate(${node.x - adjustedRadius * 0.5}, ${node.y - adjustedRadius * 0.5}) scale(${adjustedRadius * 0.05})`}
                  >
                    <Path
                      d={wineBottlePath}
                      fill={wineType === 'red' ? "#8b0000" : 
                            wineType === 'white' ? "#e6e6c8" : 
                            wineType === 'rosé' ? "#ff9aa2" : "#5f9ea0"}
                      fillOpacity={0.9}
                    />
                  </G>
                  
                  {/* Node label */}
                  {nodeLabel && (
                    <SvgText
                      x={node.x}
                      y={node.y + adjustedRadius + 12}
                      fontSize={isHovered ? 12 : 10}
                      fontWeight={isHovered ? "bold" : "normal"}
                      fill={Colors.dark.text}
                      textAnchor="middle"
                      onPress={() => handleNodeSelect(node.id)}
                    >
                      {nodeLabel}
                    </SvgText>
                  )}
                  
                  {/* Small indicator for selected nodes */}
                  {isSelected && (
                    <Circle
                      cx={node.x + adjustedRadius * 0.7}
                      cy={node.y - adjustedRadius * 0.7}
                      r={adjustedRadius * 0.25}
                      fill="#ffffff"
                    />
                  )}
                </G>
              );
            })}
          </G>
        </Svg>
      )}
      
      <View style={styles.interactionHintContainer}>
        <Text style={styles.interactionHint}>
          Tocca o trascina i nodi per interagire
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  simulationToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  simulationToggleText: {
    color: Colors.dark.text,
    fontSize: 12,
    marginLeft: 4,
  },
  interactionHintContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  interactionHint: {
    color: Colors.dark.subtext,
    fontSize: 12,
    fontStyle: 'italic',
  },
  noResultsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
  }
});