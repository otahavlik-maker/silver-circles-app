import { create } from 'zustand';

// Mock Data Generators (Simulace dat z databáze)
const generateClinicalData = () => ({
  lastVitals: { bp: '120/80', hr: 72, temp: 36.6 },
  wounds: [{ id: 1, loc: 'Left Heel', stage: 2, lastCheck: '2 days ago' }],
  meds: [
    { id: 1, name: 'Metformin', dose: '500mg', time: '08:00', taken: false },
    { id: 2, name: 'Furosemide', dose: '40mg', time: '09:00', taken: true }
  ]
});

export const useAppStore = create((set) => ({
  // 1. Identita a Role
  currentUser: { name: 'Elsie', age: 82, condition: 'Type 2 Diabetes' },
  currentMode: 'PATIENT', // Možnosti: 'PATIENT' | 'NURSE' | 'FAMILY'
  setMode: (mode) => {
    set({ currentMode: mode });

    // --- Synchronizace pro AppContext (přepínání režimů) ---
    try {
      const event = new CustomEvent('app:viewModeChange', { detail: mode });
      window.dispatchEvent(event);
    } catch (err) {
      console.warn('Mode sync failed:', err);
    }
  },

  // 2. Offline-First Logika (Stav sítě)
  isOnline: true,
  toggleNetwork: () => set((state) => ({ isOnline: !state.isOnline })),
  pendingSync: 0, // Počet položek čekajících na odeslání

  // 3. Klinická Data
  clinicalData: generateClinicalData(),
  
  // Akce: Vzít lék
  takeMed: (medId) => set((state) => ({
    clinicalData: {
      ...state.clinicalData,
      meds: state.clinicalData.meds.map(m => 
        m.id === medId ? { ...m, taken: true } : m
      )
    },
    // Pokud jsme offline, přidáme +1 do fronty na synchronizaci
    pendingSync: state.isOnline ? state.pendingSync : state.pendingSync + 1
  })),

  // 4. Hydratace (Režim Pacient)
  hydrationLevel: 40,
  drinkWater: () => set((state) => ({ hydrationLevel: Math.min(state.hydrationLevel + 20, 100) })),

  // 5. SOS Protokol (Červené tlačítko)
  sosActive: false,
  triggerSOS: () => set({ sosActive: true }),
  resetSOS: () => set({ sosActive: false }),
}));