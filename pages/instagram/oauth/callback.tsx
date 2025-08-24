import React from 'react';
import OAuthCallback from '../../../components/Instagram/OAuthCallback';

const OAuthCallbackPage: React.FC = () => {
  const handleSuccess = (profileData: any) => {
    console.log('Instagram profile connected:', profileData);
    // The popup will automatically close and send message to parent window
  };

  const handleError = (error: string) => {
    console.error('OAuth error:', error);
    // The popup will show error and allow user to close
  };

  return (
    <OAuthCallback 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

export default OAuthCallbackPage;
