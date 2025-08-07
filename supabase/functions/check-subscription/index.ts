import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user subscription
    const { data: subscriber, error: subError } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subError && subError.code !== "PGRST116") { // PGRST116 = not found
      logStep("Subscription query error", subError);
      throw subError;
    }

    let subscribed = false;
    let subscriptionTier = "free";
    let subscriptionEnd = null;

    if (subscriber) {
      // Check if subscription is still valid
      const now = new Date();
      const endDate = subscriber.subscription_end ? new Date(subscriber.subscription_end) : null;
      
      subscribed = subscriber.subscribed && (!endDate || endDate > now);
      subscriptionTier = subscribed ? subscriber.subscription_tier : "free";
      subscriptionEnd = subscriber.subscription_end;

      logStep("Subscription found", { 
        subscribed, 
        subscriptionTier, 
        subscriptionEnd,
        originalSubscribed: subscriber.subscribed,
        endDate: endDate?.toISOString()
      });

      // Update subscription status if expired
      if (subscriber.subscribed && endDate && endDate <= now) {
        await supabaseClient
          .from("subscribers")
          .update({ 
            subscribed: false,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
        
        logStep("Subscription expired, updated status");
      }
    } else {
      // Create default free subscription
      await supabaseClient.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        subscribed: false,
        subscription_tier: "free",
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      logStep("Created default free subscription");
    }

    // Get subscription limits
    const { data: limits, error: limitsError } = await supabaseClient
      .rpc("get_user_limits", { _user_id: user.id })
      .single();

    if (limitsError) {
      logStep("Limits query error", limitsError);
      throw limitsError;
    }

    logStep("Subscription limits retrieved", limits);

    return new Response(JSON.stringify({
      subscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      limits
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});