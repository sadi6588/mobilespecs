import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, X } from "lucide-react";
import type { Brand } from "@shared/schema";

interface SearchFiltersProps {
  brands: Brand[];
  onBrandChange: (brand: string) => void;
  selectedBrand: string;
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  brand: string;
  priceRange: [number, number];
  ramOptions: number[];
  storageOptions: number[];
  features: string[];
  screenSize: [number, number];
  batteryCapacity: [number, number];
}

const initialFilters: FilterState = {
  brand: "",
  priceRange: [0, 2000],
  ramOptions: [],
  storageOptions: [],
  features: [],
  screenSize: [5.0, 7.0],
  batteryCapacity: [3000, 6000]
};

export default function SearchFilters({ 
  brands, 
  onBrandChange, 
  selectedBrand,
  onFiltersChange 
}: SearchFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    onBrandChange("");
    onFiltersChange?.(initialFilters);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilters({ features: newFeatures });
  };

  const toggleRamOption = (ram: number) => {
    const newRamOptions = filters.ramOptions.includes(ram)
      ? filters.ramOptions.filter(r => r !== ram)
      : [...filters.ramOptions, ram];
    updateFilters({ ramOptions: newRamOptions });
  };

  const toggleStorageOption = (storage: number) => {
    const newStorageOptions = filters.storageOptions.includes(storage)
      ? filters.storageOptions.filter(s => s !== storage)
      : [...filters.storageOptions, storage];
    updateFilters({ storageOptions: newStorageOptions });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const hasActiveFilters = () => {
    return selectedBrand !== "" ||
           filters.priceRange[0] !== initialFilters.priceRange[0] ||
           filters.priceRange[1] !== initialFilters.priceRange[1] ||
           filters.ramOptions.length > 0 ||
           filters.storageOptions.length > 0 ||
           filters.features.length > 0 ||
           filters.screenSize[0] !== initialFilters.screenSize[0] ||
           filters.screenSize[1] !== initialFilters.screenSize[1] ||
           filters.batteryCapacity[0] !== initialFilters.batteryCapacity[0] ||
           filters.batteryCapacity[1] !== initialFilters.batteryCapacity[1];
  };

  return (
    <div className="space-y-4">
      {/* Basic Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Brand Filter */}
        <div className="min-w-40">
          <Select value={selectedBrand} onValueChange={onBrandChange}>
            <SelectTrigger className="bg-background border-border focus:ring-primary">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.name}>
                  {brand.name} ({brand.deviceCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Price Ranges */}
        <div className="min-w-40">
          <Select 
            value={`${filters.priceRange[0]}-${filters.priceRange[1]}`} 
            onValueChange={(value) => {
              const [min, max] = value.split('-').map(Number);
              updateFilters({ priceRange: [min, max] });
            }}
          >
            <SelectTrigger className="bg-background border-border focus:ring-secondary">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2000">All Prices</SelectItem>
              <SelectItem value="0-300">Under $300</SelectItem>
              <SelectItem value="300-600">$300 - $600</SelectItem>
              <SelectItem value="600-1000">$600 - $1000</SelectItem>
              <SelectItem value="1000-2000">$1000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Filter className="mr-2 h-4 w-4" />
              Advanced
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range Slider */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* RAM Options */}
              <div className="space-y-3">
                <Label className="text-base font-medium">RAM</Label>
                <div className="flex flex-wrap gap-2">
                  {[4, 6, 8, 12, 16, 24].map((ram) => (
                    <div key={ram} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ram-${ram}`}
                        checked={filters.ramOptions.includes(ram)}
                        onCheckedChange={() => toggleRamOption(ram)}
                      />
                      <Label htmlFor={`ram-${ram}`} className="text-sm">
                        {ram}GB
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Options */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Storage</Label>
                <div className="flex flex-wrap gap-2">
                  {[64, 128, 256, 512, 1024].map((storage) => (
                    <div key={storage} className="flex items-center space-x-2">
                      <Checkbox
                        id={`storage-${storage}`}
                        checked={filters.storageOptions.includes(storage)}
                        onCheckedChange={() => toggleStorageOption(storage)}
                      />
                      <Label htmlFor={`storage-${storage}`} className="text-sm">
                        {storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Size Range */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Screen Size: {filters.screenSize[0]}" - {filters.screenSize[1]}"
                </Label>
                <Slider
                  value={filters.screenSize}
                  onValueChange={(value) => updateFilters({ screenSize: value as [number, number] })}
                  max={7.0}
                  min={5.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Battery Capacity Range */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Battery: {filters.batteryCapacity[0]} - {filters.batteryCapacity[1]} mAh
                </Label>
                <Slider
                  value={filters.batteryCapacity}
                  onValueChange={(value) => updateFilters({ batteryCapacity: value as [number, number] })}
                  max={6000}
                  min={3000}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    '5G Support',
                    'Wireless Charging',
                    'Fast Charging',
                    'Water Resistant',
                    'Fingerprint Scanner',
                    'Face Unlock',
                    'Dual SIM',
                    'Expandable Storage',
                    'High Refresh Rate',
                    'OLED Display',
                    'Multiple Cameras',
                    'OIS Camera'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature.replace(/\s+/g, '-').toLowerCase()}`}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                      <Label 
                        htmlFor={`feature-${feature.replace(/\s+/g, '-').toLowerCase()}`} 
                        className="text-sm"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply/Reset Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setIsAdvancedOpen(false)}
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {selectedBrand && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              Brand: {selectedBrand}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={() => onBrandChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {(filters.priceRange[0] !== initialFilters.priceRange[0] || 
            filters.priceRange[1] !== initialFilters.priceRange[1]) && (
            <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
              {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-secondary/20"
                onClick={() => updateFilters({ priceRange: initialFilters.priceRange })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {filters.features.map((feature) => (
            <div key={feature} className="flex items-center gap-1 bg-muted/10 text-muted-foreground px-3 py-1 rounded-full text-sm">
              {feature}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-muted/20"
                onClick={() => toggleFeature(feature)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
