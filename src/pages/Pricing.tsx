import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out our service",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 business card",
      "1 profile image",
      "1 gallery image", 
      "1 custom link",
      "1 design variant",
      "No visible sections control",
      "No signatures or backgrounds"
    ],
    popular: false,
    disabled: true
  },
  {
    name: "Personal",
    description: "Great for individuals and freelancers",
    monthlyPrice: 49,
    yearlyPrice: 550,
    features: [
      "2 business cards",
      "2 profile images",
      "2 gallery images",
      "5 custom links",
      "2 design variants",
      "Visible sections control",
      "No signatures or backgrounds"
    ],
    popular: false,
    disabled: false
  },
  {
    name: "Pro",
    description: "Perfect for professionals and small teams",
    monthlyPrice: 399,
    yearlyPrice: 4400,
    features: [
      "5 business cards",
      "5 profile images", 
      "5 gallery images",
      "10 custom links",
      "All design variants",
      "Visible sections control",
      "Email signatures & backgrounds"
    ],
    popular: true,
    disabled: false
  },
  {
    name: "Business",
    description: "Ideal for growing businesses",
    monthlyPrice: 999,
    yearlyPrice: 11000,
    features: [
      "15 business cards",
      "5 profile images",
      "5 gallery images", 
      "20 custom links",
      "All design variants",
      "Visible sections control",
      "Email signatures & backgrounds"
    ],
    popular: false,
    disabled: false
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription_tier, refreshSubscription } = useSubscription();

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    if (planName === "Free") return;

    setLoading(planName);

    try {
      const { data, error } = await supabase.functions.invoke('create-payfast-checkout', {
        body: {
          planName,
          billingCycle: isYearly ? 'yearly' : 'monthly'
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open PayFast checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleContactEnterprise = () => {
    window.location.href = "mailto:sales@cardcrafter.co.za?subject=Enterprise Plan Inquiry";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create stunning digital business cards with our flexible pricing plans. 
            Start free and upgrade as your needs grow.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={!isYearly ? "font-semibold text-primary" : "text-muted-foreground"}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={isYearly ? "font-semibold text-primary" : "text-muted-foreground"}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = subscription_tier.toLowerCase() === plan.name.toLowerCase();
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const yearlyDiscount = plan.monthlyPrice > 0 ? Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100) : 0;

            return (
              <Card key={plan.name} className={`
                relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''}
                ${isCurrentPlan ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' : ''}
                border-border/50 backdrop-blur-sm
              `}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                  <CardDescription className="text-center text-sm">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center pt-4">
                    <div className="text-4xl font-bold text-primary">
                      R{price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.name === "Free" ? "Forever" : `/${isYearly ? "year" : "month"}`}
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Save {yearlyDiscount}% vs monthly
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={plan.disabled || isCurrentPlan || loading === plan.name}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {loading === plan.name ? (
                      "Processing..."
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.name === "Free" ? (
                      "Get Started"
                    ) : (
                      `Choose ${plan.name}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Card */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Enterprise
            </CardTitle>
            <CardDescription className="text-lg">
              Custom solutions for large organizations
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">Unlimited Cards</h4>
                <p className="text-sm text-muted-foreground">Create as many business cards as needed for your organization</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Custom Branding</h4>
                <p className="text-sm text-muted-foreground">White-label solution with your company branding</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dedicated Support</h4>
                <p className="text-sm text-muted-foreground">Priority support with dedicated account manager</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <Button 
              size="lg" 
              onClick={handleContactEnterprise}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Contact Sales
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            All plans include secure hosting, SSL certificates, and regular backups. 
            Cancel anytime with no hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}