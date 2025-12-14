import { create } from "zustand";

export const useSearchStore = create((set) => ({
  filters: {
    location: "",
    propertyType: "",
    feature: "",
    status: "",
  },

  recentSearches: [],
    interestedProperties: [],

  setFilters: (newFilters) =>
    set((state) => ({
      filters: newFilters,
    })),
  
    addInterestedProperty: (property) =>
      set((state) => ({
        interestedProperties: [property, ...state.interestedProperties].slice(0, 20), // keep last 20
      })),

  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [search, ...state.recentSearches].slice(0, 10), // keep last 10
    })),
}));
