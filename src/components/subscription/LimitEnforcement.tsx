import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { Crown, Lock, Sparkles } from "lucide-react";

interface LimitEnforcementProps {
  children: ReactNode;
  feature: 'cards' | 'profile_images' | 'gallery_images' | 'custom_links' | 'visible_sections' | 'signatures' | 'backgrounds';
  currentCount?: number;
  showUpgrade?: boolean;
}

export default function LimitEnforcement({ 
  children, 
  feature, 
  currentCount = 0, 
  showUpgrade = true 
}: LimitEnforcementProps) {
  const { 
    limits, 
    canCreateCard, 
    canAddProfileImage, 
    canAddGalleryImage, 
    canAddCustomLink,
    canUseVisibleSections,
    canUseSignatures,
    canUseBackgrounds,
    subscription_tier
  } = useSubscription();
  const navigate = useNavigate();

  const getFeatureCheck = () => {
    switch (feature) {
      case 'cards':
        return canCreateCard(currentCount);
      case 'profile_images':
        return canAddProfileImage(currentCount);
      case 'gallery_images':
        return canAddGalleryImage(currentCount);
      case 'custom_links':
        return canAddCustomLink(currentCount);
      case 'visible_sections':
        return canUseVisibleSections;
      case 'signatures':
        return canUseSignatures;
      case 'backgrounds':
        return canUseBackgrounds;
      default:
        return true;
    }
  };

  const getFeatureLimit = () => {
    switch (feature) {
      case 'cards':
        return limits.max_cards;
      case 'profile_images':
        return limits.max_profile_images;
      case 'gallery_images':
        return limits.max_gallery_images;
      case 'custom_links':
        return limits.max_custom_links;
      default:
        return null;
    }
  };

  const getFeatureName = () => {
    switch (feature) {
      case 'cards':
        return 'Business Cards';
      case 'profile_images':
        return 'Profile Images';
      case 'gallery_images':
        return 'Gallery Images';
      case 'custom_links':
        return 'Custom Links';
      case 'visible_sections':
        return 'Visible Sections';
      case 'signatures':
        return 'Email Signatures';
      case 'backgrounds':
        return 'Custom Backgrounds';
      default:
        return 'Feature';
    }
  };

  const getRequiredPlan = () => {
    if (feature === 'cards' && limits.max_cards === 1) return 'Personal';
    if (feature === 'signatures' || feature === 'backgrounds') return 'Personal';
    if (feature === 'visible_sections') return 'Personal';
    return 'Personal';
  };

  const canUseFeature = getFeatureCheck();
  const featureLimit = getFeatureLimit();
  const featureName = getFeatureName();
  const requiredPlan = getRequiredPlan();

  if (canUseFeature) {
    return <>{children}</>;
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          {featureName} Limit Reached
        </CardTitle>
        <CardDescription>
          {featureLimit ? (
            <>
              You've reached your limit of {featureLimit} {featureName.toLowerCase()}. 
              Current: {currentCount}/{featureLimit}
            </>
          ) : (
            <>
              This feature requires the {requiredPlan} plan or higher.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Current Plan: {subscription_tier}
          </Badge>
        </div>
        
        {showUpgrade && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock unlimited {featureName.toLowerCase()} and more features.
            </p>
            <Button 
              onClick={() => navigate('/pricing')}
              className="bg-gradient-primary hover:shadow-neon transition-all duration-300"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}