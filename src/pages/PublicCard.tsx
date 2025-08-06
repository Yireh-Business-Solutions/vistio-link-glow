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
  Twitter, 
  Instagram,
  Download,
  Share,
  Sparkles,
  QrCode
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card as CardType } from "@/hooks/useCards";
import QRCode from "qrcode";

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
          // Increment view count
          await supabase
            .from('cards')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
          
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
          message: contactForm.message
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <Card 
              className="bg-card/50 backdrop-blur-sm border-2 transition-all duration-300"
              style={{ 
                borderColor: themeColor,
                boxShadow: `0 0 30px ${themeColor}30`
              }}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Profile Picture */}
                  <div 
                    className="w-32 h-32 rounded-full mx-auto border-4 flex items-center justify-center"
                    style={{ borderColor: themeColor }}
                  >
                    {card.profile_image_url ? (
                      <img 
                        src={card.profile_image_url} 
                        alt={card.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>

                  {/* Name and Title */}
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{card.name}</h1>
                    {card.title && (
                      <p className="text-xl text-muted-foreground">{card.title}</p>
                    )}
                    {card.company && (
                      <p className="text-lg text-muted-foreground mt-1">{card.company}</p>
                    )}
                  </div>

                  {/* Bio */}
                  {card.bio && (
                    <p className="text-center max-w-lg mx-auto text-muted-foreground">
                      {card.bio}
                    </p>
                  )}

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    {card.email && (
                      <a 
                        href={`mailto:${card.email}`}
                        className="flex items-center justify-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <Mail className="h-5 w-5" style={{ color: themeColor }} />
                        <span>{card.email}</span>
                      </a>
                    )}
                    
                    {card.phone && (
                      <a 
                        href={`tel:${card.phone}`}
                        className="flex items-center justify-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <Phone className="h-5 w-5" style={{ color: themeColor }} />
                        <span>{card.phone}</span>
                      </a>
                    )}
                    
                    {card.website && (
                      <a 
                        href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <Globe className="h-5 w-5" style={{ color: themeColor }} />
                        <span className="truncate">{card.website}</span>
                      </a>
                    )}
                    
                    {card.address && (
                      <div className="flex items-center justify-center gap-3 p-3 rounded-lg border border-border">
                        <MapPin className="h-5 w-5" style={{ color: themeColor }} />
                        <span className="text-center">{card.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 pt-4">
                    {card.linkedin_url && (
                      <a 
                        href={card.linkedin_url.startsWith('http') ? card.linkedin_url : `https://${card.linkedin_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge 
                          variant="outline" 
                          className="p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                          style={{ borderColor: themeColor }}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Badge>
                      </a>
                    )}
                    {card.twitter_url && (
                      <a 
                        href={card.twitter_url.startsWith('http') ? card.twitter_url : `https://twitter.com/${card.twitter_url.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge 
                          variant="outline" 
                          className="p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                          style={{ borderColor: themeColor }}
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Badge>
                      </a>
                    )}
                    {card.instagram_url && (
                      <a 
                        href={card.instagram_url.startsWith('http') ? card.instagram_url : `https://instagram.com/${card.instagram_url.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge 
                          variant="outline" 
                          className="p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                          style={{ borderColor: themeColor }}
                        >
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </Badge>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
    </div>
  );
};

export default PublicCard;