export type GrapeCharacteristic = 
  | 'Tannico' 
  | 'Secco' 
  | 'Aromatico' 
  | 'Fruttato' 
  | 'Corposo' 
  | 'Acido' 
  | 'Minerale' 
  | 'Speziato' 
  | 'Floreale'
  | 'Morbido';

export type GrapeType = 
  | 'Nebbiolo' 
  | 'Sangiovese' 
  | 'Cabernet Sauvignon' 
  | 'Merlot' 
  | 'Syrah' 
  | 'Pinot Noir' 
  | 'Primitivo' 
  | 'Aglianico' 
  | 'Chardonnay' 
  | 'Sauvignon Blanc'
  | 'Barbera'
  | 'Dolcetto'
  | 'Corvina'
  | 'Garganega'
  | 'Vermentino'
  | 'Glera'
  | 'Trebbiano'
  | 'Montepulciano'
  | 'Nero d\'Avola'
  | 'Cannonau'
  | 'Cabernet Franc'
  | 'Rondinella'
  | 'Molinara'
  | 'Verdicchio'
  | 'Pinot Bianco'
  | 'Grenache';

export type WineColor = 'red' | 'white' | 'rosé' | 'sparkling';

export interface Grape {
  id: string;
  name: GrapeType;
  region: string[];
  characteristics: GrapeCharacteristic[];
  color: WineColor;
  relatedGrapes: GrapeType[];
  description: string;
  image?: string;
}

export interface GrapeNode {
  id: string;
  name: GrapeType;
  color: string;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fixed?: boolean;
}

export interface GrapeLink {
  source: string;
  target: string;
  strength: number;
}

export interface GrapeNetwork {
  nodes: GrapeNode[];
  links: GrapeLink[];
}