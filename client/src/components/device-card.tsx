import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Cpu, 
  Camera, 
  Battery, 
  Heart, 
  BarChart3,
  Star,
  Wifi,
  Zap
} from "lucide-react";
import type { Device } from "@shared/schema";

interface DeviceCardProps {
  device: Device;
  onAddToCompare?: (device: Device) => void;
  isInComparison?: boolean;
}

export default function DeviceCard({ device, onAddToCompare, isInComparison = false }: DeviceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100);
  };

  const getDeviceBadge = () => {
    if (device.price > 100000) return { label: "Premium", className: "bg-primary" };
    if (device.antutuScore && device.antutuScore > 1500000) return { label: "Flagship", className: "bg-secondary" };
    if (device.fiveG) return { label: "5G", className: "bg-green-500" };
    if (device.wirelessCharging) return { label: "Wireless", className: "bg-purple-500" };
    return { label: "Popular", className: "bg-muted" };
  };

  const badge = getDeviceBadge();

  return (
    <Card className="device-card bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Device Image */}
        <div className="relative">
          <img 
            src={device.image} 
            alt={device.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className={badge.className}>{badge.label}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Button
              size="icon"
              variant="ghost"
              className="bg-background/80 hover:bg-background text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Device Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                {device.name}
              </h3>
              <p className="text-muted-foreground text-sm">{device.brand}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(device.price)}
              </div>
              <div className="flex items-center justify-end mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">4.6</span>
              </div>
            </div>
          </div>

          {/* Key Specifications */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Smartphone className="h-4 w-4 mr-2" />
                Display:
              </div>
              <span className="text-secondary font-medium">
                {device.displaySize}" {device.displayType}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Cpu className="h-4 w-4 mr-2" />
                Processor:
              </div>
              <span className="font-medium truncate ml-2 text-right">
                {device.processor}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <div className="h-4 w-4 mr-2 flex items-center justify-center">
                  <div className="w-3 h-3 bg-muted-foreground rounded-sm"></div>
                </div>
                RAM/Storage:
              </div>
              <span className="font-medium">
                {device.ram}GB / {device.storage}GB
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Camera className="h-4 w-4 mr-2" />
                Camera:
              </div>
              <span className="font-medium truncate ml-2 text-right">
                {device.mainCamera.split(' ')[0]}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Battery className="h-4 w-4 mr-2" />
                Battery:
              </div>
              <span className="font-medium">
                {device.batteryCapacity} mAh
              </span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {device.fiveG && (
              <Badge variant="outline" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                5G
              </Badge>
            )}
            {device.wirelessCharging && (
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Wireless
              </Badge>
            )}
            {device.refreshRate >= 120 && (
              <Badge variant="outline" className="text-xs">
                {device.refreshRate}Hz
              </Badge>
            )}
            {device.fingerprint && (
              <Badge variant="outline" className="text-xs">
                Fingerprint
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href={`/device/${device.id}`} className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">
                View Details
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="icon"
              className={`border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors ${
                isInComparison ? 'bg-secondary text-secondary-foreground' : ''
              }`}
              onClick={() => onAddToCompare?.(device)}
              disabled={isInComparison}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Performance Indicator */}
          {device.antutuScore && (
            <div className="mt-4 p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>AnTuTu Score</span>
                <span className="font-medium">{device.antutuScore.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((device.antutuScore / 2000000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
