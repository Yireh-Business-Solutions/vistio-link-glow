import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Settings, Palette, Image, Eye } from "lucide-react";

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

interface CardCustomizationProps {
  profileImageSize: string;
  companyLogoSize: string;
  visibleSections: VisibleSections;
  signatureStyle: SignatureStyle;
  backgroundStyle: BackgroundStyle;
  onProfileImageSizeChange: (size: string) => void;
  onCompanyLogoSizeChange: (size: string) => void;
  onVisibleSectionsChange: (sections: VisibleSections) => void;
  onSignatureStyleChange: (style: SignatureStyle) => void;
  onBackgroundStyleChange: (style: BackgroundStyle) => void;
}

const CardCustomization = ({
  profileImageSize,
  companyLogoSize,
  visibleSections,
  signatureStyle,
  backgroundStyle,
  onProfileImageSizeChange,
  onCompanyLogoSizeChange,
  onVisibleSectionsChange,
  onSignatureStyleChange,
  onBackgroundStyleChange,
}: CardCustomizationProps) => {
  const imageSizes = [
    { value: 'small', label: 'Small (96px)' },
    { value: 'medium', label: 'Medium (192px)' },
    { value: 'large', label: 'Large (256px)' },
    { value: 'xlarge', label: 'Extra Large (320px)' }
  ];

  const logoSizes = [
    { value: 'small', label: 'Small (48px)' },
    { value: 'medium', label: 'Medium (64px)' },
    { value: 'large', label: 'Large (96px)' }
  ];

  const handleSectionToggle = (section: keyof VisibleSections) => {
    onVisibleSectionsChange({
      ...visibleSections,
      [section]: !visibleSections[section]
    });
  };

  const handleSignatureStyleChange = (field: keyof SignatureStyle, value: any) => {
    onSignatureStyleChange({
      ...signatureStyle,
      [field]: value
    });
  };

  const handleSignatureColorChange = (colorType: 'primary' | 'secondary', value: string) => {
    onSignatureStyleChange({
      ...signatureStyle,
      custom_colors: {
        ...signatureStyle.custom_colors,
        [colorType]: value
      }
    });
  };

  const handleBackgroundStyleChange = (field: keyof BackgroundStyle, value: any) => {
    onBackgroundStyleChange({
      ...backgroundStyle,
      [field]: value
    });
  };

  const handleBackgroundColorChange = (colorType: 'start' | 'end', value: string) => {
    onBackgroundStyleChange({
      ...backgroundStyle,
      custom_colors: {
        ...backgroundStyle.custom_colors,
        [colorType]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Image Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-neon-blue" />
            Image Sizing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-size">Profile Image Size</Label>
            <Select value={profileImageSize} onValueChange={onProfileImageSizeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {imageSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-size">Company Logo Size</Label>
            <Select value={companyLogoSize} onValueChange={onCompanyLogoSizeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {logoSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visible Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-neon-green" />
            Visible Sections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(visibleSections).map(([section, isVisible]) => (
            <div key={section} className="flex items-center justify-between">
              <Label htmlFor={section} className="capitalize">
                {section.replace('_', ' ')}
              </Label>
              <Switch
                id={section}
                checked={isVisible}
                onCheckedChange={() => handleSectionToggle(section as keyof VisibleSections)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email Signature Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-neon-purple" />
            Email Signature Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Background Style</Label>
            <Select 
              value={signatureStyle.background} 
              onValueChange={(value) => handleSignatureStyleChange('background', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="solid">Solid Color</SelectItem>
                <SelectItem value="pattern">Pattern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {signatureStyle.background === 'pattern' && (
            <div className="space-y-2">
              <Label>Pattern Type</Label>
              <Select 
                value={signatureStyle.pattern} 
                onValueChange={(value) => handleSignatureStyleChange('pattern', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="waves">Waves</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={signatureStyle.custom_colors.primary || '#000000'}
                onChange={(e) => handleSignatureColorChange('primary', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <Input
                type="color"
                value={signatureStyle.custom_colors.secondary || '#ffffff'}
                onChange={(e) => handleSignatureColorChange('secondary', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Virtual Background Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-neon-pink" />
            Virtual Background Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Select 
              value={backgroundStyle.pattern} 
              onValueChange={(value) => handleBackgroundStyleChange('pattern', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="waves">Waves</SelectItem>
                <SelectItem value="hexagon">Hexagon</SelectItem>
                <SelectItem value="circuit">Circuit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gradient Direction</Label>
            <Select 
              value={backgroundStyle.gradient_direction} 
              onValueChange={(value) => handleBackgroundStyleChange('gradient_direction', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="diagonal">Diagonal</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Color</Label>
              <Input
                type="color"
                value={backgroundStyle.custom_colors.start || '#000000'}
                onChange={(e) => handleBackgroundColorChange('start', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Color</Label>
              <Input
                type="color"
                value={backgroundStyle.custom_colors.end || '#ffffff'}
                onChange={(e) => handleBackgroundColorChange('end', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardCustomization;