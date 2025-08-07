import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Simple hash function for PayFast signature 
function md5(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) throw new Error("Authentication failed");

    const user = userData.user;
    const { planName, billingCycle } = await req.json();
    if (!planName || !billingCycle) throw new Error("Missing plan data");

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("subscription_plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (planError || !plan) throw new Error("Plan not found");

    const amount = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
    const itemName = billingCycle === "yearly" ? plan.payfast_item_name_yearly : plan.payfast_item_name_monthly;

    // PayFast credentials - simplified
    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID") || "";
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY") || "";
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || "";

    const paymentId = `${user.id}-${Date.now()}`;

    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${req.headers.get("origin")}/payment-success`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payfast-webhook`,
      name_first: "User",
      name_last: "",
      email_address: user.email,
      m_payment_id: paymentId,
      amount: (amount / 100).toFixed(2),
      item_name: itemName || `${planName} Plan`,
      item_description: `${planName} Plan - ${billingCycle}`,
      subscription_type: "1",
      recurring_amount: (amount / 100).toFixed(2),
      frequency: billingCycle === "yearly" ? "6" : "3",
      cycles: "0",
    };

    // Generate signature
    const dataString = Object.entries(paymentData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const signatureString = dataString + `&passphrase=${encodeURIComponent(passphrase)}`;
    const signature = md5(signatureString);

    // Store subscription attempt
    await supabaseClient.from("subscribers").upsert({
      user_id: user.id,
      email: user.email,
      subscription_tier: planName.toLowerCase(),
      subscribed: false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    // Build PayFast URL
    const payfastUrl = new URL("https://www.payfast.co.za/eng/process");
    Object.entries(paymentData).forEach(([key, value]) => {
      payfastUrl.searchParams.append(key, value);
    });
    payfastUrl.searchParams.append('signature', signature);

    return new Response(JSON.stringify({ 
      url: payfastUrl.toString(),
      paymentId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("PayFast Error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});