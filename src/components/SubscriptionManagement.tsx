import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Crown, CreditCard, Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionManagement() {
  const { subscription_tier, subscription_end, subscribed, limits, refreshSubscription, loading } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      await refreshSubscription();
      toast({
        title: "Subscription Updated",
        description: "Your subscription status has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Subscription Management
        </CardTitle>
        <CardDescription>
          Manage your subscription and view plan details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg capitalize">{subscription_tier} Plan</h3>
              <Badge variant={subscribed ? "default" : "secondary"}>
                {subscribed ? "Active" : "Free"}
              </Badge>
            </div>
            {subscription_end && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                {subscribed ? 'Renews' : 'Expired'} on {formatDate(subscription_end)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshSubscription}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {subscription_tier === 'free' && (
              <Button onClick={handleUpgrade}>
                <CreditCard className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </div>

        {/* Plan Limits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{limits.max_cards}</div>
            <div className="text-sm text-muted-foreground">Cards</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{limits.max_profile_images}</div>
            <div className="text-sm text-muted-foreground">Profile Images</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{limits.max_gallery_images}</div>
            <div className="text-sm text-muted-foreground">Gallery Images</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{limits.max_custom_links}</div>
            <div className="text-sm text-muted-foreground">Custom Links</div>
          </div>
        </div>

        {/* Features Available */}
        <div className="space-y-3">
          <h4 className="font-semibold">Available Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border ${limits.visible_sections_enabled ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/30'}`}>
              <div className="text-sm font-medium">Visible Sections</div>
              <div className="text-xs text-muted-foreground">
                {limits.visible_sections_enabled ? 'Enabled' : 'Upgrade Required'}
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${limits.signatures_enabled ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/30'}`}>
              <div className="text-sm font-medium">Email Signatures</div>
              <div className="text-xs text-muted-foreground">
                {limits.signatures_enabled ? 'Enabled' : 'Pro Plan Required'}
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${limits.backgrounds_enabled ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/30'}`}>
              <div className="text-sm font-medium">Custom Backgrounds</div>
              <div className="text-xs text-muted-foreground">
                {limits.backgrounds_enabled ? 'Enabled' : 'Pro Plan Required'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleUpgrade} className="flex-1">
            {subscription_tier === 'free' ? 'Upgrade Plan' : 'Change Plan'}
          </Button>
          {subscribed && (
            <Button variant="outline" onClick={() => window.open('https://sandbox.payfast.co.za/user/login', '_blank')}>
              Manage Billing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}