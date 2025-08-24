import React, { useState, useEffect } from 'react';
import { useApi } from '../../utils/api';
import styles from './InstagramDashboard.module.css';

interface InstagramProfile {
  id: string;
  username: string;
  media_count: number;
}

interface DirectMessage {
  id: string;
  participants: any[];
  messages: any[];
}

interface Comment {
  id: string;
  text: string;
  from: any;
  username: string;
  timestamp: string;
}

const InstagramDashboard: React.FC = () => {
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_URL || 'https://test-nest-api-production.up.railway.app';

  // Fetch Instagram profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/instagram/profile`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch direct messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/instagram/messages?limit=25`);
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/instagram/comments?limit=25`);
      const data = await response.json();
      setComments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send direct message
  const sendDirectMessage = async () => {
    if (!selectedUser || !messageText.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/instagram/send-dm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedUser,
          message: messageText,
        }),
      });

      if (response.ok) {
        setMessageText('');
        setSelectedUser('');
        alert('Message sent successfully!');
        fetchMessages(); // Refresh messages
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Reply to comment
  const replyToComment = async (commentId: string, replyText: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/instagram/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyText,
        }),
      });

      if (response.ok) {
        alert('Reply sent successfully!');
        fetchComments(); // Refresh comments
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/instagram/search-users?query=${searchQuery}`);
      const data = await response.json();
      console.log('Search results:', data);
      // Handle search results as needed
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMessages();
    fetchComments();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Instagram DM Automation</h1>
        {profile && (
          <div className={styles.profileInfo}>
            <span>@{profile.username}</span>
            <span>{profile.media_count} posts</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {/* Send Direct Message Section */}
        <div className={styles.section}>
          <h2>Send Direct Message</h2>
          <div className={styles.messageForm}>
            <input
              type="text"
              placeholder="Recipient ID"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Message content"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className={styles.textarea}
              rows={3}
            />
            <button
              onClick={sendDirectMessage}
              disabled={loading || !selectedUser || !messageText.trim()}
              className={styles.button}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {/* User Search Section */}
        <div className={styles.section}>
          <h2>Search Users</h2>
          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search by username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
            />
            <button
              onClick={searchUsers}
              disabled={loading || !searchQuery.trim()}
              className={styles.button}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className={styles.section}>
          <h2>Recent Direct Messages</h2>
          <button onClick={fetchMessages} className={styles.refreshButton}>
            Refresh Messages
          </button>
          <div className={styles.messagesList}>
            {messages.map((message) => (
              <div key={message.id} className={styles.messageItem}>
                <div className={styles.messageHeader}>
                  <span>Conversation ID: {message.id}</span>
                  <span>{message.participants?.length || 0} participants</span>
                </div>
                <div className={styles.messageContent}>
                  {message.messages?.slice(0, 3).map((msg: any, index: number) => (
                    <div key={index} className={styles.messageText}>
                      <strong>{msg.from?.username || 'Unknown'}:</strong> {msg.message}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className={styles.section}>
          <h2>Recent Comments</h2>
          <button onClick={fetchComments} className={styles.refreshButton}>
            Refresh Comments
          </button>
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <strong>{comment.username}</strong>
                  <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>
                <div className={styles.commentText}>{comment.text}</div>
                <div className={styles.commentActions}>
                  <input
                    type="text"
                    placeholder="Reply to comment"
                    className={styles.replyInput}
                    id={`reply-${comment.id}`}
                  />
                  <button
                    onClick={() => {
                      const replyText = (document.getElementById(`reply-${comment.id}`) as HTMLInputElement)?.value;
                      if (replyText) replyToComment(comment.id, replyText);
                    }}
                    className={styles.replyButton}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramDashboard;
