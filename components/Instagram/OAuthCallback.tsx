import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './OAuthCallback.module.css';

interface OAuthCallbackProps {
  onSuccess: (profileData: any) => void;
  onError: (error: string) => void;
}

const OAuthCallback: React.FC<OAuthCallbackProps> = ({ onSuccess, onError }) => {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    let isProcessing = false;

    const handleOAuthCallback = async () => {
      // Prevent duplicate requests
      if (isProcessing) return;
      isProcessing = true;

      const { code, state, error } = router.query;

      if (error) {
        setStatus('error');
        setMessage(`OAuth error: ${error}`);
        onError(error as string);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        onError('No authorization code received');
        return;
      }

      try {
        setMessage('Exchanging authorization code for access tokens...');
        
        // Exchange authorization code for access tokens
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/instagram/auth/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
          setMessage('Instagram account connected successfully!');
          onSuccess(data.profile);
          
          // Close popup after 2 seconds
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_SUCCESS', profile: data.profile }, '*');
              window.close();
            }
          }, 2000);
        } else {
          throw new Error(data.error || 'Failed to connect Instagram account');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    if (router.isReady && router.query.code && !isProcessing) {
      handleOAuthCallback();
    }
  }, [router.isReady, router.query.code]); // Only depend on code, not the entire query object

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          {status === 'processing' && '🔄'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </div>
        
        <h2 className={styles.title}>
          {status === 'processing' && 'Processing...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Error'}
        </h2>
        
        <p className={styles.message}>{message}</p>
        
        {status === 'processing' && (
          <div className={styles.spinner}>
            <div className={styles.spinnerInner}></div>
          </div>
        )}
        
        {status === 'error' && (
          <button 
            onClick={() => window.close()} 
            className={styles.closeButton}
          >
            Close Window
          </button>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
