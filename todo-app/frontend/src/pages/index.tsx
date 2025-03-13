import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth.service';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      if (authService.isAuthenticated()) {
        await router.push('/todos');
      } else {
        await router.push('/login');
      }
    };

    redirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
} 