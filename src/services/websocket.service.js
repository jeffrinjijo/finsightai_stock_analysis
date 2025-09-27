class WebSocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.maxReconnectDelay = 30000; // Max 30 seconds
    this.isConnected = false;
    this.pendingMessages = [];
  }

  // Connect to WebSocket server
  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    // In development, use the same host as the API
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = process.env.REACT_APP_API_URL || window.location.host;
    const wsUrl = `${protocol}${host}/ws?userId=${userId}`;
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      // Process any pending messages
      this.pendingMessages.forEach(message => {
        this.send(message.type, message.data);
      });
      this.pendingMessages = [];
      
      // Notify subscribers
      this.notifySubscribers('connection', { isConnected: true });
    };
    
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.notifySubscribers(message.type, message.data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.notifySubscribers('connection', { isConnected: false });
      this.attemptReconnect(userId);
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  // Attempt to reconnect with exponential backoff
  attemptReconnect(userId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(userId);
    }, delay);
  }
  
  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
  
  // Send a message to the WebSocket server
  send(type, data) {
    if (!this.isConnected || !this.socket) {
      // Queue the message if not connected
      this.pendingMessages.push({ type, data });
      return;
    }
    
    try {
      this.socket.send(JSON.stringify({ type, data }));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }
  
  // Subscribe to a message type
  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(type, callback);
    };
  }
  
  // Unsubscribe from a message type
  unsubscribe(type, callback) {
    if (this.subscribers.has(type)) {
      const callbacks = this.subscribers.get(type);
      callbacks.delete(callback);
      
      if (callbacks.size === 0) {
        this.subscribers.delete(type);
      }
    }
  }
  
  // Notify all subscribers of a message type
  notifySubscribers(type, data) {
    if (this.subscribers.has(type)) {
      this.subscribers.get(type).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket subscriber for ${type}:`, error);
        }
      });
    }
  }
  
  // Subscribe to market data updates
  subscribeToMarketData(symbols) {
    this.send('SUBSCRIBE', { symbols });
  }
  
  // Unsubscribe from market data updates
  unsubscribeFromMarketData(symbols) {
    this.send('UNSUBSCRIBE', { symbols });
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();

export default webSocketService;
