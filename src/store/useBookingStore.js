import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useBookingStore = create(
  persist(
    (set) => ({
      bookings: [],
      activeZone: null,
      isSidebarOpen: false,
      activeTour: null,

      // Compare state
      compareTours: [],
      isCompareOpen: false,

      // Booking Actions
      addBooking: (booking) => set((state) => ({ 
        bookings: [...state.bookings, { ...booking, id: Date.now() }] 
      })),
      
      removeBooking: (id) => set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id)
      })),

      setActiveZone: (zone) => set({ activeZone: zone, isSidebarOpen: !!zone }),
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      closeSidebar: () => set({ isSidebarOpen: false, activeZone: null }),

      setActiveTour: (tour) => set({ activeTour: tour }),
      closeTourDrawer: () => set({ activeTour: null }),

      // Compare Actions
      toggleCompareTour: (tour) => set((state) => {
        const exists = state.compareTours.find(t => t.id === tour.id);
        if (exists) {
          return { compareTours: state.compareTours.filter(t => t.id !== tour.id) };
        }
        if (state.compareTours.length >= 3) return state; // Max 3
        return { compareTours: [...state.compareTours, tour] };
      }),
      openCompare: () => set({ isCompareOpen: true }),
      closeCompare: () => set({ isCompareOpen: false }),
      clearCompare: () => set({ compareTours: [], isCompareOpen: false }),
    }),
    {
      name: 'jurassic-travel-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookings: state.bookings }),
    }
  )
);

export default useBookingStore;
