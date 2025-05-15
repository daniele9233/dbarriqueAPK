export type WineType = 'RED' | 'WHITE' | 'SPARKLING' | 'ROSÉ';

export interface Wine {
  id: string;
  name: string;
  region: string;
  country: string;
  year: number;
  type: WineType;
  rating: number; // 1-10
  image: string;
  details: {
    winery: string;
    type: string;
    grape: string;
    body: string;
    structure: string;
    tannins: string;
    sweetness: string;
    aroma: string;
    description: string;
    pairings: string;
    conservation: string;
  };
}