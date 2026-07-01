type Callback = (...args: any[]) => void;

class MockSocket {
  private listeners: Record<string, Callback[]> = {};
  private channel: BroadcastChannel;
  // private isConnected: boolean = false;
  

  public id: string = Math.random().toString(36).substring(2, 10);

  constructor(channelName: string = 'mock_socket_network') {
    this.channel = new BroadcastChannel(channelName);
    

    this.channel.onmessage = (event) => {
      const { type, payload, senderId } = event.data;
      if (senderId !== this.id) {
        this.triggerLocal(type, payload);
      }
    };
  }


  connect() {
    setTimeout(() => {
      // this.isConnected = true;
      this.triggerLocal('connect', undefined);
      console.log(`[MockSocket] Connected with ID: ${this.id}`);
    }, 500); 
  }

  on(event: string, cb: Callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }

  off(event: string, cb: Callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(fn => fn !== cb);
  }


  emit(event: string, data?: any) {

    const fakeLatency = 100 + Math.random() * 200; 

    setTimeout(() => {

      this.triggerLocal(`SERVER_RECEIVE_${event}`, data);
      this.channel.postMessage({ type: event, payload: data, senderId: this.id });
    }, fakeLatency);
  }


  triggerLocal(event: string, data?: any) {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach(fn => fn(data));
  }
}

export const socket = new MockSocket();
