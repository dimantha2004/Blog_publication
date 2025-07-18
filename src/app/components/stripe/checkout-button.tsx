'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { StripeProduct } from '@/src/stripe-config';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  product: StripeProduct;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ product, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // For demo: always redirect to Stripe test page
      window.location.href = 'https://buy.stripe.com/test_9B614p8anbte7Hg4cc2Ry00';
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children || (product.mode === 'subscription' ? 'Subscribe' : 'Purchase')}
    </Button>
  );
}