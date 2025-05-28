import { devices, brands, comparisons, type Device, type InsertDevice, type Brand, type InsertBrand, type Comparison, type InsertComparison } from "@shared/schema";

export interface IStorage {
  // Device operations
  getDevices(filters?: {
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    minRam?: number;
    fiveG?: boolean;
    search?: string;
  }): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, device: Partial<InsertDevice>): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;
  
  // Brand operations
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Comparison operations
  getComparisons(): Promise<Comparison[]>;
  getComparison(id: number): Promise<Comparison | undefined>;
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  deleteComparison(id: number): Promise<boolean>;
  
  // Popular/Featured
  getFeaturedDevices(): Promise<Device[]>;
  getDevicesByBrand(brandName: string): Promise<Device[]>;
  searchDevices(query: string): Promise<Device[]>;
}

export class MemStorage implements IStorage {
  private devices: Map<number, Device>;
  private brands: Map<number, Brand>;
  private comparisons: Map<number, Comparison>;
  private currentDeviceId: number;
  private currentBrandId: number;
  private currentComparisonId: number;

  constructor() {
    this.devices = new Map();
    this.brands = new Map();
    this.comparisons = new Map();
    this.currentDeviceId = 1;
    this.currentBrandId = 1;
    this.currentComparisonId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create brands first
    const sampleBrands: InsertBrand[] = [
      { name: "Samsung", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg", description: "South Korean multinational electronics company", website: "https://samsung.com" },
      { name: "Apple", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg", description: "American technology company", website: "https://apple.com" },
      { name: "Google", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg", description: "American technology company", website: "https://google.com" },
      { name: "OnePlus", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/oneplus.svg", description: "Chinese smartphone manufacturer", website: "https://oneplus.com" },
      { name: "Xiaomi", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/xiaomi.svg", description: "Chinese electronics company", website: "https://mi.com" }
    ];

    sampleBrands.forEach(brand => this.createBrand(brand));

    // Create sample devices
    const sampleDevices: InsertDevice[] = [
      {
        name: "Galaxy S24 Ultra",
        brand: "Samsung",
        model: "SM-S928B",
        price: 129900, // $1,299
        releaseDate: new Date("2024-01-24"),
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        displaySize: 6.8,
        displayType: "Dynamic AMOLED 2X",
        displayResolution: "3120 x 1440",
        refreshRate: 120,
        brightness: 2600,
        processor: "Snapdragon 8 Gen 3",
        processorBrand: "Qualcomm",
        ram: 12,
        storage: 256,
        expandableStorage: true,
        mainCamera: "200MP f/1.7 OIS",
        ultraWideCamera: "12MP f/2.2",
        telephotoCamera: "50MP f/3.4 OIS + 10MP f/2.4 OIS",
        frontCamera: "12MP f/2.2",
        videoRecording: "8K@30fps, 4K@60fps",
        batteryCapacity: 5000,
        chargingSpeed: 45,
        wirelessCharging: true,
        dimensions: "162.3 x 79.0 x 8.6 mm",
        weight: 232,
        buildMaterial: "Titanium frame, Gorilla Glass Victus 2",
        waterResistance: "IP68",
        fiveG: true,
        wifi: "Wi-Fi 7",
        bluetooth: "5.3",
        nfc: true,
        operatingSystem: "Android",
        osVersion: "14",
        antutuScore: 1650000,
        geekbenchSingle: 2100,
        geekbenchMulti: 6500,
        fingerprint: true,
        faceUnlock: true,
        headphoneJack: false
      },
      {
        name: "iPhone 15 Pro",
        brand: "Apple",
        model: "A3108",
        price: 99900, // $999
        releaseDate: new Date("2023-09-22"),
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        displaySize: 6.1,
        displayType: "Super Retina XDR OLED",
        displayResolution: "2556 x 1179",
        refreshRate: 120,
        brightness: 2000,
        processor: "A17 Pro",
        processorBrand: "Apple",
        ram: 8,
        storage: 128,
        expandableStorage: false,
        mainCamera: "48MP f/1.78 OIS",
        ultraWideCamera: "13MP f/2.2",
        telephotoCamera: "12MP f/2.8 OIS",
        frontCamera: "12MP f/1.9",
        videoRecording: "4K@60fps, ProRes",
        batteryCapacity: 3274,
        chargingSpeed: 27,
        wirelessCharging: true,
        dimensions: "146.6 x 70.6 x 8.25 mm",
        weight: 187,
        buildMaterial: "Titanium frame, Ceramic Shield",
        waterResistance: "IP68",
        fiveG: true,
        wifi: "Wi-Fi 6E",
        bluetooth: "5.3",
        nfc: true,
        operatingSystem: "iOS",
        osVersion: "17",
        antutuScore: 1580000,
        geekbenchSingle: 2900,
        geekbenchMulti: 7200,
        fingerprint: false,
        faceUnlock: true,
        headphoneJack: false
      },
      {
        name: "Pixel 8 Pro",
        brand: "Google",
        model: "GC3VE",
        price: 89900, // $899
        releaseDate: new Date("2023-10-12"),
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        displaySize: 6.7,
        displayType: "LTPO OLED",
        displayResolution: "2992 x 1344",
        refreshRate: 120,
        brightness: 2400,
        processor: "Google Tensor G3",
        processorBrand: "Google",
        ram: 12,
        storage: 128,
        expandableStorage: false,
        mainCamera: "50MP f/1.68 OIS",
        ultraWideCamera: "48MP f/1.95",
        telephotoCamera: "48MP f/2.8 OIS",
        frontCamera: "10.5MP f/2.2",
        videoRecording: "4K@60fps, 8K@30fps",
        batteryCapacity: 5050,
        chargingSpeed: 30,
        wirelessCharging: true,
        dimensions: "162.6 x 76.5 x 8.8 mm",
        weight: 213,
        buildMaterial: "Aluminum frame, Gorilla Glass Victus 2",
        waterResistance: "IP68",
        fiveG: true,
        wifi: "Wi-Fi 7",
        bluetooth: "5.3",
        nfc: true,
        operatingSystem: "Android",
        osVersion: "14",
        antutuScore: 1100000,
        geekbenchSingle: 1760,
        geekbenchMulti: 4442,
        fingerprint: true,
        faceUnlock: true,
        headphoneJack: false
      },
      {
        name: "OnePlus 12",
        brand: "OnePlus",
        model: "CPH2573",
        price: 79900, // $799
        releaseDate: new Date("2024-01-23"),
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        displaySize: 6.82,
        displayType: "LTPO3 AMOLED",
        displayResolution: "3168 x 1440",
        refreshRate: 120,
        brightness: 4500,
        processor: "Snapdragon 8 Gen 3",
        processorBrand: "Qualcomm",
        ram: 16,
        storage: 512,
        expandableStorage: false,
        mainCamera: "50MP f/1.6 OIS",
        ultraWideCamera: "64MP f/2.5",
        telephotoCamera: "48MP f/2.8 OIS",
        frontCamera: "32MP f/2.4",
        videoRecording: "8K@24fps, 4K@60fps",
        batteryCapacity: 5400,
        chargingSpeed: 100,
        wirelessCharging: true,
        dimensions: "164.3 x 75.8 x 9.15 mm",
        weight: 220,
        buildMaterial: "Aluminum frame, Gorilla Glass Victus 2",
        waterResistance: "IP65",
        fiveG: true,
        wifi: "Wi-Fi 7",
        bluetooth: "5.4",
        nfc: true,
        operatingSystem: "Android",
        osVersion: "14",
        antutuScore: 1620000,
        geekbenchSingle: 2150,
        geekbenchMulti: 6400,
        fingerprint: true,
        faceUnlock: true,
        headphoneJack: false
      },
      {
        name: "Galaxy A54 5G",
        brand: "Samsung",
        model: "SM-A546B",
        price: 44900, // $449
        releaseDate: new Date("2023-03-24"),
        image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        displaySize: 6.4,
        displayType: "Super AMOLED",
        displayResolution: "2340 x 1080",
        refreshRate: 120,
        brightness: 1000,
        processor: "Exynos 1380",
        processorBrand: "Samsung",
        ram: 8,
        storage: 256,
        expandableStorage: true,
        mainCamera: "50MP f/1.8 OIS",
        ultraWideCamera: "12MP f/2.2",
        telephotoCamera: "5MP f/2.4 Macro",
        frontCamera: "32MP f/2.2",
        videoRecording: "4K@30fps",
        batteryCapacity: 5000,
        chargingSpeed: 25,
        wirelessCharging: false,
        dimensions: "158.2 x 76.7 x 8.2 mm",
        weight: 202,
        buildMaterial: "Plastic frame, Gorilla Glass 5",
        waterResistance: "IP67",
        fiveG: true,
        wifi: "Wi-Fi 6",
        bluetooth: "5.3",
        nfc: true,
        operatingSystem: "Android",
        osVersion: "13",
        antutuScore: 485000,
        geekbenchSingle: 1050,
        geekbenchMulti: 3100,
        fingerprint: true,
        faceUnlock: true,
        headphoneJack: false
      }
    ];

    sampleDevices.forEach(device => this.createDevice(device));
  }

  async getDevices(filters?: {
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    minRam?: number;
    fiveG?: boolean;
    search?: string;
  }): Promise<Device[]> {
    let devices = Array.from(this.devices.values());

    if (filters) {
      if (filters.brand) {
        devices = devices.filter(d => d.brand.toLowerCase() === filters.brand!.toLowerCase());
      }
      if (filters.priceMin !== undefined) {
        devices = devices.filter(d => d.price >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        devices = devices.filter(d => d.price <= filters.priceMax!);
      }
      if (filters.minRam !== undefined) {
        devices = devices.filter(d => d.ram >= filters.minRam!);
      }
      if (filters.fiveG !== undefined) {
        devices = devices.filter(d => d.fiveG === filters.fiveG);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        devices = devices.filter(d => 
          d.name.toLowerCase().includes(searchLower) ||
          d.brand.toLowerCase().includes(searchLower) ||
          d.processor.toLowerCase().includes(searchLower)
        );
      }
    }

    return devices.sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
  }

  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.currentDeviceId++;
    const device: Device = {
      ...insertDevice,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      brightness: insertDevice.brightness ?? null,
      chargingSpeed: insertDevice.chargingSpeed ?? null,
      waterResistance: insertDevice.waterResistance ?? null,
      antutuScore: insertDevice.antutuScore ?? null,
      geekbenchSingle: insertDevice.geekbenchSingle ?? null,
      geekbenchMulti: insertDevice.geekbenchMulti ?? null,
      ultraWideCamera: insertDevice.ultraWideCamera ?? null,
      telephotoCamera: insertDevice.telephotoCamera ?? null,
      fiveG: insertDevice.fiveG ?? false,
      wirelessCharging: insertDevice.wirelessCharging ?? false,
      expandableStorage: insertDevice.expandableStorage ?? false,
      nfc: insertDevice.nfc ?? false,
      fingerprint: insertDevice.fingerprint ?? false,
      faceUnlock: insertDevice.faceUnlock ?? false,
      headphoneJack: insertDevice.headphoneJack ?? false
    };
    this.devices.set(id, device);
    return device;
  }

  async updateDevice(id: number, updates: Partial<InsertDevice>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;

    const updatedDevice: Device = {
      ...device,
      ...updates,
      updatedAt: new Date()
    };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<boolean> {
    return this.devices.delete(id);
  }

  async getBrands(): Promise<Brand[]> {
    const brands = Array.from(this.brands.values());
    // Update device counts
    brands.forEach(brand => {
      const deviceCount = Array.from(this.devices.values()).filter(d => d.brand === brand.name).length;
      brand.deviceCount = deviceCount;
    });
    return brands.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.currentBrandId++;
    const brand: Brand = {
      ...insertBrand,
      id,
      deviceCount: 0,
      logo: insertBrand.logo ?? null,
      description: insertBrand.description ?? null,
      website: insertBrand.website ?? null
    };
    this.brands.set(id, brand);
    return brand;
  }

  async getComparisons(): Promise<Comparison[]> {
    return Array.from(this.comparisons.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getComparison(id: number): Promise<Comparison | undefined> {
    return this.comparisons.get(id);
  }

  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const id = this.currentComparisonId++;
    const comparison: Comparison = {
      ...insertComparison,
      id,
      createdAt: new Date()
    };
    this.comparisons.set(id, comparison);
    return comparison;
  }

  async deleteComparison(id: number): Promise<boolean> {
    return this.comparisons.delete(id);
  }

  async getFeaturedDevices(): Promise<Device[]> {
    const devices = Array.from(this.devices.values());
    return devices
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime())
      .slice(0, 6);
  }

  async getDevicesByBrand(brandName: string): Promise<Device[]> {
    return Array.from(this.devices.values())
      .filter(d => d.brand.toLowerCase() === brandName.toLowerCase())
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
  }

  async searchDevices(query: string): Promise<Device[]> {
    const searchLower = query.toLowerCase();
    return Array.from(this.devices.values())
      .filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.brand.toLowerCase().includes(searchLower) ||
        d.processor.toLowerCase().includes(searchLower)
      )
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
  }
}

export const storage = new MemStorage();
