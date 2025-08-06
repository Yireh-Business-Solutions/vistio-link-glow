import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, Share, User, Mail, Phone, MapPin, Globe, Linkedin, Twitter, Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  color_theme: string;
}

interface CreateCardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateCardForm = ({ onSuccess, onCancel }: CreateCardFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CardData>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    color_theme: "neon-blue"
  });

  const colorThemes = [
    { value: "neon-blue", label: "Neon Blue", color: "hsl(195 100% 50%)" },
    { value: "neon-green", label: "Neon Green", color: "hsl(120 100% 50%)" },
    { value: "neon-purple", label: "Neon Purple", color: "hsl(280 100% 70%)" },
    { value: "neon-pink", label: "Neon Pink", color: "hsl(320 100% 70%)" }
  ];

  const handleInputChange = (field: keyof CardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const slug = generateSlug(formData.name);
      
      const { error } = await supabase
        .from('cards')
        .insert({
          user_id: user.id,
          slug,
          ...formData
        });

      if (error) {
        toast({
          title: "Error creating card",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Card created successfully!",
          description: "Your digital business card is ready to share."
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTheme = colorThemes.find(theme => theme.value === formData.color_theme);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-neon-blue" />
            Create Business Card
          </CardTitle>
          <CardDescription>
            Fill in your information to create your digital business card
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-10 min-h-[80px]"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social & Web</h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      className="pl-10"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        className="pl-10"
                        value={formData.linkedin_url}
                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                        placeholder="linkedin.com/in/username"
                      />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twitter"
                        className="pl-10"
                        value={formData.twitter_url}
                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        className="pl-10"
                        value={formData.instagram_url}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Color Theme */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Theme</h3>
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select value={formData.color_theme} onValueChange={(value) => handleInputChange('color_theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorThemes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: theme.color }}
                          />
                          {theme.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-primary hover:shadow-neon transition-all duration-300">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Card"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-neon-green" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your card will look to others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border-2 transition-all duration-300"
            style={{ 
              borderColor: selectedTheme?.color,
              boxShadow: `0 0 20px ${selectedTheme?.color}30`
            }}
          >
            <div className="text-center space-y-4">
              {/* Profile Picture Placeholder */}
              <div 
                className="w-24 h-24 rounded-full mx-auto border-2 flex items-center justify-center"
                style={{ borderColor: selectedTheme?.color }}
              >
                <User className="h-12 w-12 text-muted-foreground" />
              </div>

              {/* Name and Title */}
              <div>
                <h2 className="text-2xl font-bold">
                  {formData.name || "Your Name"}
                </h2>
                {formData.title && (
                  <p className="text-muted-foreground">{formData.title}</p>
                )}
                {formData.company && (
                  <p className="text-sm text-muted-foreground">{formData.company}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                {formData.email && (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" style={{ color: selectedTheme?.color }} />
                    <span>{formData.email}</span>
                  </div>
                )}
                {formData.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" style={{ color: selectedTheme?.color }} />
                    <span>{formData.phone}</span>
                  </div>
                )}
                {formData.website && (
                  <div className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" style={{ color: selectedTheme?.color }} />
                    <span className="truncate">{formData.website}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3 pt-2">
                {formData.linkedin_url && (
                  <Badge variant="outline" style={{ borderColor: selectedTheme?.color }}>
                    <Linkedin className="h-3 w-3 mr-1" />
                    LinkedIn
                  </Badge>
                )}
                {formData.twitter_url && (
                  <Badge variant="outline" style={{ borderColor: selectedTheme?.color }}>
                    <Twitter className="h-3 w-3 mr-1" />
                    Twitter
                  </Badge>
                )}
                {formData.instagram_url && (
                  <Badge variant="outline" style={{ borderColor: selectedTheme?.color }}>
                    <Instagram className="h-3 w-3 mr-1" />
                    Instagram
                  </Badge>
                )}
              </div>

              {/* Action Buttons Preview */}
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Save Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCardForm;