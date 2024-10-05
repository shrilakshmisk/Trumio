// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard when the component mounts
    router.replace('/client/dashboard');
  }, [router]);

  // This component won't be rendered as the user is redirected
  return null;
};

export default Index;
