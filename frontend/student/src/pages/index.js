// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login when the component mounts
    router.replace('/student/login');
  }, [router]);

  // This component won't be rendered as the user is redirected
  return null;
};

export default Index;
