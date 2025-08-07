-- Update subscription plans table to use PayFast instead of Stripe
ALTER TABLE public.subscription_plans 
DROP COLUMN IF EXISTS stripe_price_id_monthly,
DROP COLUMN IF EXISTS stripe_price_id_yearly,
ADD COLUMN payfast_item_name_monthly TEXT,
ADD COLUMN payfast_item_name_yearly TEXT;

-- Update subscribers table for PayFast
ALTER TABLE public.subscribers 
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id,
ADD COLUMN payfast_token TEXT,
ADD COLUMN payfast_subscription_id TEXT;

-- Update subscription plans with PayFast item names
UPDATE public.subscription_plans SET
  payfast_item_name_monthly = CASE 
    WHEN name = 'Personal' THEN 'CardCrafter Personal Monthly'
    WHEN name = 'Pro' THEN 'CardCrafter Pro Monthly'
    WHEN name = 'Business' THEN 'CardCrafter Business Monthly'
    ELSE NULL
  END,
  payfast_item_name_yearly = CASE 
    WHEN name = 'Personal' THEN 'CardCrafter Personal Yearly'
    WHEN name = 'Pro' THEN 'CardCrafter Pro Yearly'
    WHEN name = 'Business' THEN 'CardCrafter Business Yearly'
    ELSE NULL
  END;