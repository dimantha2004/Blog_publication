'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check } from 'lucide-react';
import { StripeProduct } from '@/src/stripe-config';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { CheckoutButton } from './checkout-button';

interface ProductCardProps {
  product: StripeProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          {product.mode === 'subscription' && (
            <Badge variant="secondary">Subscription</Badge>
          )}
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{product.price}</div>
        {product.mode === 'subscription' && (
          <p className="text-sm text-muted-foreground mt-1">Billed monthly</p>
        )}
      </CardContent>
      <CardFooter>
        <CheckoutButton product={product} />
      </CardFooter>
    </Card>
  );
}