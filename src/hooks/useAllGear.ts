import { useMemo } from 'react';
import gearData from '../mock/gear.json';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';

const mockGear = gearData as GearItem[];

export function useAllGear(): GearItem[] {
  const customGear = usePackStore((s) => s.customGear);
  return useMemo(() => [...mockGear, ...customGear], [customGear]);
}
