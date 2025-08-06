import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Vistio</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild className="shadow-neon hover:shadow-glow transition-all duration-300">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Digital Business Cards
              <br />
              <span className="text-foreground">Reimagined</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Create stunning digital business cards, share them instantly, and track your networking success. 
              Professional, eco-friendly, and always up-to-date.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              asChild 
              className="text-lg px-8 py-6 shadow-neon hover:shadow-glow transition-all duration-300"
            >
              <Link to="/auth" className="flex items-center gap-2">
                Start Creating <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Instant Sharing</h3>
            <p className="text-muted-foreground">
              Share your card with a QR code, link, or tap. No apps required for recipients.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Always Updated</h3>
            <p className="text-muted-foreground">
              Update your info once, and everyone with your card sees the changes instantly.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Rich Analytics</h3>
            <p className="text-muted-foreground">
              Track views, shares, and new connections to optimize your networking.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to modernize your networking?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals using Vistio to make lasting connections.
          </p>
          <Button 
            size="lg" 
            asChild 
            className="text-lg px-8 py-6 shadow-neon hover:shadow-glow transition-all duration-300"
          >
            <Link to="/auth" className="flex items-center gap-2">
              Create Your Card <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 Vistio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;