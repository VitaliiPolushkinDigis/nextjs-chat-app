import React, { useState, useEffect } from 'react';
import { useGetInstagramProfilesQuery } from '../../utils/api';
import styles from './InstagramProfileManager.module.css';

const InstagramProfileManager: React.FC = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: profiles, isLoading, refetch } = useGetInstagramProfilesQuery();

  // Load selected profile ID from localStorage
  useEffect(() => {
    const storedProfileId = localStorage.getItem('selectedInstagramProfileId');
    if (storedProfileId) {
      setSelectedProfileId(Number(storedProfileId));
    }
  }, []);

  const handleProfileSelect = (profileId: number) => {
    setSelectedProfileId(profileId);
    localStorage.setItem('selectedInstagramProfileId', profileId.toString());
  };

  const handleInstagramOAuth = () => {
    setIsConnecting(true);
    
    // Use Instagram-generated OAuth URL with correct scopes
    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1074423231467713&redirect_uri=${encodeURIComponent('https://1a11a0cdf599.ngrok-free.app/instagram/oauth/callback')}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
    
    // Open popup window for Instagram OAuth
    const popup = window.open(
      instagramAuthUrl,
      'instagram_oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for OAuth response
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        setIsConnecting(false);
        // Refresh profiles after OAuth
        refetch();
      }
    }, 1000);
  };

  const handleConnectInstagram = () => {
    setIsConnecting(true);
    
    // Use Instagram-generated OAuth URL with correct scopes
    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1074423231467713&redirect_uri=${encodeURIComponent('https://1a11a0cdf599.ngrok-free.app/instagram/oauth/callback')}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
    
    const popup = window.open(
      instagramAuthUrl,
      'instagram_oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        setIsConnecting(false);
        // Refresh profiles after OAuth
        refetch();
      }
    }, 1000);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading Instagram profiles...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Instagram Profile Manager</h2>
      
      {/* Profile Selection */}
      <div className={styles.profileSelection}>
        <h3>Connected Instagram Profiles</h3>
        {profiles && profiles.length > 0 ? (
          <div className={styles.profileList}>
            {profiles.map((profile: any) => (
              <div 
                key={profile.id} 
                className={`${styles.profileItem} ${selectedProfileId === profile.id ? styles.selected : ''}`}
                onClick={() => handleProfileSelect(profile.id)}
              >
                <div className={styles.profileInfo}>
                  <strong>@{profile.instagramUsername || 'Unknown'}</strong>
                  <span>ID: {profile.instagramUserId}</span>
                  <span>Followers: {profile.followerCount || 'N/A'}</span>
                  <span>Posts: {profile.mediaCount || 'N/A'}</span>
                  <span>Type: {profile.accountType || 'N/A'}</span>
                </div>
                <div className={styles.profileStatus}>
                  {profile.isActive ? '🟢 Active' : '🔴 Inactive'}
                </div>
                <div className={styles.profilePermissions}>
                  {profile.permissions && profile.permissions.length > 0 && (
                    <div className={styles.permissions}>
                      {profile.permissions.map((perm: string, index: number) => (
                        <span key={index} className={styles.permission}>
                          {perm.replace('instagram_business_', '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noProfiles}>No Instagram profiles connected yet.</p>
        )}
      </div>

      {/* OAuth Connection Options */}
      <div className={styles.oauthSection}>
        <h3>Connect Instagram Account</h3>
        <p className={styles.oauthDescription}>
          Connect your Instagram Business account to enable DM automation, comment management, and content insights.
        </p>
        
        <div className={styles.oauthButtons}>
          <button 
            onClick={handleConnectInstagram}
            className={`${styles.oauthButton} ${styles.primary}`}
            disabled={isConnecting}
          >
            {isConnecting ? '🔄 Connecting...' : '🚀 Connect Instagram (Recommended)'}
          </button>
          
          <button 
            onClick={handleInstagramOAuth}
            className={styles.oauthButton}
            disabled={isConnecting}
          >
            {isConnecting ? '🔄 Connecting...' : '📷 Connect via Instagram Only'}
          </button>
        </div>

        <div className={styles.oauthInfo}>
          <h4>What happens when you connect?</h4>
          <ul>
            <li>✅ You'll be redirected to Instagram to login</li>
            <li>✅ You'll see what permissions our app needs</li>
            <li>✅ After approval, we'll automatically get your access tokens</li>
            <li>✅ Your Instagram profile will be connected instantly</li>
            <li>🔒 We never see your password - only the access tokens</li>
            <li>💾 Your profile data is securely stored in our database</li>
          </ul>
        </div>
      </div>

      {/* Instructions */}
      <div className={styles.instructions}>
        <h3>Why use OAuth instead of manual entry?</h3>
        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <h4>🔒 More Secure</h4>
            <p>No need to copy/paste sensitive tokens. OAuth tokens are temporary and can be revoked.</p>
          </div>
          <div className={styles.benefit}>
            <h4>⚡ Faster Setup</h4>
            <p>One click to connect instead of finding and entering multiple IDs and tokens.</p>
          </div>
          <div className={styles.benefit}>
            <h4>🔄 Auto-Refresh</h4>
            <p>Tokens automatically refresh when they expire, keeping your connection active.</p>
          </div>
          <div className={styles.benefit}>
            <h4>📱 Mobile Friendly</h4>
            <p>Works seamlessly on mobile devices where copying tokens is difficult.</p>
          </div>
          <div className={styles.benefit}>
            <h4>💾 Persistent Storage</h4>
            <p>Your profile data is saved and you don't need to reconnect every time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramProfileManager;
