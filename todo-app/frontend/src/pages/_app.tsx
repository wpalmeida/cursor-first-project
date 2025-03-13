import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth.service';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on route changes
    const handleRouteChange = () => {
      const isAuthPage = router.pathname === '/login' || router.pathname === '/register';
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated && !isAuthPage) {
        router.push('/login');
      } else if (isAuthenticated && isAuthPage) {
        router.push('/');
      }
    };

    handleRouteChange(); // Check on initial load
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Todo App</h1>
              </div>
            </div>
            <div className="flex items-center">
              {authService.isAuthenticated() && (
                <button
                  onClick={() => {
                    authService.logout();
                    router.push('/login');
                  }}
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
} 