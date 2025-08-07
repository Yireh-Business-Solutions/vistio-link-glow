import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SubscriptionLimits {
  max_cards: number;
  max_profile_images: number;
  max_gallery_images: number;
  max_custom_links: number;
  design_variants_count: number;
  visible_sections_enabled: boolean;
  signatures_enabled: boolean;
  backgrounds_enabled: boolean;
  subscription_tier: string;
}

interface SubscriptionContextType {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  limits: SubscriptionLimits;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  canCreateCard: (currentCardCount: number) => boolean;
  canAddProfileImage: (currentImageCount: number) => boolean;
  canAddGalleryImage: (currentImageCount: number) => boolean;
  canAddCustomLink: (currentLinkCount: number) => boolean;
  canUseDesignVariant: (variantIndex: number) => boolean;
  canUseVisibleSections: boolean;
  canUseSignatures: boolean;
  canUseBackgrounds: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const defaultLimits: SubscriptionLimits = {
  max_cards: 1,
  max_profile_images: 1,
  max_gallery_images: 1,
  max_custom_links: 1,
  design_variants_count: 1,
  visible_sections_enabled: false,
  signatures_enabled: false,
  backgrounds_enabled: false,
  subscription_tier: "free"
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [subscription_tier, setSubscriptionTier] = useState("free");
  const [subscription_end, setSubscriptionEnd] = useState<string | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits>(defaultLimits);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const refreshSubscription = async () => {
    if (!user || !session) {
      setSubscribed(false);
      setSubscriptionTier("free");
      setSubscriptionEnd(null);
      setLimits(defaultLimits);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check if user is founder first
      const founderEmails = ['andre@vistio.co.za', 'dylan@vistio.co.za'];
      const isFounder = founderEmails.includes(user.email || '');
      
      if (isFounder) {
        setSubscribed(true);
        setSubscriptionTier("founder");
        setSubscriptionEnd(null);
        setLimits({
          max_cards: 999999,
          max_profile_images: 999999,
          max_gallery_images: 999999,
          max_custom_links: 999999,
          design_variants_count: 999999,
          visible_sections_enabled: true,
          signatures_enabled: true,
          backgrounds_enabled: true,
          subscription_tier: "founder"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Subscription check error:', error);
        return;
      }

      if (data) {
        setSubscribed(data.subscribed || false);
        setSubscriptionTier(data.subscription_tier || "free");
        setSubscriptionEnd(data.subscription_end);
        setLimits(data.limits || defaultLimits);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [user, session]);

  const canCreateCard = (currentCardCount: number) => {
    return currentCardCount < limits.max_cards;
  };

  const canAddProfileImage = (currentImageCount: number) => {
    return currentImageCount < limits.max_profile_images;
  };

  const canAddGalleryImage = (currentImageCount: number) => {
    return currentImageCount < limits.max_gallery_images;
  };

  const canAddCustomLink = (currentLinkCount: number) => {
    return currentLinkCount < limits.max_custom_links;
  };

  const canUseDesignVariant = (variantIndex: number) => {
    return variantIndex < limits.design_variants_count;
  };

  const canUseVisibleSections = limits.visible_sections_enabled;
  const canUseSignatures = limits.signatures_enabled;
  const canUseBackgrounds = limits.backgrounds_enabled;

  const value = {
    subscribed,
    subscription_tier,
    subscription_end,
    limits,
    loading,
    refreshSubscription,
    canCreateCard,
    canAddProfileImage,
    canAddGalleryImage,
    canAddCustomLink,
    canUseDesignVariant,
    canUseVisibleSections,
    canUseSignatures,
    canUseBackgrounds
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};