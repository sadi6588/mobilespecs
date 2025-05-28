import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import PerformanceChart from "@/components/performance-chart";
import { 
  ArrowLeft, 
  Monitor, 
  Cpu, 
  Camera, 
  Battery, 
  Smartphone, 
  Wifi, 
  Shield,
  Zap,
  Star,
  Share,
  Heart,
  BarChart3
} from "lucide-react";
import type { Device } from "@shared/schema";

export default function DeviceDetails() {
  const { id } = useParams();
  
  const { data: device, isLoading, error } = useQuery<Device>({
    queryKey: [`/api/devices/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Device Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The device you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getPerformanceScore = (score: number | null, max: number) => {
    if (!score) return 0;
    return Math.min((score / max) * 100, 100);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Link href="/compare">
              <Button className="bg-primary hover:bg-primary/90">
                <BarChart3 className="mr-2 h-4 w-4" />
                Compare
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Device Image and Basic Info */}
          <div>
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <img 
                  src={device.image} 
                  alt={device.name}
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
                
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="secondary">{device.brand}</Badge>
                    {device.fiveG && <Badge className="bg-primary">5G</Badge>}
                    {device.wirelessCharging && <Badge className="bg-secondary">Wireless</Badge>}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{device.name}</h1>
                  <p className="text-muted-foreground mb-4">{device.model}</p>
                  
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                        />
                      ))}
                      <span className="ml-2 text-muted-foreground">4.6 (1,234 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(device.price)}
                  </div>
                  <p className="text-muted-foreground">
                    Released {formatDate(device.releaseDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Specs */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5 text-primary" />
                  Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-secondary font-medium">{device.displayType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{device.displaySize}" diagonal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span>{device.displayResolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refresh Rate:</span>
                  <span className="text-secondary font-medium">{device.refreshRate}Hz</span>
                </div>
                {device.brightness && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brightness:</span>
                    <span>{device.brightness} nits</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2 h-5 w-5 text-secondary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processor:</span>
                  <span className="text-secondary font-medium">{device.processor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM:</span>
                  <span>{device.ram}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span>{device.storage}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expandable:</span>
                  <span>{device.expandableStorage ? 'Yes' : 'No'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-primary" />
                  Camera
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Main:</span>
                  <span className="text-secondary font-medium">{device.mainCamera}</span>
                </div>
                {device.ultraWideCamera && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ultra Wide:</span>
                    <span>{device.ultraWideCamera}</span>
                  </div>
                )}
                {device.telephotoCamera && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telephoto:</span>
                    <span>{device.telephotoCamera}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Front:</span>
                  <span>{device.frontCamera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Video:</span>
                  <span className="text-secondary font-medium">{device.videoRecording}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Benchmarks */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Performance Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {device.antutuScore && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">AnTuTu Score</span>
                    <span className="font-semibold">{device.antutuScore.toLocaleString()}</span>
                  </div>
                  <Progress value={getPerformanceScore(device.antutuScore, 2000000)} className="h-2" />
                </div>
              )}
              
              {device.geekbenchSingle && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Geekbench (Single)</span>
                    <span className="font-semibold">{device.geekbenchSingle.toLocaleString()}</span>
                  </div>
                  <Progress value={getPerformanceScore(device.geekbenchSingle, 3000)} className="h-2" />
                </div>
              )}
              
              {device.geekbenchMulti && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Geekbench (Multi)</span>
                    <span className="font-semibold">{device.geekbenchMulti.toLocaleString()}</span>
                  </div>
                  <Progress value={getPerformanceScore(device.geekbenchMulti, 8000)} className="h-2" />
                </div>
              )}
            </div>
            
            {device.antutuScore && device.geekbenchSingle && device.geekbenchMulti && (
              <div className="mt-6">
                <PerformanceChart device={device} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Battery & Charging */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Battery className="mr-2 h-5 w-5 text-green-500" />
                Battery & Charging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-semibold">{device.batteryCapacity} mAh</span>
              </div>
              {device.chargingSpeed && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fast Charging:</span>
                  <span className="text-secondary font-medium">{device.chargingSpeed}W</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wireless Charging:</span>
                <span>{device.wirelessCharging ? 'Yes' : 'No'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Design & Build */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-secondary" />
                Design & Build
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span>{device.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span>{device.weight}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build Material:</span>
                <span className="text-secondary font-medium">{device.buildMaterial}</span>
              </div>
              {device.waterResistance && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Water Resistance:</span>
                  <span className="text-secondary font-medium">{device.waterResistance}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connectivity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="mr-2 h-5 w-5 text-primary" />
                Connectivity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">5G:</span>
                <span className={device.fiveG ? "text-green-500 font-medium" : ""}>{device.fiveG ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wi-Fi:</span>
                <span className="text-secondary font-medium">{device.wifi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bluetooth:</span>
                <span>{device.bluetooth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NFC:</span>
                <span>{device.nfc ? 'Yes' : 'No'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Software & Security */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-secondary" />
                Software & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Operating System:</span>
                <span className="text-secondary font-medium">{device.operatingSystem} {device.osVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fingerprint:</span>
                <span>{device.fingerprint ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Face Unlock:</span>
                <span>{device.faceUnlock ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Headphone Jack:</span>
                <span>{device.headphoneJack ? 'Yes' : 'No'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Compare?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Add this device to your comparison list and see how it stacks up against other smartphones.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/compare">
                  <Button className="bg-primary hover:bg-primary/90 px-8 py-3">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Compare Now
                  </Button>
                </Link>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
