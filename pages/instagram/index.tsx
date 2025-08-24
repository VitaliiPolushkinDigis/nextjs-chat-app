import React, { useState } from 'react';
import InstagramProfileManager from '../../components/Instagram/InstagramProfileManager';
import InstagramDM from '../../components/Instagram/InstagramDM';
import styles from './InstagramDashboard.module.css';

const InstagramDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'dm'>('profiles');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Instagram Automation Dashboard</h1>
        <p className={styles.subtitle}>
          Manage your Instagram profiles and send automated messages
        </p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'profiles' ? styles.active : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          📱 Profile Management
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'dm' ? styles.active : ''}`}
          onClick={() => setActiveTab('dm')}
        >
          💬 Send Direct Messages
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'profiles' && (
          <div className={styles.tabPanel}>
            <InstagramProfileManager />
          </div>
        )}
        
        {activeTab === 'dm' && (
          <div className={styles.tabPanel}>
            <InstagramDM />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Connected Profiles</h3>
          <p className={styles.statNumber}>0</p>
          <small>Instagram accounts</small>
        </div>
        <div className={styles.statCard}>
          <h3>Messages Sent</h3>
          <p className={styles.statNumber}>0</p>
          <small>Today</small>
        </div>
        <div className={styles.statCard}>
          <h3>Active Automations</h3>
          <p className={styles.statNumber}>0</p>
          <small>Running</small>
        </div>
      </div>
    </div>
  );
};

export default InstagramDashboard;
