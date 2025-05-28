import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Radar as RadarIcon, TrendingUp } from "lucide-react";
import type { Device } from "@shared/schema";

interface PerformanceChartProps {
  devices: Device[];
  device?: Device; // For single device view
}

export default function PerformanceChart({ devices, device }: PerformanceChartProps) {
  // If single device, show that device's performance breakdown
  if (device) {
    const performanceData = [
      {
        name: 'CPU',
        score: device.geekbenchSingle ? Math.min((device.geekbenchSingle / 3000) * 100, 100) : 0,
        value: device.geekbenchSingle || 0,
        fullMark: 100
      },
      {
        name: 'GPU',
        score: device.antutuScore ? Math.min(((device.antutuScore * 0.3) / 600000) * 100, 100) : 0,
        value: device.antutuScore ? Math.round(device.antutuScore * 0.3) : 0,
        fullMark: 100
      },
      {
        name: 'Memory',
        score: Math.min((device.ram / 24) * 100, 100),
        value: device.ram,
        fullMark: 100
      },
      {
        name: 'Storage',
        score: Math.min((device.storage / 1024) * 100, 100),
        value: device.storage,
        fullMark: 100
      },
      {
        name: 'Battery',
        score: Math.min((device.batteryCapacity / 6000) * 100, 100),
        value: device.batteryCapacity,
        fullMark: 100
      },
      {
        name: 'Display',
        score: Math.min(((device.displaySize * device.refreshRate) / 840) * 100, 100), // 7" * 120Hz = 840
        value: Math.round(device.displaySize * device.refreshRate),
        fullMark: 100
      }
    ];

    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RadarIcon className="mr-2 h-5 w-5 text-primary" />
            Performance Breakdown - {device.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={performanceData}>
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis dataKey="name" className="fill-foreground text-sm" />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  className="fill-muted-foreground text-xs"
                />
                <Radar
                  name="Performance Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {performanceData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-sm text-muted-foreground">{item.name}</div>
                <div className="text-lg font-semibold text-primary">
                  {Math.round(item.score)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.name === 'Memory' && `${item.value}GB`}
                  {item.name === 'Storage' && `${item.value}GB`}
                  {item.name === 'Battery' && `${item.value} mAh`}
                  {(item.name === 'CPU' || item.name === 'GPU') && item.value.toLocaleString()}
                  {item.name === 'Display' && `${device.displaySize}" ${device.refreshRate}Hz`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Multi-device comparison charts
  const benchmarkData = devices.map(device => ({
    name: device.name.split(' ').slice(0, 2).join(' '), // Shorten names for chart
    brand: device.brand,
    antutu: device.antutuScore || 0,
    geekbenchSingle: device.geekbenchSingle || 0,
    geekbenchMulti: device.geekbenchMulti || 0,
    price: device.price / 100, // Convert to dollars
    ram: device.ram,
    battery: device.batteryCapacity,
    storage: device.storage
  }));

  const valueData = devices.map(device => ({
    name: device.name.split(' ').slice(0, 2).join(' '),
    brand: device.brand,
    antutuPerDollar: device.antutuScore ? Math.round(device.antutuScore / (device.price / 100)) : 0,
    ramPerDollar: Math.round((device.ram * 1000) / (device.price / 100)),
    batteryPerDollar: Math.round((device.batteryCapacity * 10) / (device.price / 100)),
    price: device.price / 100
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="benchmarks" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="benchmarks" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Benchmarks
        </TabsTrigger>
        <TabsTrigger value="specs" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Specifications
        </TabsTrigger>
        <TabsTrigger value="value" className="flex items-center gap-2">
          <RadarIcon className="h-4 w-4" />
          Value Analysis
        </TabsTrigger>
      </TabsList>

      <TabsContent value="benchmarks" className="space-y-6">
        <div className="h-80">
          <h4 className="text-lg font-semibold mb-4">Performance Benchmarks</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                className="fill-muted-foreground text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="fill-muted-foreground text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="antutu" 
                name="AnTuTu Score" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="geekbenchSingle" 
                name="Geekbench Single" 
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{device.name}</span>
                <Badge variant="outline">{device.brand}</Badge>
              </div>
              <div className="space-y-1 text-sm">
                {device.antutuScore && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AnTuTu:</span>
                    <span className="font-medium">{device.antutuScore.toLocaleString()}</span>
                  </div>
                )}
                {device.geekbenchSingle && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Geekbench Single:</span>
                    <span className="font-medium">{device.geekbenchSingle.toLocaleString()}</span>
                  </div>
                )}
                {device.geekbenchMulti && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Geekbench Multi:</span>
                    <span className="font-medium">{device.geekbenchMulti.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="specs" className="space-y-6">
        <div className="h-80">
          <h4 className="text-lg font-semibold mb-4">Hardware Specifications</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                className="fill-muted-foreground text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="fill-muted-foreground text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="ram" 
                name="RAM (GB)" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="storage" 
                name="Storage (GB)" 
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="battery" 
                name="Battery (mAh)" 
                fill="hsl(var(--accent))"
                radius={[4, 4, 0, 0]}
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="value" className="space-y-6">
        <div className="h-80">
          <h4 className="text-lg font-semibold mb-4">Value for Money Analysis</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                className="fill-muted-foreground text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="fill-muted-foreground text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="antutuPerDollar" 
                name="AnTuTu per $" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="ramPerDollar" 
                name="RAM Score per $" 
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => {
            const antutuPerDollar = device.antutuScore ? Math.round(device.antutuScore / (device.price / 100)) : 0;
            const ramPerDollar = Math.round((device.ram * 1000) / (device.price / 100));
            
            return (
              <div key={device.id} className="p-4 bg-muted/20 rounded-lg text-center">
                <div className="font-semibold mb-2">{device.name}</div>
                <div className="text-2xl font-bold text-primary mb-2">
                  ${(device.price / 100).toLocaleString()}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {antutuPerDollar > 0 && (
                    <div>{antutuPerDollar} AnTuTu per $</div>
                  )}
                  <div>{ramPerDollar} RAM score per $</div>
                  <div>${Math.round((device.price / 100) / device.ram)} per GB RAM</div>
                </div>
              </div>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
