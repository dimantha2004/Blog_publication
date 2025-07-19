'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/use-profile';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const { user } = useAuth();
  const { refetch } = useProfile();

  useEffect(() => {
    async function setPremiumAndRefetch() {
      if (user) {
        await supabase
          .from('user_profiles')
          .update({ is_premium: true })
          .eq('id', user.id);
        // Refetch profile so UI updates everywhere
        await refetch();
      }
      // Redirect after refetch
      window.location.href = '/dashboard';
    }
    setPremiumAndRefetch();
  }, [user, refetch]);

  // No need to render anything, user will be redirected
  return null;
}