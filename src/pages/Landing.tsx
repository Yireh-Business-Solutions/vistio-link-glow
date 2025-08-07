import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Users, Share2, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-neon-blue" />
          <span className="text-2xl font-bold text-foreground">Vistio</span>
        </div>
        <div className="space-x-4">
          <Link to="/auth">
            <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-background">
              Login
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-primary hover:shadow-neon transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Digital Business Cards
            <br />
            Reimagined
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create stunning digital business cards with customizable layouts, generate professional email signatures 
            with custom patterns and colors, and build virtual backgrounds for video calls - all from one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                Create Your Card
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              ✨ Free • No Credit Card Required • Instant Setup
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need for Professional Networking</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From customizable digital cards to branded email signatures and virtual backgrounds, 
            we've got all your professional branding needs covered.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border border-border hover:border-neon-blue transition-all duration-300 hover:shadow-neon">
            <Users className="h-12 w-12 text-neon-blue mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Customizable Cards</h3>
            <p className="text-muted-foreground mb-4">
              Design your perfect digital business card with customizable image sizes, 
              visible sections, and theme colors. Control exactly what contacts see.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Adjustable profile & logo sizes</li>
              <li>• Show/hide contact sections</li>
              <li>• 20+ custom links supported</li>
              <li>• QR code generation</li>
            </ul>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border border-border hover:border-neon-green transition-all duration-300 hover:shadow-[0_0_20px_hsl(120_100%_50%_/_0.5)]">
            <Share2 className="h-12 w-12 text-neon-green mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Email Signatures</h3>
            <p className="text-muted-foreground mb-4">
              Generate branded email signatures with custom colors, patterns, and gradients. 
              Professional styling that matches your card design.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Custom color schemes</li>
              <li>• Pattern backgrounds (dots, grid, waves)</li>
              <li>• Gradient or solid backgrounds</li>
              <li>• One-click HTML export</li>
            </ul>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border border-border hover:border-neon-purple transition-all duration-300 hover:shadow-[0_0_20px_hsl(280_100%_70%_/_0.5)]">
            <BarChart3 className="h-12 w-12 text-neon-purple mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Virtual Backgrounds</h3>
            <p className="text-muted-foreground mb-4">
              Create professional virtual backgrounds for video calls featuring your branding. 
              Multiple patterns and gradient options available.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Grid, dots, waves, circuit patterns</li>
              <li>• Custom gradient directions</li>
              <li>• Brand color integration</li>
              <li>• High-resolution downloads</li>
            </ul>
          </Card>
        </div>

        {/* Additional Feature Highlights */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 bg-card/30 border border-border">
            <h4 className="text-lg font-semibold mb-3 text-neon-blue">Smart Analytics</h4>
            <p className="text-muted-foreground text-sm">
              Track who views your card, which links get clicked, and when contacts download your information. 
              Understand your networking effectiveness with detailed insights.
            </p>
          </Card>
          
          <Card className="p-6 bg-card/30 border border-border">
            <h4 className="text-lg font-semibold mb-3 text-neon-pink">Instant Sharing</h4>
            <p className="text-muted-foreground text-sm">
              Share via QR codes, direct links, or social media. Contacts can save your information 
              directly to their phone contacts with one tap.
            </p>
          </Card>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-xl text-muted-foreground">
            From business cards to email signatures and virtual backgrounds - all perfectly synchronized
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-1">John Doe</h3>
                <p className="text-blue-100 mb-2">Senior Developer</p>
                <p className="text-blue-200 text-sm">Tech Solutions Inc.</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <h4 className="font-semibold mb-2">Digital Business Card</h4>
              <p className="text-sm text-muted-foreground">Customizable layouts & themes</p>
            </div>
          </div>

          {/* Email Signature Preview */}
          <div className="relative">
            <div className="bg-white border rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">John Doe</p>
                  <p className="text-gray-600 text-xs">Senior Developer</p>
                </div>
              </div>
              <div className="border-l-2 border-green-400 pl-3">
                <p className="text-xs text-gray-600">john@techsolutions.com | +1 (555) 123-4567</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <h4 className="font-semibold mb-2">Email Signature</h4>
              <p className="text-sm text-muted-foreground">Custom colors & patterns</p>
            </div>
          </div>

          {/* Virtual Background Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg aspect-video relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-white/30"></div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs opacity-80">Tech Solutions Inc.</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <h4 className="font-semibold mb-2">Virtual Background</h4>
              <p className="text-sm text-muted-foreground">Professional video call branding</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Professional Brand?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals creating stunning digital business cards, 
            email signatures, and virtual backgrounds with Vistio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                Start Free Today
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              Get started in under 2 minutes
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 text-center text-sm text-muted-foreground max-w-md mx-auto">
            <div>
              <div className="text-2xl font-bold text-neon-blue">10K+</div>
              <div>Cards Created</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-green">50K+</div>
              <div>Signatures Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-purple">5K+</div>
              <div>Backgrounds Downloaded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex justify-center items-center">
          <p className="text-muted-foreground">© 2024 Vistio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;