import { Grape, GrapeNetwork, GrapeNode, GrapeLink } from '@/types/grape';

// Color palette for wine types
const wineColors = {
  red: '#b22222', // Wine red
  white: '#f5f5dc', // Beige
  rosé: '#ffb6c1', // Light pink
  sparkling: '#87ceeb', // Sky blue
};

// Grape varieties data
export const grapes: Grape[] = [
  {
    id: '1',
    name: 'Nebbiolo',
    region: ['Piemonte', 'Lombardia'],
    characteristics: ['Tannico', 'Secco', 'Corposo', 'Floreale'],
    color: 'red',
    relatedGrapes: ['Barbera', 'Dolcetto'],
    description: 'Vitigno a bacca rossa originario del Piemonte, è la base di vini prestigiosi come Barolo e Barbaresco. Produce vini strutturati, tannici, con aromi di rosa, ciliegia e tartufo.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Sangiovese',
    region: ['Toscana', 'Emilia-Romagna', 'Umbria'],
    characteristics: ['Tannico', 'Secco', 'Fruttato', 'Acido'],
    color: 'red',
    relatedGrapes: ['Montepulciano', 'Cannonau'],
    description: 'Vitigno a bacca rossa diffuso in tutta l\'Italia centrale, è la base del Chianti e del Brunello di Montalcino. Produce vini con aromi di ciliegia, prugna e spezie.',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Cabernet Sauvignon',
    region: ['Toscana', 'Veneto', 'Friuli'],
    characteristics: ['Tannico', 'Corposo', 'Speziato'],
    color: 'red',
    relatedGrapes: ['Merlot', 'Syrah'],
    description: 'Vitigno internazionale a bacca rossa, è diffuso in tutto il mondo. In Italia è utilizzato in blend per i Super Tuscan. Produce vini strutturati con aromi di ribes nero, peperone e cedro.',
    image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Merlot',
    region: ['Veneto', 'Friuli', 'Toscana'],
    characteristics: ['Fruttato', 'Corposo', 'Morbido'],
    color: 'red',
    relatedGrapes: ['Cabernet Sauvignon', 'Cabernet Franc'],
    description: 'Vitigno a bacca rossa originario della Francia, in Italia è diffuso soprattutto nel Nord-Est. Produce vini morbidi e rotondi con aromi di prugna, ciliegia e spezie dolci.',
    image: 'https://images.unsplash.com/photo-1568213816046-0a1665a0b8b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'Syrah',
    region: ['Sicilia', 'Toscana', 'Lazio'],
    characteristics: ['Speziato', 'Corposo', 'Fruttato'],
    color: 'red',
    relatedGrapes: ['Nero d\'Avola', 'Primitivo'],
    description: 'Vitigno a bacca rossa originario della Francia, in Italia è coltivato soprattutto al Sud. Produce vini strutturati con aromi di pepe nero, frutti di bosco e olive nere.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    name: 'Pinot Noir',
    region: ['Alto Adige', 'Lombardia', 'Friuli'],
    characteristics: ['Fruttato', 'Floreale', 'Acido'],
    color: 'red',
    relatedGrapes: ['Nebbiolo', 'Corvina'],
    description: 'Vitigno a bacca rossa originario della Borgogna, in Italia è coltivato soprattutto nelle zone alpine. Produce vini eleganti con aromi di ciliegia, fragola e sottobosco.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    name: 'Primitivo',
    region: ['Puglia', 'Campania'],
    characteristics: ['Fruttato', 'Corposo', 'Speziato'],
    color: 'red',
    relatedGrapes: ['Syrah', 'Aglianico'],
    description: 'Vitigno a bacca rossa diffuso in Puglia, è geneticamente identico allo Zinfandel americano. Produce vini potenti e fruttati con aromi di prugna, ciliegia e pepe nero.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    name: 'Aglianico',
    region: ['Campania', 'Basilicata'],
    characteristics: ['Tannico', 'Corposo', 'Minerale'],
    color: 'red',
    relatedGrapes: ['Primitivo', 'Nero d\'Avola'],
    description: 'Vitigno a bacca rossa del Sud Italia, è la base del Taurasi e dell\'Aglianico del Vulture. Produce vini strutturati e longevi con aromi di frutti rossi, spezie e note minerali.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '9',
    name: 'Chardonnay',
    region: ['Trentino', 'Alto Adige', 'Friuli', 'Lombardia'],
    characteristics: ['Fruttato', 'Floreale', 'Minerale'],
    color: 'white',
    relatedGrapes: ['Sauvignon Blanc', 'Trebbiano'],
    description: 'Vitigno a bacca bianca originario della Borgogna, in Italia è diffuso soprattutto nel Nord. Produce vini versatili con aromi di mela, pera e agrumi, spesso affinati in legno.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '10',
    name: 'Sauvignon Blanc',
    region: ['Friuli', 'Alto Adige', 'Trentino'],
    characteristics: ['Aromatico', 'Acido', 'Fruttato'],
    color: 'white',
    relatedGrapes: ['Chardonnay', 'Vermentino'],
    description: 'Vitigno a bacca bianca originario della Loira, in Italia è coltivato soprattutto nel Nord-Est. Produce vini aromatici con note di bosso, frutta tropicale e agrumi.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '11',
    name: 'Barbera',
    region: ['Piemonte', 'Lombardia', 'Emilia-Romagna'],
    characteristics: ['Acido', 'Fruttato', 'Tannico'],
    color: 'red',
    relatedGrapes: ['Nebbiolo', 'Dolcetto'],
    description: 'Vitigno a bacca rossa diffuso in Piemonte, produce vini con elevata acidità, aromi di ciliegia, prugna e spezie.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '12',
    name: 'Dolcetto',
    region: ['Piemonte'],
    characteristics: ['Fruttato', 'Tannico', 'Secco'],
    color: 'red',
    relatedGrapes: ['Nebbiolo', 'Barbera'],
    description: 'Vitigno a bacca rossa piemontese, produce vini di pronta beva con aromi di ciliegia, mora e mandorla.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '13',
    name: 'Corvina',
    region: ['Veneto'],
    characteristics: ['Fruttato', 'Acido', 'Speziato'],
    color: 'red',
    relatedGrapes: ['Rondinella', 'Molinara'],
    description: 'Vitigno a bacca rossa del Veneto, è la base dell\'Amarone e del Valpolicella. Produce vini con aromi di ciliegia, mandorla e spezie.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '14',
    name: 'Garganega',
    region: ['Veneto'],
    characteristics: ['Fruttato', 'Floreale', 'Minerale'],
    color: 'white',
    relatedGrapes: ['Trebbiano', 'Verdicchio'],
    description: 'Vitigno a bacca bianca del Veneto, è la base del Soave. Produce vini freschi con aromi di fiori bianchi, mela e mandorla.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '15',
    name: 'Vermentino',
    region: ['Sardegna', 'Liguria', 'Toscana'],
    characteristics: ['Aromatico', 'Minerale', 'Fruttato'],
    color: 'white',
    relatedGrapes: ['Sauvignon Blanc', 'Trebbiano'],
    description: 'Vitigno a bacca bianca diffuso nelle regioni costiere, produce vini freschi con aromi di agrumi, erbe aromatiche e note saline.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '16',
    name: 'Glera',
    region: ['Veneto', 'Friuli'],
    characteristics: ['Fruttato', 'Floreale', 'Acido'],
    color: 'sparkling',
    relatedGrapes: ['Chardonnay', 'Pinot Bianco'],
    description: 'Vitigno a bacca bianca del Nord-Est, è la base del Prosecco. Produce vini spumanti freschi con aromi di mela verde, pera e fiori.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '17',
    name: 'Trebbiano',
    region: ['Toscana', 'Umbria', 'Abruzzo', 'Lazio'],
    characteristics: ['Fruttato', 'Acido', 'Floreale'],
    color: 'white',
    relatedGrapes: ['Verdicchio', 'Garganega'],
    description: 'Vitigno a bacca bianca diffuso in tutta Italia, produce vini freschi e leggeri con aromi di mela, agrumi e fiori bianchi.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '18',
    name: 'Montepulciano',
    region: ['Abruzzo', 'Marche'],
    characteristics: ['Fruttato', 'Tannico', 'Corposo'],
    color: 'red',
    relatedGrapes: ['Sangiovese', 'Primitivo'],
    description: 'Vitigno a bacca rossa dell\'Italia centrale, produce vini strutturati con aromi di frutti rossi, spezie e liquirizia.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '19',
    name: 'Nero d\'Avola',
    region: ['Sicilia'],
    characteristics: ['Fruttato', 'Corposo', 'Speziato'],
    color: 'red',
    relatedGrapes: ['Syrah', 'Primitivo'],
    description: 'Vitigno a bacca rossa siciliano, produce vini strutturati con aromi di frutti rossi maturi, spezie e note balsamiche.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '20',
    name: 'Cannonau',
    region: ['Sardegna'],
    characteristics: ['Fruttato', 'Corposo', 'Speziato'],
    color: 'red',
    relatedGrapes: ['Grenache', 'Sangiovese'],
    description: 'Vitigno a bacca rossa sardo, geneticamente identico al Grenache, produce vini strutturati con aromi di frutti rossi, macchia mediterranea e spezie.',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee84a07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

// Helper function to get color based on wine type
export const getGrapeColor = (grape: Grape): string => {
  return wineColors[grape.color] || '#b22222';
};

// Generate network data from grapes
export const generateGrapeNetwork = (): GrapeNetwork => {
  const nodes: GrapeNode[] = [];
  
  // Create nodes with consistent sizes
  grapes.forEach(grape => {
    nodes.push({
      id: grape.id,
      name: grape.name,
      color: getGrapeColor(grape),
      radius: 20, // Fixed size for all nodes
      x: 0, // Will be set in circle layout
      y: 0,
      vx: 0,
      vy: 0
    });
  });
  
  // Create links based on related grapes
  const links: GrapeLink[] = [];
  
  // First pass: create all links
  grapes.forEach(grape => {
    grape.relatedGrapes.forEach(relatedGrapeName => {
      const relatedGrape = grapes.find(g => g.name === relatedGrapeName);
      if (relatedGrape) {
        // Check if this link already exists in reverse direction
        const existingLink = links.find(link => 
          (link.source === relatedGrape.id && link.target === grape.id) ||
          (link.source === grape.id && link.target === relatedGrape.id)
        );
        
        if (!existingLink) {
          links.push({
            source: grape.id,
            target: relatedGrape.id,
            strength: 1.0 // Fixed strength for all links
          });
        }
      }
    });
  });
  
  return { nodes, links };
};

// Generate a network with initial positions
export const grapeNetwork = generateGrapeNetwork();