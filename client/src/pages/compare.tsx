import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ComparisonTool from "@/components/comparison-tool";
import DeviceCard from "@/components/device-card";
import { 
  Plus, 
  Search, 
  X, 
  Monitor, 
  Cpu, 
  Camera, 
  Battery, 
  Smartphone, 
  Wifi,
  BarChart3,
  ArrowRight
} from "lucide-react";
import type { Device } from "@shared/schema";

export default function Compare() {
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeviceSearch, setShowDeviceSearch] = useState(false);

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });

  const { data: searchResults } = useQuery<Device[]>({
    queryKey: [`/api/search`, { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const filteredDevices = searchQuery ? searchResults : devices;

  const addDevice = (device: Device) => {
    if (selectedDevices.length < 4 && !selectedDevices.find(d => d.id === device.id)) {
      setSelectedDevices([...selectedDevices, device]);
      setShowDeviceSearch(false);
      setSearchQuery("");
    }
  };

  const removeDevice = (deviceId: number) => {
    setSelectedDevices(selectedDevices.filter(d => d.id !== deviceId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100);
  };

  const getComparisonValue = (device: Device, field: string): { value: string; isHighest?: boolean; isLowest?: boolean } => {
    const values = selectedDevices.map(d => {
      switch (field) {
        case 'price': return d.price;
        case 'displaySize': return d.displaySize;
        case 'ram': return d.ram;
        case 'storage': return d.storage;
        case 'batteryCapacity': return d.batteryCapacity;
        case 'antutuScore': return d.antutuScore || 0;
        default: return 0;
      }
    });

    const currentValue = (() => {
      switch (field) {
        case 'price': return device.price;
        case 'displaySize': return device.displaySize;
        case 'ram': return device.ram;
        case 'storage': return device.storage;
        case 'batteryCapacity': return device.batteryCapacity;
        case 'antutuScore': return device.antutuScore || 0;
        default: return 0;
      }
    })();

    const max = Math.max(...values);
    const min = Math.min(...values);

    const displayValue = (() => {
      switch (field) {
        case 'price': return formatPrice(device.price);
        case 'displaySize': return `${device.displaySize}"`;
        case 'ram': return `${device.ram}GB`;
        case 'storage': return `${device.storage}GB`;
        case 'batteryCapacity': return `${device.batteryCapacity} mAh`;
        case 'antutuScore': return device.antutuScore ? device.antutuScore.toLocaleString() : 'N/A';
        default: return 'N/A';
      }
    })();

    return {
      value: displayValue,
      isHighest: field !== 'price' && currentValue === max && values.length > 1,
      isLowest: field === 'price' && currentValue === min && values.length > 1
    };
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Advanced Device Comparison</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Compare up to 4 devices side by side with detailed specifications
          </p>
        </div>

        {/* Device Selection Slots */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Selected Devices ({selectedDevices.length}/4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => {
                const device = selectedDevices[index];
                
                if (device) {
                  return (
                    <div key={device.id} className="relative">
                      <Card className="bg-background border-primary/20 hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeDevice(device.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          <img 
                            src={device.image} 
                            alt={device.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          
                          <div className="text-center">
                            <Badge variant="secondary" className="mb-2">{device.brand}</Badge>
                            <h3 className="font-semibold text-sm mb-1">{device.name}</h3>
                            <p className="text-primary font-bold">{formatPrice(device.price)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                }
                
                return (
                  <Card 
                    key={index}
                    className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setShowDeviceSearch(true)}
                  >
                    <CardContent className="p-8 text-center">
                      <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Add Device {index + 1}</h3>
                      <p className="text-muted-foreground text-sm">
                        Click to select a device for comparison
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {selectedDevices.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => setShowDeviceSearch(true)}
                  disabled={selectedDevices.length >= 4}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Device
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Search Modal */}
        {showDeviceSearch && (
          <Card className="mb-8 bg-card border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-primary" />
                  Select Device to Compare
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowDeviceSearch(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search devices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg h-48"></div>
                      </div>
                    ))
                  ) : (
                    filteredDevices?.map((device) => (
                      <Card 
                        key={device.id}
                        className={`cursor-pointer border-border hover:border-primary/50 transition-colors ${
                          selectedDevices.find(d => d.id === device.id) ? 'border-primary/50 bg-primary/5' : ''
                        }`}
                        onClick={() => addDevice(device)}
                      >
                        <CardContent className="p-4">
                          <img 
                            src={device.image} 
                            alt={device.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <div className="text-center">
                            <Badge variant="secondary" className="mb-2">{device.brand}</Badge>
                            <h3 className="font-semibold text-sm mb-1">{device.name}</h3>
                            <p className="text-primary font-bold text-sm">{formatPrice(device.price)}</p>
                            {selectedDevices.find(d => d.id === device.id) && (
                              <Badge className="mt-2 bg-primary">Selected</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        {selectedDevices.length >= 2 && (
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Detailed Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-2 text-muted-foreground font-medium">Specification</th>
                      {selectedDevices.map((device) => (
                        <th key={device.id} className="text-center py-4 px-2 min-w-[200px]">
                          <div className="font-semibold">{device.name}</div>
                          <div className="text-xs text-muted-foreground">{device.brand}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Price</td>
                      {selectedDevices.map((device) => {
                        const comparison = getComparisonValue(device, 'price');
                        return (
                          <td key={device.id} className="py-3 px-2 text-center">
                            <span className={`font-semibold ${comparison.isLowest ? 'text-green-500' : ''}`}>
                              {comparison.value}
                            </span>
                            {comparison.isLowest && <Badge variant="outline" className="ml-2 text-xs">Best Price</Badge>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Display */}
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">
                        <div className="flex items-center">
                          <Monitor className="mr-2 h-4 w-4" />
                          Display Size
                        </div>
                      </td>
                      {selectedDevices.map((device) => {
                        const comparison = getComparisonValue(device, 'displaySize');
                        return (
                          <td key={device.id} className="py-3 px-2 text-center">
                            <span className={`font-semibold ${comparison.isHighest ? 'text-secondary' : ''}`}>
                              {comparison.value}
                            </span>
                            {comparison.isHighest && <Badge variant="outline" className="ml-2 text-xs">Largest</Badge>}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Display Type</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          {device.displayType}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Resolution</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          {device.displayResolution}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Refresh Rate</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className="text-secondary font-medium">{device.refreshRate}Hz</span>
                        </td>
                      ))}
                    </tr>

                    {/* Performance */}
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td className="py-3 px-2 font-medium text-muted-foreground">
                        <div className="flex items-center">
                          <Cpu className="mr-2 h-4 w-4" />
                          Processor
                        </div>
                      </td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className="text-secondary font-medium">{device.processor}</span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">RAM</td>
                      {selectedDevices.map((device) => {
                        const comparison = getComparisonValue(device, 'ram');
                        return (
                          <td key={device.id} className="py-3 px-2 text-center">
                            <span className={`font-semibold ${comparison.isHighest ? 'text-secondary' : ''}`}>
                              {comparison.value}
                            </span>
                            {comparison.isHighest && <Badge variant="outline" className="ml-2 text-xs">Most RAM</Badge>}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Storage</td>
                      {selectedDevices.map((device) => {
                        const comparison = getComparisonValue(device, 'storage');
                        return (
                          <td key={device.id} className="py-3 px-2 text-center">
                            <span className={`font-semibold ${comparison.isHighest ? 'text-secondary' : ''}`}>
                              {comparison.value}
                            </span>
                            {comparison.isHighest && <Badge variant="outline" className="ml-2 text-xs">Most Storage</Badge>}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Camera */}
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td className="py-3 px-2 font-medium text-muted-foreground">
                        <div className="flex items-center">
                          <Camera className="mr-2 h-4 w-4" />
                          Main Camera
                        </div>
                      </td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className="text-secondary font-medium">{device.mainCamera}</span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Front Camera</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          {device.frontCamera}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Video Recording</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className="text-secondary font-medium">{device.videoRecording}</span>
                        </td>
                      ))}
                    </tr>

                    {/* Battery */}
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td className="py-3 px-2 font-medium text-muted-foreground">
                        <div className="flex items-center">
                          <Battery className="mr-2 h-4 w-4" />
                          Battery Capacity
                        </div>
                      </td>
                      {selectedDevices.map((device) => {
                        const comparison = getComparisonValue(device, 'batteryCapacity');
                        return (
                          <td key={device.id} className="py-3 px-2 text-center">
                            <span className={`font-semibold ${comparison.isHighest ? 'text-green-500' : ''}`}>
                              {comparison.value}
                            </span>
                            {comparison.isHighest && <Badge variant="outline" className="ml-2 text-xs">Biggest Battery</Badge>}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Charging Speed</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          {device.chargingSpeed ? `${device.chargingSpeed}W` : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Wireless Charging</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className={device.wirelessCharging ? 'text-green-500' : ''}>
                            {device.wirelessCharging ? 'Yes' : 'No'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Connectivity */}
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td className="py-3 px-2 font-medium text-muted-foreground">
                        <div className="flex items-center">
                          <Wifi className="mr-2 h-4 w-4" />
                          5G Support
                        </div>
                      </td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className={device.fiveG ? 'text-green-500 font-medium' : ''}>
                            {device.fiveG ? 'Yes' : 'No'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium text-muted-foreground">Operating System</td>
                      {selectedDevices.map((device) => (
                        <td key={device.id} className="py-3 px-2 text-center">
                          <span className="text-secondary font-medium">
                            {device.operatingSystem} {device.osVersion}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Performance Scores */}
                    {selectedDevices.some(d => d.antutuScore) && (
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-3 px-2 font-medium text-muted-foreground">AnTuTu Score</td>
                        {selectedDevices.map((device) => {
                          const comparison = getComparisonValue(device, 'antutuScore');
                          return (
                            <td key={device.id} className="py-3 px-2 text-center">
                              <span className={`font-semibold ${comparison.isHighest ? 'text-secondary' : ''}`}>
                                {comparison.value}
                              </span>
                              {comparison.isHighest && <Badge variant="outline" className="ml-2 text-xs">Highest Score</Badge>}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Charts */}
        {selectedDevices.length >= 2 && (
          <ComparisonTool devices={selectedDevices} />
        )}

        {/* Empty State */}
        {selectedDevices.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Start Your Comparison</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Select devices from our database to compare their specifications, performance, and features side by side.
              </p>
              <Button 
                onClick={() => setShowDeviceSearch(true)}
                className="bg-primary hover:bg-primary/90 px-8 py-3"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Device
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Single Device State */}
        {selectedDevices.length === 1 && (
          <Card className="bg-card border-border">
            <CardContent className="pt-8 pb-8 text-center">
              <h2 className="text-xl font-bold mb-4">Add Another Device to Compare</h2>
              <p className="text-muted-foreground mb-6">
                You need at least 2 devices to start comparing. Add another device to see the comparison table.
              </p>
              <Button 
                onClick={() => setShowDeviceSearch(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Second Device
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
