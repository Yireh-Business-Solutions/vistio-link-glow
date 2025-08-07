import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  X, 
  Instagram,
  Download,
  Share,
  Sparkles,
  QrCode,
  MessageCircle,
  ExternalLink,
  Facebook
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card as CardType } from "@/hooks/useCards";
import QRCode from "qrcode";
import LivePreview from "@/components/cards/LivePreview";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [card, setCard] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const fetchCard = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching card:', error);
          setCard(null);
        } else {
          setCard(data);
          // Increment view count and track analytics
          const newViewCount = (data.view_count || 0) + 1;
          await supabase
            .from('cards')
            .update({ view_count: newViewCount })
            .eq('id', data.id);
          
          // Log analytics event (could be expanded to separate analytics table)
          console.log('Card view tracked:', {
            cardId: data.id,
            cardName: data.name,
            viewCount: newViewCount,
            timestamp: new Date().toISOString()
          });
          
          // Generate QR code
          const cardUrl = window.location.href;
          const qrUrl = await QRCode.toDataURL(cardUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: getThemeColor(data.color_theme),
              light: '#00000000'
            }
          });
          setQrCodeUrl(qrUrl);
        }
      } catch (error) {
        console.error('Error:', error);
        setCard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [slug]);

  const getThemeColor = (theme: string | null) => {
    const themes = {
      'neon-blue': '#00BFFF',
      'neon-green': '#00FF00',
      'neon-purple': '#9D4EDD',
      'neon-pink': '#FF69B4'
    };
    return themes[(theme || 'neon-blue') as keyof typeof themes] || themes['neon-blue'];
  };

  const getThemeGradient = (theme: string | null) => {
    const gradients = {
      'neon-blue': 'bg-gradient-to-br from-blue-500 to-blue-700',
      'neon-green': 'bg-gradient-to-br from-green-500 to-green-700',
      'neon-purple': 'bg-gradient-to-br from-purple-500 to-purple-700',
      'neon-pink': 'bg-gradient-to-br from-pink-500 to-pink-700'
    };
    return gradients[(theme || 'neon-blue') as keyof typeof gradients] || gradients['neon-blue'];
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    setSubmittingContact(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          card_id: card.id,
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          source: 'card_form'
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Contact shared successfully!",
          description: `Your information has been shared with ${card.name}.`
        });
        setContactForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share contact information.",
        variant: "destructive"
      });
    } finally {
      setSubmittingContact(false);
    }
  };

  const generateVCF = () => {
    if (!card) return;

    const vcfData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name}`,
      card.title ? `TITLE:${card.title}` : '',
      card.company ? `ORG:${card.company}` : '',
      card.email ? `EMAIL:${card.email}` : '',
      card.phone ? `TEL:${card.phone}` : '',
      card.work_phone ? `TEL;TYPE=WORK:${card.work_phone}` : '',
      card.address ? `ADR:;;${card.address};;;;` : '',
      card.website ? `URL:${card.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcfData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.name.replace(/\s+/g, '_')}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card?.name}'s Digital Business Card`,
          text: `Check out ${card?.name}'s digital business card`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied to clipboard!" });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Card Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The business card you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button className="bg-gradient-primary hover:shadow-neon transition-all duration-300">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const themeColor = getThemeColor(card.color_theme);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-neon-blue" />
          <span className="text-2xl font-bold text-foreground">Vistio</span>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={shareCard} size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={generateVCF} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Save Contact
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Professional Business Card Layout */}
        <LivePreview formData={card} customLinks={[]} />

        {/* QR Code and Contact Form Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* QR Code */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" style={{ color: themeColor }} />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {qrCodeUrl && (
                <div className="space-y-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto rounded-lg"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = `${card.name}_qr_code.png`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle>Share Your Info with {card.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Optional message..."
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={submittingContact}
                  className="w-full"
                  style={{ backgroundColor: themeColor }}
                >
                  {submittingContact ? "Sharing..." : "Share Contact"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;