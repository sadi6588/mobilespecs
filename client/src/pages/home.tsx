import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeviceCard from "@/components/device-card";
import SearchFilters from "@/components/search-filters";
import { 
  Smartphone, 
  Database, 
  BarChart3, 
  Filter, 
  Star, 
  Zap, 
  Search,
  TrendingUp,
  Shield,
  Cpu
} from "lucide-react";
import type { Device, Brand } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const { data: featuredDevices, isLoading: featuredLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices/featured'],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const { data: allDevices } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(brand);
  };

  const filteredDevices = featuredDevices?.filter(device => {
    const matchesSearch = !searchQuery || 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = !selectedBrand || device.brand === selectedBrand;
    
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-primary rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-secondary rounded-lg rotate-45"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Advanced Mobile</span><br />
            <span className="text-foreground">Device Comparison</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
            Discover, compare, and analyze mobile devices with comprehensive specifications, 
            performance benchmarks, and detailed technical insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link href="/compare">
              <Button className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all">
                <BarChart3 className="mr-2 h-5 w-5" />
                Start Comparing
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 text-lg font-semibold"
              onClick={() => document.getElementById('devices')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Explore Devices
            </Button>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <Database className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{allDevices?.length || 0}+ Devices</h3>
                <p className="text-muted-foreground">Comprehensive database of latest mobile devices</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-border hover:border-secondary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Specs</h3>
                <p className="text-muted-foreground">Up-to-date specifications and performance data</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Compare</h3>
                <p className="text-muted-foreground">Advanced comparison tools and insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 px-4 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-background border-border focus:ring-primary"
                />
              </div>
              
              <SearchFilters 
                brands={brands || []}
                onBrandChange={handleBrandFilter}
                selectedBrand={selectedBrand}
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {filteredDevices?.length || 0} devices found
              </span>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Filter className="mr-2 h-4 w-4" />
                Advanced
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Devices */}
      <section id="devices" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Devices</h2>
            <p className="text-muted-foreground text-lg">Latest and most popular mobile devices</p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-card rounded-xl h-96 border border-border"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDevices?.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3">
              Load More Devices
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Brands</h2>
            <p className="text-muted-foreground text-lg">Explore devices from leading manufacturers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {brands?.map((brand) => (
              <Card 
                key={brand.id} 
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => handleBrandFilter(brand.name)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{brand.name}</h3>
                  <p className="text-muted-foreground text-sm">{brand.deviceCount} devices</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose MobileSpec Pro?</h2>
            <p className="text-muted-foreground text-lg">The most comprehensive mobile comparison platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Database</h3>
                <p className="text-muted-foreground">Over 1,000+ devices with detailed specifications and real-world performance data.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-secondary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance Benchmarks</h3>
                <p className="text-muted-foreground">Real benchmark scores and performance metrics to help you make informed decisions.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced Filtering</h3>
                <p className="text-muted-foreground">Smart filters to find devices that match your exact requirements and budget.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-secondary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Reviews</h3>
                <p className="text-muted-foreground">In-depth reviews from industry experts and real user feedback.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mobile Optimized</h3>
                <p className="text-muted-foreground">Perfect experience across all devices with responsive design.</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-secondary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">Optimized for speed with instant search and smooth navigation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold gradient-text">MobileSpec Pro</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Advanced mobile device comparison platform with comprehensive specifications and performance insights.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare Devices</Link></li>
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Browse Brands</Link></li>
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Latest Reviews</Link></li>
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Price Tracker</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Flagship Phones</span></li>
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Budget Devices</span></li>
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Gaming Phones</span></li>
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Camera Phones</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/deployment" className="text-muted-foreground hover:text-primary transition-colors">Deployment Guide</Link></li>
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">API Documentation</span></li>
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Support</span></li>
                <li><span className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">About</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 MobileSpec Pro. All rights reserved. Built with ❤️ for mobile enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
