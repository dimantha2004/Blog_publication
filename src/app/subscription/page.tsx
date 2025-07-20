'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { stripeProducts } from '@/src/stripe-config';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Zap, Shield, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Always refresh user on mount to get latest subscription status
    refreshUser && refreshUser();
  }, [refreshUser]);

  const isPremium = (user as any)?.is_premium;
  const hasActiveSubscription = user?.subscription?.status === 'active';
  const blogProduct = stripeProducts.find(p => p.id === 'prod_Sgm9j9rJ9z2pS1');

  const handleSubscribe = () => {
    window.location.href = 'https://buy.stripe.com/test_3cIdRb4YbeFq2mW8ss2Ry02';
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600">
              Unlock premium features and exclusive content
            </p>
          </div>

          {/* Current Status */}
          {user && (
            <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Current Plan</h3>
                      <p className="text-blue-700">
                        {hasActiveSubscription || isPremium ? user.subscription?.product_name || 'Premium Member' : 'Free Member'}
                      </p>
                      {user.subscription?.current_period_end && (
                        <p className="text-sm text-blue-600">
                          {user.subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
                          {new Date(user.subscription.current_period_end * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {hasActiveSubscription && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <Card className={`relative ${!isPremium ? 'border-2 border-blue-500' : ''}`}>
              {!isPremium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Current Plan</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Access to free posts</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Create unlimited free posts</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Basic profile features</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  {isPremium ? 'Not Active' : 'Current Plan'}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className={`relative ${isPremium ? 'border-2 border-yellow-500' : 'border-2 border-blue-500'}`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                  {isPremium ? 'Current Plan' : 'Most Popular'}
                </Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <span>Premium</span>
                </CardTitle>
                <CardDescription>Unlock all features and content</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {blogProduct ? formatPrice(blogProduct.price, blogProduct.currency) : '$1.00'}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900"
                    onClick={handleSubscribe}
                    disabled={loading || !user}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        <span>Upgrade to Premium</span>
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feature Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Feature Comparison</CardTitle>
              <CardDescription className="text-center">
                See what's included in each plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span>Free Posts Access</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span>Premium Posts Access</span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-400">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span>Create Premium Content</span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-400">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span>Community Support</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span>Priority Support</span>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-400">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {!user && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <h3 className="font-medium text-blue-900 mb-2">Ready to get started?</h3>
              <p className="text-blue-700 mb-4">Sign up for a free account to begin your blogging journey.</p>
              <Button asChild>
                <a href="/register">Create Free Account</a>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}