import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Optional: Prevent FOUC (Flash of Unstyled Content)
  useEffect(() => {
    document.body.classList.add('loaded');
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;