import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PerformanceChart from "./performance-chart";
import { 
  BarChart3, 
  TrendingUp, 
  Battery, 
  Cpu, 
  Camera, 
  Smartphone 
} from "lucide-react";
import type { Device } from "@shared/schema";

interface ComparisonToolProps {
  devices: Device[];
}

export default function ComparisonTool({ devices }: ComparisonToolProps) {
  if (devices.length < 2) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100);
  };

  const getScoreCategory = (score: number | null, maxScore: number) => {
    if (!score) return { value: 0, label: 'N/A', color: 'bg-muted' };
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return { value: percentage, label: 'Excellent', color: 'bg-green-500' };
    if (percentage >= 75) return { value: percentage, label: 'Very Good', color: 'bg-primary' };
    if (percentage >= 60) return { value: percentage, label: 'Good', color: 'bg-secondary' };
    if (percentage >= 45) return { value: percentage, label: 'Average', color: 'bg-yellow-500' };
    return { value: percentage, label: 'Below Average', color: 'bg-red-500' };
  };

  const getBatteryLifeEstimate = (capacity: number, efficiency: number = 1) => {
    // Rough estimation based on battery capacity and screen size
    const baseHours = (capacity / 1000) * 3 * efficiency;
    return Math.round(baseHours * 10) / 10;
  };

  return (
    <div className="space-y-8">
      {/* Performance Comparison Charts */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Performance Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceChart devices={devices} />
        </CardContent>
      </Card>

      {/* Key Metrics Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Scores */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="mr-2 h-5 w-5 text-secondary" />
              Processing Power
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {devices.map((device) => {
              const antutuScore = getScoreCategory(device.antutuScore, 2000000);
              const geekbenchSingle = getScoreCategory(device.geekbenchSingle, 3000);
              
              return (
                <div key={device.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <Badge variant="outline">{device.brand}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AnTuTu Score</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {device.antutuScore?.toLocaleString() || 'N/A'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {antutuScore.label}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={antutuScore.value} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Geekbench (Single)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {device.geekbenchSingle?.toLocaleString() || 'N/A'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {geekbenchSingle.label}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={geekbenchSingle.value} className="h-2" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Battery Comparison */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Battery className="mr-2 h-5 w-5 text-green-500" />
              Battery Life Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {devices.map((device) => {
              const batteryScore = getScoreCategory(device.batteryCapacity, 6000);
              const estimatedLife = getBatteryLifeEstimate(device.batteryCapacity);
              
              return (
                <div key={device.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <Badge variant="outline">{device.batteryCapacity} mAh</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Estimated Screen Time</div>
                      <div className="font-semibold text-green-500">{estimatedLife}h</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Charging Speed</div>
                      <div className="font-semibold">
                        {device.chargingSpeed ? `${device.chargingSpeed}W` : 'Standard'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Battery Capacity</span>
                      <Badge variant="outline" className="text-xs">
                        {batteryScore.label}
                      </Badge>
                    </div>
                    <Progress value={batteryScore.value} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {device.wirelessCharging && (
                      <Badge variant="outline" className="text-xs">Wireless Charging</Badge>
                    )}
                    {device.chargingSpeed && device.chargingSpeed >= 50 && (
                      <Badge variant="outline" className="text-xs">Fast Charging</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Camera & Display Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Comparison */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-primary" />
              Camera Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {devices.map((device) => {
              const mainCameraMp = parseInt(device.mainCamera.split('MP')[0]) || 0;
              const cameraScore = getScoreCategory(mainCameraMp, 200);
              
              return (
                <div key={device.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <Badge variant="outline">{mainCameraMp}MP Main</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Main Camera</div>
                      <div className="font-semibold text-secondary">
                        {device.mainCamera}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Video Recording</div>
                      <div className="font-semibold">
                        {device.videoRecording}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Camera Resolution</span>
                      <Badge variant="outline" className="text-xs">
                        {cameraScore.label}
                      </Badge>
                    </div>
                    <Progress value={cameraScore.value} className="h-2" />
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    {device.ultraWideCamera && (
                      <div>Ultra Wide: {device.ultraWideCamera}</div>
                    )}
                    {device.telephotoCamera && (
                      <div>Telephoto: {device.telephotoCamera}</div>
                    )}
                    <div>Front: {device.frontCamera}</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Display Comparison */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5 text-secondary" />
              Display Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {devices.map((device) => {
              const displayScore = getScoreCategory(device.displaySize, 7);
              const refreshScore = getScoreCategory(device.refreshRate, 120);
              
              return (
                <div key={device.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <Badge variant="outline">{device.displaySize}"</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Type</div>
                      <div className="font-semibold text-secondary">
                        {device.displayType}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Resolution</div>
                      <div className="font-semibold">
                        {device.displayResolution}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Screen Size</span>
                      <Badge variant="outline" className="text-xs">
                        {displayScore.label}
                      </Badge>
                    </div>
                    <Progress value={displayScore.value} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Refresh Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{device.refreshRate}Hz</span>
                        <Badge variant="outline" className="text-xs">
                          {refreshScore.label}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={refreshScore.value} className="h-2" />
                  </div>

                  {device.brightness && (
                    <div className="text-xs text-muted-foreground">
                      Brightness: {device.brightness} nits
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Value Analysis */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Value Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {devices.map((device) => {
              const pricePerGbRam = device.price / (device.ram * 100);
              const antutuPerDollar = device.antutuScore ? (device.antutuScore / (device.price / 100)) : 0;
              
              return (
                <div key={device.id} className="text-center">
                  <div className="font-semibold mb-2">{device.name}</div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {formatPrice(device.price)}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>${pricePerGbRam.toFixed(0)} per GB RAM</div>
                    {antutuPerDollar > 0 && (
                      <div>{Math.round(antutuPerDollar)} AnTuTu per $</div>
                    )}
                  </div>
                  <div className="mt-3">
                    {device.price === Math.min(...devices.map(d => d.price)) && (
                      <Badge className="bg-green-500">Best Price</Badge>
                    )}
                    {device.antutuScore === Math.max(...devices.map(d => d.antutuScore || 0)) && (
                      <Badge className="bg-primary">Best Performance</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
