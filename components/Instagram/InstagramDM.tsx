import React, { useState, useEffect } from 'react';
import { useSendDMMutation, useGetInstagramProfilesQuery } from '../../utils/api';
import styles from './InstagramDM.module.css';

const InstagramDM: React.FC = () => {
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const { data: profiles, isLoading: profilesLoading } = useGetInstagramProfilesQuery();
  const [sendDM, { isLoading: isSending, isSuccess, isError, error }] = useSendDMMutation();

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

  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfileId) {
      alert('Please select an Instagram profile first');
      return;
    }

    if (!recipientId.trim() || !message.trim()) {
      alert('Please fill in both recipient ID and message');
      return;
    }

    try {
      await sendDM({
        profileId: selectedProfileId,
        recipientId: recipientId.trim(),
        message: message.trim(),
      }).unwrap();

      // Clear form on success
      setRecipientId('');
      setMessage('');
    } catch (error) {
      console.error('Failed to send DM:', error);
    }
  };

  if (profilesLoading) {
    return <div className={styles.loading}>Loading Instagram profiles...</div>;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className={styles.noProfiles}>
        <h3>No Instagram Profiles Connected</h3>
        <p>You need to connect an Instagram account first to send DMs.</p>
        <a href="/instagram" className={styles.connectLink}>
          Connect Instagram Account
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Send Instagram Direct Message</h2>
      
      {/* Profile Selection */}
      <div className={styles.profileSelection}>
        <h3>Select Instagram Profile</h3>
        <div className={styles.profileList}>
          {profiles.map((profile: any) => (
            <div 
              key={profile.id} 
              className={`${styles.profileItem} ${selectedProfileId === profile.id ? styles.selected : ''}`}
              onClick={() => handleProfileSelect(profile.id)}
            >
              <div className={styles.profileInfo}>
                <strong>@{profile.instagramUsername || 'Unknown'}</strong>
                <span>Followers: {profile.followerCount || 'N/A'}</span>
                <span>Posts: {profile.mediaCount || 'N/A'}</span>
              </div>
              <div className={styles.profileStatus}>
                {profile.isActive ? '🟢 Active' : '🔴 Inactive'}
              </div>
              <div className={styles.profilePermissions}>
                {profile.permissions && profile.permissions.includes('instagram_business_manage_messages') ? (
                  <span className={styles.permission}>✅ Can send DMs</span>
                ) : (
                  <span className={styles.permission}>❌ No DM permission</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DM Form */}
      {selectedProfileId && (
        <div className={styles.dmForm}>
          <h3>Send Direct Message</h3>
          <form onSubmit={handleSendDM}>
            <div className={styles.formGroup}>
              <label htmlFor="recipientId">Recipient Instagram User ID:</label>
              <input
                type="text"
                id="recipientId"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter Instagram user ID"
                required
              />
              <small>
                You can find user IDs by searching for users or from their profile URLs
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows={4}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.sendButton}
              disabled={isSending || !selectedProfileId}
            >
              {isSending ? '🔄 Sending...' : '📤 Send Direct Message'}
            </button>
          </form>

          {/* Status Messages */}
          {isSuccess && (
            <div className={styles.success}>
              ✅ Direct message sent successfully!
            </div>
          )}

          {isError && (
            <div className={styles.error}>
              ❌ Failed to send message. Please try again.
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className={styles.instructions}>
        <h3>How to Send Instagram DMs</h3>
        <div className={styles.steps}>
          <div className={styles.step}>
            <h4>1. Select Profile</h4>
            <p>Choose the Instagram account you want to send DMs from</p>
          </div>
          <div className={styles.step}>
            <h4>2. Enter Recipient ID</h4>
            <p>Find the Instagram user ID of the person you want to message</p>
          </div>
          <div className={styles.step}>
            <h4>3. Write Message</h4>
            <p>Compose your direct message (text only for now)</p>
          </div>
          <div className={styles.step}>
            <h4>4. Send</h4>
            <p>Click send and your message will be delivered instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramDM;
