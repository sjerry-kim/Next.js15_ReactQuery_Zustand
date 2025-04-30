import { create } from 'zustand';

interface testState {
  count: number;
  increase: () => void;
  reset: () => void;
}

const useBearStore = create<testState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

export default useBearStore;
