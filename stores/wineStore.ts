import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wine } from '@/types/wine';
import { wines as initialWines } from '@/mocks/wines';

interface WineStore {
  wines: Wine[];
  addWine: (wine: Wine) => void;
  updateWine: (wine: Wine) => void;
  removeWine: (id: string) => void;
}

export const useWineStore = create<WineStore>()(
  persist(
    (set) => ({
      wines: initialWines,
      addWine: (wine) => set((state) => ({ wines: [...state.wines, wine] })),
      updateWine: (updatedWine) =>
        set((state) => ({
          wines: state.wines.map((wine) =>
            wine.id === updatedWine.id ? updatedWine : wine
          ),
        })),
      removeWine: (id) =>
        set((state) => ({
          wines: state.wines.filter((wine) => wine.id !== id),
        })),
    }),
    {
      name: 'wine-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);