import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Eye, 
  Share, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Plus, 
  X,
  Settings
} from "lucide-react";
import ImageUpload from "./ImageUpload";
import CardCustomization from "./CardCustomization";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LinkData {
  title: string;
  url: string;
}

interface VisibleSections {
  contact: boolean;
  social: boolean;
  professional: boolean;
  images: boolean;
  custom_links: boolean;
}

interface SignatureStyle {
  background: 'gradient' | 'solid' | 'pattern';
  pattern: 'none' | 'dots' | 'grid' | 'waves';
  custom_colors: {
    primary: string | null;
    secondary: string | null;
  };
}

interface BackgroundStyle {
  pattern: 'grid' | 'dots' | 'waves' | 'hexagon' | 'circuit';
  gradient_direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
  custom_colors: {
    start: string | null;
    end: string | null;
  };
}

interface CardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  work_phone?: string;
  whatsapp?: string;
  address: string;
  website: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  bio?: string;
  certifications?: string;
  awards?: string;
  specialties?: string;
  profile_image_url?: string;
  company_logo_url?: string;
  image_1_url?: string;
  image_2_url?: string;
  image_3_url?: string;
  image_4_url?: string;
  image_5_url?: string;
  color_theme: string;
  profile_image_size: string;
  company_logo_size: string;
  visible_sections: VisibleSections;
  signature_style: SignatureStyle;
  background_style: BackgroundStyle;
}

interface CreateCardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

const CreateCardForm = ({ onSuccess, onCancel, initialData }: CreateCardFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CardData>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    work_phone: "",
    whatsapp: "",
    address: "",
    website: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    bio: "",
    certifications: "",
    awards: "",
    specialties: "",
    color_theme: "neon-blue",
    profile_image_size: "medium",
    company_logo_size: "small",
    visible_sections: {
      contact: true,
      social: true,
      professional: true,
      images: true,
      custom_links: true
    },
    signature_style: {
      background: "gradient",
      pattern: "none",
      custom_colors: {
        primary: null,
        secondary: null
      }
    },
    background_style: {
      pattern: "grid",
      gradient_direction: "diagonal",
      custom_colors: {
        start: null,
        end: null
      }
    }
  });

  const [customLinks, setCustomLinks] = useState<LinkData[]>([]);

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData) {
      const visibleSections = typeof initialData.visible_sections === 'object' 
        ? initialData.visible_sections 
        : { contact: true, social: true, professional: true, images: true, custom_links: true };
      
      const signatureStyle = typeof initialData.signature_style === 'object'
        ? initialData.signature_style
        : { background: "gradient", pattern: "none", custom_colors: { primary: null, secondary: null } };
        
      const backgroundStyle = typeof initialData.background_style === 'object'
        ? initialData.background_style
        : { pattern: "grid", gradient_direction: "diagonal", custom_colors: { start: null, end: null } };

      setFormData({
        name: initialData.name || "",
        title: initialData.title || "",
        company: initialData.company || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        work_phone: initialData.work_phone || "",
        whatsapp: initialData.whatsapp || "",
        address: initialData.address || "",
        website: initialData.website || "",
        linkedin_url: initialData.linkedin_url || "",
        twitter_url: initialData.twitter_url || "",
        instagram_url: initialData.instagram_url || "",
        bio: initialData.bio || "",
        certifications: initialData.certifications || "",
        awards: initialData.awards || "",
        specialties: initialData.specialties || "",
        profile_image_url: initialData.profile_image_url || "",
        company_logo_url: initialData.company_logo_url || "",
        image_1_url: initialData.image_1_url || "",
        image_2_url: initialData.image_2_url || "",
        image_3_url: initialData.image_3_url || "",
        image_4_url: initialData.image_4_url || "",
        image_5_url: initialData.image_5_url || "",
        color_theme: initialData.color_theme || "neon-blue",
        profile_image_size: initialData.profile_image_size || "medium",
        company_logo_size: initialData.company_logo_size || "small",
        visible_sections: visibleSections,
        signature_style: signatureStyle,
        background_style: backgroundStyle
      });

      // Extract custom links from initial data
      const links: LinkData[] = [];
      for (let i = 1; i <= 20; i++) {
        const title = initialData[`link_${i}_title`];
        const url = initialData[`link_${i}_url`];
        if (title && url) {
          links.push({ title, url });
        }
      }
      setCustomLinks(links);
    }
  }, [initialData]);

  const colorThemes = [
    { value: "neon-blue", label: "Neon Blue", color: "hsl(195 100% 50%)" },
    { value: "neon-green", label: "Neon Green", color: "hsl(120 100% 50%)" },
    { value: "neon-purple", label: "Neon Purple", color: "hsl(280 100% 70%)" },
    { value: "neon-pink", label: "Neon Pink", color: "hsl(320 100% 70%)" }
  ];

  const handleInputChange = (field: keyof CardData, value: string | VisibleSections | SignatureStyle | BackgroundStyle) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 40); // Leave room for timestamp
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  };

  const addCustomLink = () => {
    if (customLinks.length < 20) {
      setCustomLinks([...customLinks, { title: "", url: "" }]);
    }
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const updateCustomLink = (index: number, field: keyof LinkData, value: string) => {
    const updated = customLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    setCustomLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("No user found when trying to create/update card");
      return;
    }

    console.log(initialData ? "Starting card update" : "Starting card creation", "for user:", user.id);
    setIsLoading(true);
    
    try {
      // Prepare links data for database
      const linksData: any = {};
      customLinks.forEach((link, index) => {
        if (link.title && link.url) {
          linksData[`link_${index + 1}_title`] = link.title;
          linksData[`link_${index + 1}_url`] = link.url;
        }
      });

      const cardData = {
        ...formData,
        ...linksData
      };

      if (initialData) {
        // Update existing card
        console.log("Updating card data:", cardData);
        
        const { data, error } = await supabase
          .from('cards')
          .update(cardData)
          .eq('id', initialData.id)
          .select();

        console.log("Card update result:", { data, error });

        if (error) {
          console.error("Database error updating card:", error);
          toast({
            title: "Error updating card",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log("Card updated successfully:", data);
          toast({
            title: "Card updated successfully!",
            description: "Your digital business card has been updated."
          });
          onSuccess?.();
        }
      } else {
        // Create new card
        const slug = generateSlug(formData.name);
        console.log("Generated slug:", slug);
        
        const newCardData = {
          user_id: user.id,
          slug,
          ...cardData
        };

        console.log("Inserting card data:", newCardData);
        
        const { data, error } = await supabase
          .from('cards')
          .insert(newCardData)
          .select();

        console.log("Card insertion result:", { data, error });

        if (error) {
          console.error("Database error creating card:", error);
          toast({
            title: "Error creating card",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log("Card created successfully:", data);
          toast({
            title: "Card created successfully!",
            description: "Your digital business card is ready to share."
          });
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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
      <div className="space-y-6">
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

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Details</h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell people about yourself..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work_phone">Work Phone</Label>
                    <Input
                      id="work_phone"
                      type="tel"
                      value={formData.work_phone}
                      onChange={(e) => handleInputChange('work_phone', e.target.value)}
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="AWS Certified, PMP, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="awards">Awards (comma-separated)</Label>
                  <Input
                    id="awards"
                    value={formData.awards}
                    onChange={(e) => handleInputChange('awards', e.target.value)}
                    placeholder="Employee of the Year, Innovation Award, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => handleInputChange('specialties', e.target.value)}
                    placeholder="React, Project Management, Sales, etc."
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              
              <div className="space-y-4">
                <ImageUpload
                  bucketName="card-images"
                  currentUrl={formData.profile_image_url}
                  onUpload={(url) => handleInputChange('profile_image_url', url)}
                  onRemove={() => handleInputChange('profile_image_url', '')}
                  label="Profile Image"
                />

                <ImageUpload
                  bucketName="company-logos"
                  currentUrl={formData.company_logo_url}
                  onUpload={(url) => handleInputChange('company_logo_url', url)}
                  onRemove={() => handleInputChange('company_logo_url', '')}
                  label="Company Logo"
                />

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <ImageUpload
                      key={num}
                      bucketName="card-images"
                      currentUrl={formData[`image_${num}_url` as keyof CardData] as string}
                      onUpload={(url) => handleInputChange(`image_${num}_url` as keyof CardData, url)}
                      onRemove={() => handleInputChange(`image_${num}_url` as keyof CardData, '')}
                      label={`Gallery Image ${num}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Custom Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Custom Links</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomLink}
                  disabled={customLinks.length >= 20}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
              
              <div className="space-y-3">
                {customLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Link Title</Label>
                      <Input
                        value={link.title}
                        onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                        placeholder="Portfolio, Blog, etc."
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {customLinks.length === 0 && (
                  <p className="text-sm text-muted-foreground">No custom links added yet.</p>
                )}
                {customLinks.length >= 20 && (
                  <p className="text-sm text-muted-foreground">Maximum 20 links allowed.</p>
                )}
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
                {isLoading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Card" : "Create Card")}
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

        {/* Customization Options */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-neon-purple" />
              Customization Options
            </CardTitle>
            <CardDescription>
              Customize your card layout, signature style, and virtual backgrounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardCustomization
              profileImageSize={formData.profile_image_size}
              companyLogoSize={formData.company_logo_size}
              visibleSections={formData.visible_sections}
              signatureStyle={formData.signature_style}
              backgroundStyle={formData.background_style}
              onProfileImageSizeChange={(size) => handleInputChange('profile_image_size', size)}
              onCompanyLogoSizeChange={(size) => handleInputChange('company_logo_size', size)}
              onVisibleSectionsChange={(sections) => handleInputChange('visible_sections', sections)}
              onSignatureStyleChange={(style) => handleInputChange('signature_style', style)}
              onBackgroundStyleChange={(style) => handleInputChange('background_style', style)}
            />
          </CardContent>
        </Card>
      </div>

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