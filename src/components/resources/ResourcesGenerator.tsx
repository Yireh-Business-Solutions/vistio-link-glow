import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card as CardType } from "@/hooks/useCards";
import QRCode from "qrcode";

interface ResourcesGeneratorProps {
  card: CardType;
}

const ResourcesGenerator = ({ card }: ResourcesGeneratorProps) => {
  const { toast } = useToast();
  const [emailSignature, setEmailSignature] = useState("");
  const [generating, setGenerating] = useState(false);

  const getThemeColor = (theme: string | null) => {
    const themes = {
      'neon-blue': '#00BFFF',
      'neon-green': '#00FF00', 
      'neon-purple': '#9D4EDD',
      'neon-pink': '#FF69B4'
    };
    return themes[(theme || 'neon-blue') as keyof typeof themes] || themes['neon-blue'];
  };

  const generateEmailSignature = () => {
    const defaultStyle = { background: 'gradient', pattern: 'none', custom_colors: { primary: null, secondary: null } };
    const style = (card.signature_style as any) || defaultStyle;
    const primaryColor = style.custom_colors?.primary || getThemeColor(card.color_theme);
    const secondaryColor = style.custom_colors?.secondary || '#ffffff';
    const cardUrl = `${window.location.origin}/card/${card.slug}`;
    
    let backgroundStyle = '';
    if (style.background === 'gradient') {
      backgroundStyle = `background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20); border-radius: 8px; padding: 15px;`;
    } else if (style.background === 'solid') {
      backgroundStyle = `background-color: ${primaryColor}10; border-radius: 8px; padding: 15px;`;
    } else if (style.background === 'pattern' && style.pattern !== 'none') {
      backgroundStyle = `background-color: ${secondaryColor}10; border-radius: 8px; padding: 15px;`;
    }
    
    const signature = `
<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333; ${backgroundStyle}">
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
    <tr>
      <td style="padding-right: 20px; vertical-align: top;">
        ${card.profile_image_url ? 
          `<img src="${card.profile_image_url}" alt="${card.name}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid ${primaryColor};" />` :
          `<div style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid ${primaryColor}; background: linear-gradient(135deg, ${primaryColor}30, ${primaryColor}10); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: ${primaryColor};">${card.name.charAt(0)}</div>`
        }
      </td>
      <td style="vertical-align: top;">
        <div style="margin-bottom: 5px;">
          <strong style="font-size: 16px; color: ${primaryColor};">${card.name}</strong>
        </div>
        ${card.title ? `<div style="margin-bottom: 3px; color: #666;">${card.title}</div>` : ''}
        ${card.company ? `<div style="margin-bottom: 8px; color: #666;">${card.company}</div>` : ''}
        ${card.email ? `<div style="margin-bottom: 3px;"><a href="mailto:${card.email}" style="color: ${primaryColor}; text-decoration: none;">${card.email}</a></div>` : ''}
        ${card.phone ? `<div style="margin-bottom: 3px;"><a href="tel:${card.phone}" style="color: ${primaryColor}; text-decoration: none;">${card.phone}</a></div>` : ''}
        ${card.website ? `<div style="margin-bottom: 8px;"><a href="${card.website.startsWith('http') ? card.website : `https://${card.website}`}" style="color: ${primaryColor}; text-decoration: none;">${card.website}</a></div>` : ''}
        <div style="margin-top: 10px;">
          <a href="${cardUrl}" style="background: ${primaryColor}; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; display: inline-block;">View Digital Card →</a>
        </div>
      </td>
    </tr>
  </table>
</div>`.trim();
    
    setEmailSignature(signature);
  };

  const copySignature = () => {
    navigator.clipboard.writeText(emailSignature);
    toast({
      title: "Signature copied!",
      description: "Email signature has been copied to your clipboard."
    });
  };

  const downloadQRCode = async () => {
    setGenerating(true);
    try {
      const cardUrl = `${window.location.origin}/card/${card.slug}`;
      const qrDataUrl = await QRCode.toDataURL(cardUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: getThemeColor(card.color_theme),
          light: '#FFFFFF'
        }
      });
      
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `${card.name.replace(/\s+/g, '_')}_qr_code.png`;
      link.click();
      
      toast({
        title: "QR Code downloaded!",
        description: "Your QR code has been saved to your downloads."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateVirtualBackground = async () => {
    setGenerating(true);
    try {
      // Create a canvas for the virtual background
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Set canvas size (16:9 aspect ratio for video calls)
      canvas.width = 1920;
      canvas.height = 1080;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle grid pattern
      ctx.strokeStyle = `${getThemeColor(card.color_theme)}20`;
      ctx.lineWidth = 1;
      const gridSize = 100;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add name and title in bottom right
      const themeColor = getThemeColor(card.color_theme);
      
      // Name
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(card.name, canvas.width - 60, canvas.height - 120);
      
      // Title and company
      if (card.title || card.company) {
        ctx.fillStyle = '#ffffff80';
        ctx.font = '32px Arial';
        const subtitle = [card.title, card.company].filter(Boolean).join(' • ');
        ctx.fillText(subtitle, canvas.width - 60, canvas.height - 70);
      }

      // Generate QR code for the corner
      const cardUrl = `${window.location.origin}/card/${card.slug}`;
      const qrDataUrl = await QRCode.toDataURL(cardUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: themeColor,
          light: '#00000000'
        }
      });

      // Add QR code to top right
      const qrImage = new Image();
      qrImage.onload = () => {
        ctx.drawImage(qrImage, canvas.width - 260, 60, 200, 200);
        
        // Download the background
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${card.name.replace(/\s+/g, '_')}_virtual_background.png`;
        link.click();
        
        toast({
          title: "Virtual background downloaded!",
          description: "Your custom virtual background is ready to use."
        });
        setGenerating(false);
      };
      qrImage.src = qrDataUrl;
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate virtual background.",
        variant: "destructive"
      });
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Email Signature */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Email Signature
          </CardTitle>
          <CardDescription>
            Professional email signature based on your card
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateEmailSignature}
            className="w-full"
            variant="outline"
          >
            Generate Signature
          </Button>
          
          {emailSignature && (
            <div className="space-y-3">
              <div className="border rounded-lg p-4 bg-white">
                <div dangerouslySetInnerHTML={{ __html: emailSignature }} />
              </div>
              
              <div className="space-y-2">
                <Textarea
                  value={emailSignature}
                  readOnly
                  rows={6}
                  className="font-mono text-xs"
                />
                <Button 
                  onClick={copySignature}
                  className="w-full"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML Code
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p><strong>Gmail:</strong> Settings → General → Signature</p>
                <p><strong>Outlook:</strong> File → Options → Mail → Signatures</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            QR Code
          </CardTitle>
          <CardDescription>
            Download QR code for your business card
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={downloadQRCode}
            disabled={generating}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {generating ? "Generating..." : "Download QR Code"}
          </Button>
        </CardContent>
      </Card>

      {/* Virtual Background */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Virtual Background
          </CardTitle>
          <CardDescription>
            Custom Zoom/Teams background with your branding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={generateVirtualBackground}
            disabled={generating}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {generating ? "Generating..." : "Download Background"}
          </Button>
        </CardContent>
      </Card>

      {/* Share Link */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Share Your Card
          </CardTitle>
          <CardDescription>
            Direct link to your public business card
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={`${window.location.origin}/card/${card.slug}`}
            readOnly
            className="font-mono text-sm"
          />
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/card/${card.slug}`);
              toast({ title: "Link copied to clipboard!" });
            }}
            className="w-full"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesGenerator;