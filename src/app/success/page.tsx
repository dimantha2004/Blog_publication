'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    // Refresh user data to get updated subscription status
    const refreshData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error refreshing user data:', error);
        setError('Failed to refresh subscription status');
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to allow webhook processing
    const timer = setTimeout(refreshData, 2000);
    return () => clearTimeout(timer);
  }, [user, sessionId, router, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing your subscription...</h1>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link href="/subscription">
              <Button>Back to Subscription</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const hasActiveSubscription = user?.subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-gray-900">
                {hasActiveSubscription ? 'Welcome to Premium!' : 'Payment Successful!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasActiveSubscription ? (
                <>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg font-semibold text-gray-900">Premium Member</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Congratulations! Your premium subscription is now active. You now have access to all premium content and features.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">What's included in your premium subscription:</h3>
                    <ul className="text-sm text-yellow-700 space-y-1 text-left">
                      <li>• Access to all premium posts and content</li>
                      <li>• Ability to create premium content</li>
                      <li>• Priority customer support</li>
                      <li>• Advanced analytics and insights</li>
                      <li>• Premium member badge</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                      <Button className="flex items-center space-x-2">
                        <span>Go to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline">Explore Premium Content</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Your payment has been processed successfully. Your subscription should be activated shortly.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-700">
                      If you don't see your premium features activated within a few minutes, please refresh the page or contact support.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => window.location.reload()}>
                      Refresh Page
                    </Button>
                    <Link href="/subscription">
                      <Button variant="outline">View Subscription</Button>
                    </Link>
                  </div>
                </>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Session ID: <code className="bg-gray-100 px-1 rounded text-xs">{sessionId}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}