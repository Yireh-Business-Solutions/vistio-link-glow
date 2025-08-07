import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Globe, Linkedin, X, Instagram, Facebook, MessageCircle, ExternalLink } from "lucide-react";
import "./wavy-styles.css";

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
      modern: "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-24 before:bg-gradient-to-t before:from-white before:to-transparent before:z-10",
      professional: "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-16 before:bg-white before:rounded-t-[60px] before:z-10",
      creative: "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-20 before:bg-white before:z-10 before:clip-path-wave",
      executive: "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-12 before:bg-gradient-to-r before:from-white/90 before:via-white before:to-white/90 before:z-10",
      minimal: "relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-8 before:bg-white before:z-10"
    };
    return designs[variant as keyof typeof designs] || designs.classic;
  };

  const getLogoPosition = (variant: string) => {
    const positions = {
      classic: "absolute top-4 right-4 z-20",
      modern: "absolute top-6 right-6 z-20",
      professional: "absolute top-4 right-4 z-20",
      creative: "absolute top-6 right-6 z-20",
      executive: "absolute top-4 right-4 z-20",
      minimal: "absolute top-4 right-4 z-20"
    };
    return positions[variant as keyof typeof positions] || positions.classic;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Section with Full-Width Profile Image */}
      <div className={`relative h-96 ${getThemeGradient(formData.color_theme)} ${getWavyDesign(formData.design_variant)} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Company Logo */}
        {formData.company_logo_url && (
          <div className={getLogoPosition(formData.design_variant)}>
            <img
              src={formData.company_logo_url}
              alt={`${formData.company} logo`}
              className="w-16 h-16 bg-white/90 rounded-lg p-2 shadow-lg object-contain backdrop-blur-sm"
            />
          </div>
        )}
        
        {/* Full-Width Profile Image Slider */}
        <div className="absolute inset-0">
          {profileImages.length > 0 ? (
            <div className="relative w-full h-full group">
              <img
                src={profileImages[currentImageIndex]}
                alt={formData.name}
                className="w-full h-full object-cover transition-all duration-500 cursor-pointer hover:scale-105"
                onClick={() => {
                  // Add drag-resize functionality here
                  const imageResizer = document.createElement('div');
                  imageResizer.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
                  imageResizer.innerHTML = `
                    <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                      <h3 class="text-lg font-semibold mb-4">Resize Profile Image</h3>
                      <img src="${profileImages[currentImageIndex]}" class="w-full rounded-lg mb-4" />
                      <div class="flex gap-2">
                        <button class="flex-1 bg-blue-500 text-white py-2 px-4 rounded" onclick="this.closest('.fixed').remove()">Done</button>
                        <button class="flex-1 bg-gray-500 text-white py-2 px-4 rounded" onclick="this.closest('.fixed').remove()">Cancel</button>
                      </div>
                    </div>
                  `;
                  document.body.appendChild(imageResizer);
                }}
              />
              {profileImages.length > 1 && (
                <>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {profileImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                          index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                  
                  {/* Navigation arrows */}
                  <button 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => setCurrentImageIndex((prev) => prev === 0 ? profileImages.length - 1 : prev - 1)}
                  >
                    ‹
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % profileImages.length)}
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Name overlay for modern variants */}
              {(formData.design_variant === 'modern' || formData.design_variant === 'creative') && (
                <div className="absolute bottom-8 left-6 right-6 z-20">
                  <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{formData.name || "Your Name"}</h1>
                  {formData.title && <p className="text-xl text-white/90 drop-shadow-md">{formData.title}</p>}
                  {formData.company && <p className="text-lg text-white/80 drop-shadow-md">{formData.company}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <User className="w-32 h-32 text-white/50" />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-6">
        {/* Basic Info - Only show if not in modern/creative variants with overlay */}
        {!(formData.design_variant === 'modern' || formData.design_variant === 'creative') && (
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
        )}

        {/* Bio for modern variants */}
        {(formData.design_variant === 'modern' || formData.design_variant === 'creative') && formData.bio && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed italic">"{formData.bio}"</p>
          </div>
        )}

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

            {formData.work_phone && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.work_phone}</p>
                    <p className="text-xs text-gray-500">work</p>
                  </div>
                </div>
              </div>
            )}

            {formData.whatsapp && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.whatsapp}</p>
                    <p className="text-xs text-gray-500">WhatsApp</p>
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

            {formData.website && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formData.website}</p>
                    <p className="text-xs text-gray-500">website</p>
                  </div>
                </div>
              </div>
            )}

            {formData.address && (
              <div className="flex items-start justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 leading-relaxed">{formData.address}</p>
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

            {formData.instagram_url && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Instagram Profile</p>
                    <p className="text-xs text-gray-500">social</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Professional Details */}
        {formData.visible_sections?.professional && (
          <div className="mb-6">
            {/* Certifications */}
            {formData.certifications && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.split(',').map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {cert.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {formData.awards && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Awards</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.awards.split(',').map((award, index) => (
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

            {/* Specialties */}
            {formData.specialties && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.split(',').map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                    >
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Links */}
        {formData.visible_sections?.custom_links && customLinks.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Links</h4>
            <div className="space-y-3">
              {customLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="text-xs text-gray-500">custom link</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;