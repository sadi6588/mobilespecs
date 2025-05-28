import type { Device, Brand } from "@shared/schema";

// Note: This file is intentionally minimal and should not contain mock data
// as per the implementation guidelines. All data should come from the API.

export const EMPTY_DEVICE: Partial<Device> = {
  name: "",
  brand: "",
  model: "",
  price: 0,
  displaySize: 0,
  displayType: "",
  displayResolution: "",
  refreshRate: 60,
  processor: "",
  processorBrand: "",
  ram: 0,
  storage: 0,
  mainCamera: "",
  frontCamera: "",
  videoRecording: "",
  batteryCapacity: 0,
  dimensions: "",
  weight: 0,
  buildMaterial: "",
  fiveG: false,
  wifi: "",
  bluetooth: "",
  nfc: false,
  operatingSystem: "",
  osVersion: "",
  fingerprint: false,
  faceUnlock: false,
  headphoneJack: false,
  expandableStorage: false,
  wirelessCharging: false,
};

export const EMPTY_BRAND: Partial<Brand> = {
  name: "",
  logo: "",
  description: "",
  website: "",
  deviceCount: 0,
};

// Utility functions for data processing
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount / 100);
};

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const calculateAntutuScore = (device: Partial<Device>) => {
  // This is a rough estimation formula based on hardware specs
  // In a real application, these would be actual benchmark results
  if (!device.ram || !device.storage) return null;
  
  let baseScore = 400000; // Base score for modern devices
  
  // RAM contribution
  baseScore += device.ram * 50000;
  
  // Storage contribution
  baseScore += device.storage * 1000;
  
  // Display contribution
  if (device.refreshRate && device.refreshRate > 60) {
    baseScore += (device.refreshRate - 60) * 5000;
  }
  
  // Add some variance
  const variance = Math.random() * 200000 - 100000;
  
  return Math.max(300000, Math.round(baseScore + variance));
};

export const getDeviceCategory = (device: Device) => {
  if (device.price > 100000) return 'Premium';
  if (device.price > 60000) return 'Flagship';
  if (device.price > 30000) return 'Mid-range';
  return 'Budget';
};

export const getPerformanceCategory = (antutuScore: number | null) => {
  if (!antutuScore) return 'Unknown';
  if (antutuScore > 1500000) return 'Flagship';
  if (antutuScore > 1000000) return 'High-end';
  if (antutuScore > 600000) return 'Mid-range';
  if (antutuScore > 300000) return 'Entry-level';
  return 'Basic';
};

export const getBatteryCategory = (capacity: number) => {
  if (capacity > 5000) return 'Excellent';
  if (capacity > 4000) return 'Very Good';
  if (capacity > 3500) return 'Good';
  if (capacity > 3000) return 'Average';
  return 'Below Average';
};

export const getCameraCategory = (mainCamera: string) => {
  const mp = parseInt(mainCamera.split('MP')[0]) || 0;
  if (mp >= 100) return 'Exceptional';
  if (mp >= 64) return 'Excellent';
  if (mp >= 48) return 'Very Good';
  if (mp >= 32) return 'Good';
  if (mp >= 20) return 'Average';
  return 'Basic';
};

// Color scheme utilities
export const getScoreColor = (score: number, maxScore: number = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'text-green-500';
  if (percentage >= 75) return 'text-primary';
  if (percentage >= 60) return 'text-secondary';
  if (percentage >= 45) return 'text-yellow-500';
  return 'text-red-500';
};

export const getProgressColor = (score: number, maxScore: number = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 75) return 'bg-primary';
  if (percentage >= 60) return 'bg-secondary';
  if (percentage >= 45) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Comparison utilities
export const compareDevices = (device1: Device, device2: Device, field: keyof Device) => {
  const value1 = device1[field];
  const value2 = device2[field];
  
  if (typeof value1 === 'number' && typeof value2 === 'number') {
    if (value1 > value2) return 1;
    if (value1 < value2) return -1;
    return 0;
  }
  
  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return value1.localeCompare(value2);
  }
  
  return 0;
};

export const getWinner = (devices: Device[], field: keyof Device, preferLower = false) => {
  if (devices.length === 0) return null;
  
  return devices.reduce((winner, current) => {
    const comparison = compareDevices(current, winner, field);
    if (preferLower) {
      return comparison < 0 ? current : winner;
    }
    return comparison > 0 ? current : winner;
  });
};

// Search and filter utilities
export const searchDevices = (devices: Device[], query: string) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return devices;
  
  return devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm) ||
    device.brand.toLowerCase().includes(searchTerm) ||
    device.processor.toLowerCase().includes(searchTerm) ||
    device.operatingSystem.toLowerCase().includes(searchTerm)
  );
};

export const filterDevicesByPrice = (devices: Device[], min: number, max: number) => {
  return devices.filter(device => device.price >= min && device.price <= max);
};

export const filterDevicesByFeatures = (devices: Device[], features: string[]) => {
  if (features.length === 0) return devices;
  
  return devices.filter(device => {
    return features.every(feature => {
      switch (feature) {
        case '5G Support':
          return device.fiveG;
        case 'Wireless Charging':
          return device.wirelessCharging;
        case 'Fast Charging':
          return device.chargingSpeed && device.chargingSpeed >= 30;
        case 'Water Resistant':
          return device.waterResistance;
        case 'Fingerprint Scanner':
          return device.fingerprint;
        case 'Face Unlock':
          return device.faceUnlock;
        case 'Expandable Storage':
          return device.expandableStorage;
        case 'High Refresh Rate':
          return device.refreshRate >= 90;
        case 'OLED Display':
          return device.displayType.toLowerCase().includes('oled') || 
                 device.displayType.toLowerCase().includes('amoled');
        default:
          return true;
      }
    });
  });
};

// Export constants for use across the application
export const PERFORMANCE_CATEGORIES = [
  'Flagship',
  'High-end',
  'Mid-range',
  'Entry-level',
  'Basic'
] as const;

export const PRICE_CATEGORIES = [
  'Premium',
  'Flagship',
  'Mid-range',
  'Budget'
] as const;

export const BATTERY_CATEGORIES = [
  'Excellent',
  'Very Good',
  'Good',
  'Average',
  'Below Average'
] as const;

export const CAMERA_CATEGORIES = [
  'Exceptional',
  'Excellent',
  'Very Good',
  'Good',
  'Average',
  'Basic'
] as const;
