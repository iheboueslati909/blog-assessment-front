import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationItem {
  id: string;
  message: string;
  read?: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private itemsSubject = new BehaviorSubject<NotificationItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  list(): NotificationItem[] {
    return this.itemsSubject.value;
  }

  add(message: string) {
    const item: NotificationItem = {
      id: Math.random().toString(36).slice(2, 9),
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.itemsSubject.next([item, ...this.itemsSubject.value]);
  }

  markRead(id: string) {
    const updated = this.itemsSubject.value.map((i) => (i.id === id ? { ...i, read: true } : i));
    this.itemsSubject.next(updated);
  }

  markAllRead() {
    const updated = this.itemsSubject.value.map((i) => ({ ...i, read: true }));
    this.itemsSubject.next(updated);
  }
}
