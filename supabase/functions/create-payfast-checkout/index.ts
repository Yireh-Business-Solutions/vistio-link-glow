import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHash } from "https://deno.land/std@0.190.0/crypto/mod.ts";

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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { planName, billingCycle } = await req.json();
    if (!planName || !billingCycle) {
      throw new Error("Plan name and billing cycle are required");
    }

    logStep("Request data", { planName, billingCycle });

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (planError || !plan) throw new Error("Plan not found");

    const amount = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
    const itemName = billingCycle === "yearly" ? plan.payfast_item_name_yearly : plan.payfast_item_name_monthly;

    logStep("Plan details", { amount, itemName });

    // PayFast credentials
    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE");

    if (!merchantId || !merchantKey || !passphrase) {
      throw new Error("PayFast credentials not configured");
    }

    // Generate unique payment ID
    const paymentId = `${user.id}-${Date.now()}`;

    // PayFast payment data
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${req.headers.get("origin")}/payment-success`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payfast-webhook`,
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
    };

    // Generate signature
    const dataString = Object.entries(paymentData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const signatureString = dataString + `&passphrase=${encodeURIComponent(passphrase)}`;
    const signature = Array.from(new Uint8Array(await createHash("md5").update(signatureString).digest()))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    logStep("Generated signature", { paymentId });

    // Store subscription attempt
    await supabaseClient.from("subscribers").upsert({
      user_id: user.id,
      email: user.email,
      subscription_tier: planName.toLowerCase(),
      subscribed: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    // Build PayFast URL
    const payfastUrl = new URL("https://sandbox.payfast.co.za/eng/process"); // Use sandbox for testing
    Object.entries(paymentData).forEach(([key, value]) => {
      payfastUrl.searchParams.append(key, value);
    });
    payfastUrl.searchParams.append('signature', signature);

    logStep("PayFast URL generated", { url: payfastUrl.toString() });

    return new Response(JSON.stringify({ 
      url: payfastUrl.toString(),
      paymentId 
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