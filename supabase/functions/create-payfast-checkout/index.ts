import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Simple but working hash function for PayFast signature 
function md5(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYFAST-CHECKOUT] ${step}${detailsStr}`);
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

    // Check all required environment variables first
    const requiredEnvVars = {
      PAYFAST_MERCHANT_ID: Deno.env.get("PAYFAST_MERCHANT_ID"),
      PAYFAST_MERCHANT_KEY: Deno.env.get("PAYFAST_MERCHANT_KEY"),
      PAYFAST_PASSPHRASE: Deno.env.get("PAYFAST_PASSPHRASE"),
      SUPABASE_URL: Deno.env.get("SUPABASE_URL")
    };

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        logStep("ERROR: Missing environment variable", { key });
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
    logStep("All environment variables verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("ERROR: Authentication failed", { error: userError.message });
      throw new Error(`Authentication error: ${userError.message}`);
    }
    const user = userData.user;
    if (!user?.email) {
      logStep("ERROR: No user or email");
      throw new Error("User not authenticated or email not available");
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    let requestBody;
    try {
      requestBody = await req.json();
      logStep("Request body parsed", requestBody);
    } catch (e) {
      logStep("ERROR: Failed to parse request body", { error: e.message });
      throw new Error("Invalid JSON in request body");
    }

    const { planName, billingCycle } = requestBody;
    if (!planName || !billingCycle) {
      logStep("ERROR: Missing required fields", { planName, billingCycle });
      throw new Error("Plan name and billing cycle are required");
    }

    logStep("Request data validated", { planName, billingCycle });

    // Get plan details
    logStep("Fetching plan from database");
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (planError) {
      logStep("ERROR: Database error fetching plan", { error: planError });
      throw new Error(`Database error: ${planError.message}`);
    }
    
    if (!plan) {
      logStep("ERROR: Plan not found", { planName });
      throw new Error("Plan not found");
    }

    const amount = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
    const itemName = billingCycle === "yearly" ? plan.payfast_item_name_yearly : plan.payfast_item_name_monthly;

    logStep("Plan details retrieved", { amount, itemName, planName });

    // Generate unique payment ID
    const paymentId = `${user.id}-${Date.now()}`;

    // PayFast credentials
    const merchantId = requiredEnvVars.PAYFAST_MERCHANT_ID;
    const merchantKey = requiredEnvVars.PAYFAST_MERCHANT_KEY;
    const passphrase = requiredEnvVars.PAYFAST_PASSPHRASE;

    // PayFast payment data - standard payment methods only
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${req.headers.get("origin")}/payment-success`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      notify_url: `${requiredEnvVars.SUPABASE_URL}/functions/v1/payfast-webhook`,
      name_first: user.user_metadata?.name?.split(' ')[0] || 'User',
      name_last: user.user_metadata?.name?.split(' ')[1] || '',
      email_address: user.email,
      m_payment_id: paymentId,
      amount: (amount / 100).toFixed(2), // Convert from cents to rands
      item_name: itemName,
      item_description: `${planName} Plan - ${billingCycle} billing`,
      subscription_type: "1", // Enable subscriptions
      recurring_amount: (amount / 100).toFixed(2),
      frequency: billingCycle === "yearly" ? "6" : "3", // 6 = Annual, 3 = Monthly
      cycles: "0", // Unlimited cycles
      // Disable alternative payment methods that might cause issues
      payment_method: "cc,eft", // Only credit card and EFT
    };

    logStep("Payment data prepared", { 
      paymentId, 
      amount: paymentData.amount,
      itemName: paymentData.item_name 
    });

    // Generate signature for PayFast - following exact PayFast requirements
    const dataString = Object.entries(paymentData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const signatureString = dataString + `&passphrase=${encodeURIComponent(passphrase)}`;
    const signature = md5(signatureString);

    logStep("Generated signature details", { 
      paymentId,
      dataStringLength: dataString.length,
      signature 
    });

    // Store subscription attempt
    logStep("Storing subscription attempt in database");
    const { error: upsertError } = await supabaseClient.from("subscribers").upsert({
      user_id: user.id,
      email: user.email,
      subscription_tier: planName.toLowerCase(),
      subscribed: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (upsertError) {
      logStep("ERROR: Failed to store subscription attempt", { error: upsertError });
      // Don't throw here, just log the error
    } else {
      logStep("Subscription attempt stored successfully");
    }

    // Build PayFast URL
    const payfastUrl = new URL("https://www.payfast.co.za/eng/process"); // Production PayFast URL
    Object.entries(paymentData).forEach(([key, value]) => {
      payfastUrl.searchParams.append(key, value);
    });
    payfastUrl.searchParams.append('signature', signature);

    logStep("PayFast URL generated successfully", { 
      url: payfastUrl.toString().substring(0, 100) + "..." 
    });

    return new Response(JSON.stringify({ 
      url: payfastUrl.toString(),
      paymentId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logStep("FATAL ERROR in create-payfast-checkout", { 
      message: errorMessage, 
      stack: errorStack,
      type: typeof error
    });
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});