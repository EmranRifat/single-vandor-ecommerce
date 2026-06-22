'use client';

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

// SVG Icons as React components
const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-4-4V8a6 6 0 10-12 0v5l-4 4h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const BellOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0M8 8l8 8m-8-8V6a6 6 0 016-6 6 6 0 016 6v2l4 4-4-4-8-8z" />
  </svg>
);

const CircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="8" />
  </svg>
);

interface WebSocketConfig {
  channel: string;
  websocketUrl: string;
  hasPermission: boolean;
}

interface Props {
  config: WebSocketConfig | null;
}

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export default function WebSocketNotificationComponent({ config }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  // Connect to WebSocket
  const connectWebSocket = () => {
    if (!config || !config.hasPermission) {
      return;
    }

    try {
      // Get token from cookies - try multiple cookie names
      const accessToken = Cookies.get('access') 
      if (!accessToken) {
        console.log('No access token found for WebSocket connection');
        return;
      }

      // Create WebSocket connection with auth token
      const wsUrl = `${config.websocketUrl}&token=${accessToken}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`WebSocket connected to channel: ${config.channel}`);
        setIsConnected(true);
        setConnectionAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Create notification object
          const notification: Notification = {
            id: `${Date.now()}-${Math.random()}`,
            message: data.message || 'New notification',
            timestamp: new Date(),
            type: data.type || 'info'
          };

          setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && connectionAttempts < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, connectionAttempts), 30000); // Exponential backoff
          console.log(`Attempting to reconnect in ${timeout}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connectWebSocket();
          }, timeout);
        }
      };

    //   ws.onerror = (error) => {
    //     console.error('WebSocket error:', error);
    //     setIsConnected(false);
    //   };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
  };

  // Initialize connection on mount
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      disconnectWebSocket();
    };
  }, [config]);

  // Handle visibility change (reconnect when tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && config) {
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, config]);

  // Don't render if no config or no permission
  if (!config || !config.hasPermission) {
    return null;
  }

  const unreadCount = notifications.length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'success':
        return '🟢';
      default:
        return '🔵';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:text-gray-200 transition-colors duration-200"
        title={`WebSocket ${isConnected ? 'Connected' : 'Disconnected'} - Channel: ${config.channel}`}
      >
        {isConnected ? (
          <BellIcon className="w-5 h-5" />
        ) : (
          <BellOffIcon className="w-5 h-5" />
        )}
        
        {/* Connection Status Indicator */}
        <CircleIcon 
          className={`absolute -top-1 -right-1 w-3 h-3 ${
            isConnected ? 'text-green-400' : 'text-red-400'
          }`} 
        />
        
        {/* Notification Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
                <CircleIcon 
                  className={`w-2 h-2 ${
                    isConnected ? 'text-green-400' : 'text-red-400'
                  }`} 
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Channel: {config.channel}
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BellIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {isConnected ? 'Listening for new notifications...' : 'Reconnecting...'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="text-sm">
                        {getNotificationIcon(notification.type || 'info')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
