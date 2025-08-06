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
  QrCode,
  MessageCircle,
  ExternalLink
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
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section with Profile Image */}
          <div className={`relative h-80 ${getThemeGradient(card.color_theme)}`}>
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Company Logo */}
            {card.company_logo_url && (
              <div className="absolute top-4 right-4">
                <img
                  src={card.company_logo_url}
                  alt={`${card.company} logo`}
                  className="w-16 h-16 bg-white rounded-lg p-2 shadow-lg object-contain"
                />
              </div>
            )}
            
            {/* Large Profile Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              {card.profile_image_url ? (
                <img
                  src={card.profile_image_url}
                  alt={card.name}
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-4 border-white/20"
                />
              ) : (
                <div className="w-48 h-48 rounded-2xl bg-white/90 flex items-center justify-center shadow-2xl">
                  <User className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6">
            {/* Basic Info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{card.name}</h1>
              {card.title && <p className="text-lg text-gray-600 mb-2">{card.title}</p>}
              {card.company && <p className="text-md text-gray-500 font-medium mb-3">{card.company}</p>}
              {card.bio && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{card.bio}"</p>
                </div>
              )}
            </div>

            {/* Certifications/Badges Section */}
            {(card.certifications || card.awards) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {card.certifications?.split(',').map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {cert.trim()}
                    </span>
                  ))}
                  {card.awards?.split(',').map((award, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                    >
                      {award.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              {card.phone && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a href={`tel:${card.phone}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {card.phone}
                      </a>
                      <p className="text-xs text-gray-500">mobile</p>
                    </div>
                  </div>
                </div>
              )}
              
              {card.work_phone && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a href={`tel:${card.work_phone}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {card.work_phone}
                      </a>
                      <p className="text-xs text-gray-500">work</p>
                    </div>
                  </div>
                </div>
              )}

              {card.whatsapp && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a 
                        href={`https://api.whatsapp.com/send?phone=${card.whatsapp.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-green-600"
                      >
                        {card.whatsapp}
                      </a>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                    </div>
                  </div>
                </div>
              )}

              {card.email && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a href={`mailto:${card.email}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {card.email}
                      </a>
                      <p className="text-xs text-gray-500">work</p>
                    </div>
                  </div>
                </div>
              )}

              {card.website && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <a
                        href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-purple-600"
                      >
                        {card.website.replace(/^https?:\/\//, '')}
                      </a>
                      <p className="text-xs text-gray-500">website</p>
                    </div>
                  </div>
                </div>
              )}

              {card.address && (
                <div className="flex items-start justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 leading-relaxed">{card.address}</p>
                      <p className="text-xs text-gray-500">work</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(card.linkedin_url || card.twitter_url || card.instagram_url) && (
              <div className="space-y-3 mb-6">
                {card.linkedin_url && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <a
                          href={card.linkedin_url.startsWith('http') ? card.linkedin_url : `https://${card.linkedin_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          My LinkedIn Page
                        </a>
                        <p className="text-xs text-gray-500">professional</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                
                {card.twitter_url && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                        <Twitter className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <a
                          href={card.twitter_url.startsWith('http') ? card.twitter_url : `https://twitter.com/${card.twitter_url.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-900 hover:text-sky-600"
                        >
                          Follow on Twitter
                        </a>
                        <p className="text-xs text-gray-500">social</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                
                {card.instagram_url && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <a
                          href={card.instagram_url.startsWith('http') ? card.instagram_url : `https://instagram.com/${card.instagram_url.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-900 hover:text-pink-600"
                        >
                          Follow on Instagram
                        </a>
                        <p className="text-xs text-gray-500">social</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            )}

            {/* Save Contact Button */}
            <div className="text-center">
              <Button 
                onClick={generateVCF}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                SAVE CONTACT
              </Button>
            </div>
          </div>
        </div>

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