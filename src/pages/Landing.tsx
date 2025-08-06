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
            Create stunning digital business cards, generate professional email signatures, 
            and build meaningful connections with our modern platform.
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              Create Your Card
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border border-border hover:border-neon-blue transition-all duration-300 hover:shadow-neon">
            <Users className="h-12 w-12 text-neon-blue mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Smart Networking</h3>
            <p className="text-muted-foreground">
              Share your contact information instantly with QR codes and smart links. 
              Never lose a connection again.
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border border-border hover:border-neon-green transition-all duration-300 hover:shadow-[0_0_20px_hsl(120_100%_50%_/_0.5)]">
            <Share2 className="h-12 w-12 text-neon-green mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Email Signatures</h3>
            <p className="text-muted-foreground">
              Generate professional email signatures and virtual backgrounds 
              automatically from your digital business card.
            </p>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border border-border hover:border-neon-purple transition-all duration-300 hover:shadow-[0_0_20px_hsl(280_100%_70%_/_0.5)]">
            <BarChart3 className="h-12 w-12 text-neon-purple mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Analytics</h3>
            <p className="text-muted-foreground">
              Track card views, connection requests, and engagement metrics 
              to understand your networking impact.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Networking?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals already using Vistio to create meaningful connections.
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              Start Free Today
            </Button>
          </Link>
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