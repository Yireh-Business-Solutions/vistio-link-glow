import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Briefcase, 
  Heart, 
  Code, 
  Palette,
  Star,
  Sparkles
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
  data: any;
}

const templates: Template[] = [
  {
    id: "professional",
    name: "Professional Executive",
    description: "Clean, corporate design perfect for business professionals",
    icon: <Briefcase className="h-6 w-6" />,
    badge: "Popular",
    color: "neon-blue",
    data: {
      name: "Alex Johnson",
      title: "Senior Vice President",
      company: "Fortune 500 Corp",
      email: "alex.johnson@company.com",
      phone: "+1 (555) 123-4567",
      work_phone: "+1 (555) 987-6543",
      address: "123 Business Plaza, Suite 500\nNew York, NY 10001",
      website: "alexjohnson.pro",
      linkedin_url: "linkedin.com/in/alexjohnson",
      bio: "Experienced executive with 15+ years in strategic leadership and business development.",
      color_theme: "neon-blue",
      visible_sections: {
        contact: true,
        social: true,
        professional: true,
        images: false,
        custom_links: true
      }
    }
  },
  {
    id: "creative",
    name: "Creative Designer",
    description: "Vibrant and artistic design for creative professionals",
    icon: <Palette className="h-6 w-6" />,
    badge: "Trending",
    color: "neon-purple",
    data: {
      name: "Maya Chen",
      title: "Creative Director",
      company: "Design Studio Pro",
      email: "maya@designstudio.com",
      phone: "+1 (555) 234-5678",
      address: "456 Art District, Studio 12\nLos Angeles, CA 90028",
      website: "mayachen.design",
      linkedin_url: "linkedin.com/in/mayachen",
      instagram_url: "instagram.com/mayachendesign",
      bio: "Award-winning designer passionate about creating meaningful visual experiences.",
      color_theme: "neon-purple",
      visible_sections: {
        contact: true,
        social: true,
        professional: true,
        images: true,
        custom_links: true
      }
    }
  },
  {
    id: "medical",
    name: "Healthcare Professional",
    description: "Trust-building design for healthcare and medical professionals",
    icon: <Heart className="h-6 w-6" />,
    badge: "Professional",
    color: "neon-green",
    data: {
      name: "Dr. Sarah Williams",
      title: "Internal Medicine Physician",
      company: "Metro General Hospital",
      email: "dr.williams@metrogeneral.com",
      phone: "+1 (555) 345-6789",
      work_phone: "+1 (555) 876-5432",
      address: "789 Medical Center Dr\nChicago, IL 60611",
      website: "drwilliamsmd.com",
      linkedin_url: "linkedin.com/in/sarahwilliamsmd",
      bio: "Board-certified internist dedicated to providing comprehensive patient care.",
      certifications: "Board Certified Internal Medicine, ABIM",
      specialties: "Preventive Care, Chronic Disease Management",
      color_theme: "neon-green",
      visible_sections: {
        contact: true,
        social: true,
        professional: true,
        images: false,
        custom_links: true
      }
    }
  },
  {
    id: "tech",
    name: "Tech Innovator",
    description: "Modern, sleek design for technology professionals",
    icon: <Code className="h-6 w-6" />,
    badge: "Hot",
    color: "neon-blue",
    data: {
      name: "David Kim",
      title: "Senior Software Engineer",
      company: "TechCorp Solutions",
      email: "david.kim@techcorp.com",
      phone: "+1 (555) 456-7890",
      address: "321 Innovation Blvd\nSan Francisco, CA 94105",
      website: "davidkim.dev",
      linkedin_url: "linkedin.com/in/davidkimdev",
      twitter_url: "twitter.com/davidcodes",
      bio: "Full-stack developer specializing in scalable web applications and cloud architecture.",
      specialties: "React, Node.js, AWS, Python",
      color_theme: "neon-blue",
      visible_sections: {
        contact: true,
        social: true,
        professional: true,
        images: false,
        custom_links: true
      }
    }
  },
  {
    id: "luxury",
    name: "Luxury Brand",
    description: "Premium, elegant design for high-end services and luxury brands",
    icon: <Star className="h-6 w-6" />,
    badge: "Premium",
    color: "neon-pink",
    data: {
      name: "Isabella Rodriguez",
      title: "Luxury Real Estate Advisor",
      company: "Prestige Properties International",
      email: "isabella@prestigeproperties.com",
      phone: "+1 (555) 567-8901",
      address: "567 Luxury Lane, Penthouse\nMiami, FL 33131",
      website: "isabellaluxury.com",
      linkedin_url: "linkedin.com/in/isabellarodriguez",
      instagram_url: "instagram.com/isabellaluxury",
      bio: "Exclusive real estate specialist for luxury properties and high-net-worth clients.",
      awards: "Top 1% Realtor, Luxury Home Specialist",
      color_theme: "neon-pink",
      visible_sections: {
        contact: true,
        social: true,
        professional: true,
        images: true,
        custom_links: true
      }
    }
  }
];

interface CardTemplatesProps {
  onSelectTemplate: (templateData: any) => void;
}

const CardTemplates = ({ onSelectTemplate }: CardTemplatesProps) => {
  const getThemeColor = (theme: string) => {
    const themes = {
      'neon-blue': 'hsl(195 100% 50%)',
      'neon-green': 'hsl(120 100% 50%)',
      'neon-purple': 'hsl(280 100% 70%)',
      'neon-pink': 'hsl(320 100% 70%)'
    };
    return themes[theme as keyof typeof themes] || themes['neon-blue'];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Choose a Template
        </h3>
        <p className="text-muted-foreground">
          Start with a professionally designed template and customize it to your needs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className="bg-card/50 backdrop-blur-sm border-border hover:border-neon-blue transition-all duration-300 hover:shadow-neon cursor-pointer group"
            onClick={() => onSelectTemplate(template.data)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: getThemeColor(template.color) }}
                >
                  {template.icon}
                </div>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: getThemeColor(template.color) }}
                >
                  {template.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mini Preview */}
                <div 
                  className="h-20 rounded-lg border-2 flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                  style={{ 
                    borderColor: getThemeColor(template.color),
                    boxShadow: `0 0 10px ${getThemeColor(template.color)}30`
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="font-semibold text-sm"
                      style={{ color: getThemeColor(template.color) }}
                    >
                      {template.data.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {template.data.title}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full group-hover:shadow-neon transition-all duration-300"
                  style={{ 
                    backgroundColor: getThemeColor(template.color),
                    borderColor: getThemeColor(template.color)
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button 
          variant="outline" 
          onClick={() => onSelectTemplate({})}
          className="hover:border-neon-blue transition-all duration-300"
        >
          <User className="h-4 w-4 mr-2" />
          Start from Scratch
        </Button>
      </div>
    </div>
  );
};

export default CardTemplates;