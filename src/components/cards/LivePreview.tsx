import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Globe, Linkedin, X, Instagram, Facebook, MessageCircle, ExternalLink } from "lucide-react";

interface LivePreviewProps {
  formData: any;
  customLinks: any[];
}

const LivePreview = ({ formData, customLinks }: LivePreviewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all profile images
  const profileImages = [
    formData.profile_image_url,
    formData.profile_image_2_url,
    formData.profile_image_3_url,
    formData.profile_image_4_url,
    formData.profile_image_5_url,
  ].filter(Boolean);

  // Auto-advance slider for multiple images
  useEffect(() => {
    if (profileImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % profileImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [profileImages.length]);

  const getThemeGradient = (theme: string | null) => {
    const gradients = {
      'neon-blue': 'bg-gradient-to-br from-blue-500 to-blue-700',
      'neon-green': 'bg-gradient-to-br from-green-500 to-green-700',
      'neon-purple': 'bg-gradient-to-br from-purple-500 to-purple-700',
      'neon-pink': 'bg-gradient-to-br from-pink-500 to-pink-700'
    };
    return gradients[(theme || 'neon-blue') as keyof typeof gradients] || gradients['neon-blue'];
  };

  const getWavyDesign = (variant: string) => {
    const designs = {
      classic: "",
      wavy1: "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-16 before:bg-white before:rounded-t-[50px]",
      wavy2: "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-20 before:bg-white before:rounded-t-[100px]",
      wavy3: "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-12 before:bg-white before:content-[''] before:clip-path-wave",
      angular: "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-16 before:bg-white before:clip-path-triangle"
    };
    return designs[variant as keyof typeof designs] || designs.classic;
  };

  const getLogoPosition = (variant: string) => {
    const positions = {
      classic: "absolute top-4 right-4",
      wavy1: "absolute top-4 right-4",
      wavy2: "absolute top-4 right-4",
      wavy3: "absolute top-6 right-4",
      angular: "absolute top-6 right-4"
    };
    return positions[variant as keyof typeof positions] || positions.classic;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Section with Profile Image */}
      <div className={`relative h-80 ${getThemeGradient(formData.color_theme)} ${getWavyDesign(formData.design_variant)}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Company Logo */}
        {formData.company_logo_url && (
          <div className={getLogoPosition(formData.design_variant)}>
            <img
              src={formData.company_logo_url}
              alt={`${formData.company} logo`}
              className="w-16 h-16 bg-white rounded-lg p-2 shadow-lg object-contain"
            />
          </div>
        )}
        
        {/* Profile Image Slider */}
        <div className="absolute inset-0 flex items-center justify-center">
          {profileImages.length > 0 ? (
            <div className="relative">
              <img
                src={profileImages[currentImageIndex]}
                alt={formData.name}
                className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-4 border-white/20 transition-all duration-500"
              />
              {profileImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {profileImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || "Your Name"}</h1>
          {formData.title && <p className="text-lg text-gray-600 mb-2">{formData.title}</p>}
          {formData.company && <p className="text-md text-gray-500 font-medium mb-3">{formData.company}</p>}
          {formData.bio && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-700 leading-relaxed italic">"{formData.bio}"</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {formData.visible_sections?.contact && (
          <div className="space-y-4 mb-6">
            {formData.phone && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.phone}</p>
                    <p className="text-xs text-gray-500">mobile</p>
                  </div>
                </div>
              </div>
            )}
            
            {formData.email && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.email}</p>
                    <p className="text-xs text-gray-500">work</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        {formData.visible_sections?.social && (
          <div className="space-y-3 mb-6">
            {formData.linkedin_url && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">LinkedIn Profile</p>
                    <p className="text-xs text-gray-500">professional</p>
                  </div>
                </div>
              </div>
            )}
            
            {formData.twitter_url && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">X Profile</p>
                    <p className="text-xs text-gray-500">social</p>
                  </div>
                </div>
              </div>
            )}

            {formData.facebook_url && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Facebook Page</p>
                    <p className="text-xs text-gray-500">social</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;