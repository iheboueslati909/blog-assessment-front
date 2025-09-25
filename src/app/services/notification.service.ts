import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

interface NotificationPayload {
  type: string;
  articleId: string;
  commentId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket!: Socket;
  private notifications$ = new BehaviorSubject<NotificationPayload | null>(null);

  constructor(private zone: NgZone) {}

  connect(token: string) {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io('http://localhost:3003', {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket'] // force WS for cleaner behavior
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Notification service');
    });

    this.socket.on('notification', (payload: NotificationPayload) => {
      // Run inside Angular zone so UI updates
      this.zone.run(() => {
        console.log('📩 Notification:', payload);
        this.notifications$.next(payload);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from Notification service');
    });
  }

  get notifications(): Observable<NotificationPayload | null> {
    return this.notifications$.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
