import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Device, Brand, Comparison } from "@shared/schema";

interface DeviceFilters {
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  minRam?: number;
  fiveG?: boolean;
  search?: string;
}

export function useDevices(filters?: DeviceFilters) {
  const queryKey = ['/api/devices', filters];
  
  return useQuery<Device[]>({
    queryKey,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
      }
      
      const url = `/api/devices${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDevice(id: number | string) {
  return useQuery<Device>({
    queryKey: [`/api/devices/${id}`],
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFeaturedDevices() {
  return useQuery<Device[]>({
    queryKey: ['/api/devices/featured'],
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useDevicesByBrand(brandName: string) {
  return useQuery<Device[]>({
    queryKey: [`/api/devices/brand/${brandName}`],
    enabled: !!brandName,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSearchDevices(query: string) {
  return useQuery<Device[]>({
    queryKey: [`/api/search`, { q: query }],
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['/api/brands'],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCompareDevices() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deviceIds: number[]) => {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceIds }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to compare devices: ${response.statusText}`);
      }
      
      return response.json();
    },
  });
}

export function useComparisons() {
  return useQuery<Comparison[]>({
    queryKey: ['/api/comparisons'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateComparison() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (comparison: { name: string; deviceIds: string }) => {
      const response = await fetch('/api/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comparison),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create comparison: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comparisons'] });
    },
  });
}

export function useDeleteComparison() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/comparisons/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete comparison: ${response.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comparisons'] });
    },
  });
}

// Custom hook for managing device comparison state
export function useDeviceComparison() {
  const queryClient = useQueryClient();
  
  const addToComparison = (device: Device) => {
    const currentComparison = queryClient.getQueryData<Device[]>(['deviceComparison']) || [];
    
    if (currentComparison.length >= 4) {
      throw new Error('Maximum 4 devices can be compared at once');
    }
    
    if (currentComparison.find(d => d.id === device.id)) {
      throw new Error('Device is already in comparison');
    }
    
    const newComparison = [...currentComparison, device];
    queryClient.setQueryData(['deviceComparison'], newComparison);
    
    return newComparison;
  };
  
  const removeFromComparison = (deviceId: number) => {
    const currentComparison = queryClient.getQueryData<Device[]>(['deviceComparison']) || [];
    const newComparison = currentComparison.filter(d => d.id !== deviceId);
    queryClient.setQueryData(['deviceComparison'], newComparison);
    
    return newComparison;
  };
  
  const clearComparison = () => {
    queryClient.setQueryData(['deviceComparison'], []);
  };
  
  const getComparison = () => {
    return queryClient.getQueryData<Device[]>(['deviceComparison']) || [];
  };
  
  return {
    addToComparison,
    removeFromComparison,
    clearComparison,
    getComparison,
    comparisonDevices: queryClient.getQueryData<Device[]>(['deviceComparison']) || [],
  };
}

// Performance analytics hook
export function usePerformanceAnalytics(devices: Device[]) {
  const calculatePerformanceScore = (device: Device) => {
    let score = 0;
    let maxScore = 0;
    
    // AnTuTu score (40% weight)
    if (device.antutuScore) {
      score += (device.antutuScore / 2000000) * 40;
    }
    maxScore += 40;
    
    // Geekbench scores (30% weight)
    if (device.geekbenchSingle && device.geekbenchMulti) {
      const geekbenchScore = ((device.geekbenchSingle / 3000) + (device.geekbenchMulti / 8000)) / 2;
      score += geekbenchScore * 30;
    }
    maxScore += 30;
    
    // RAM (15% weight)
    score += (device.ram / 24) * 15;
    maxScore += 15;
    
    // Storage (15% weight)
    score += (device.storage / 1024) * 15;
    maxScore += 15;
    
    return Math.round((score / maxScore) * 100);
  };
  
  const calculateValueScore = (device: Device) => {
    const performanceScore = calculatePerformanceScore(device);
    const priceScore = Math.max(0, 100 - ((device.price / 100) / 20)); // Lower price = higher score
    
    return Math.round((performanceScore + priceScore) / 2);
  };
  
  const getBestInCategory = (category: 'performance' | 'value' | 'battery' | 'camera') => {
    if (devices.length === 0) return null;
    
    switch (category) {
      case 'performance':
        return devices.reduce((best, current) => 
          calculatePerformanceScore(current) > calculatePerformanceScore(best) ? current : best
        );
        
      case 'value':
        return devices.reduce((best, current) => 
          calculateValueScore(current) > calculateValueScore(best) ? current : best
        );
        
      case 'battery':
        return devices.reduce((best, current) => 
          current.batteryCapacity > best.batteryCapacity ? current : best
        );
        
      case 'camera':
        return devices.reduce((best, current) => {
          const currentMp = parseInt(current.mainCamera.split('MP')[0]) || 0;
          const bestMp = parseInt(best.mainCamera.split('MP')[0]) || 0;
          return currentMp > bestMp ? current : best;
        });
        
      default:
        return null;
    }
  };
  
  return {
    calculatePerformanceScore,
    calculateValueScore,
    getBestInCategory,
  };
}
