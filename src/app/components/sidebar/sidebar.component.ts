import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 min-h-screen bg-gray-900 p-4 border-r border-gray-800">
      <div class="text-white font-bold text-lg mb-6">My Blog</div>

      <nav class="space-y-2">
        <a routerLink="/articles" class="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800">Articles</a>
        <a routerLink="/articles/new" class="block px-3 py-2 rounded text-gray-300 hover:bg-gray-800">New Article</a>
      </nav>

      <section class="mt-6">
        <div class="flex items-center justify-between text-sm text-gray-300">
          <h4 class="font-semibold">Notifications</h4>
          <button (click)="markAll()" class="text-blue-400 hover:text-blue-300 text-xs">Mark all</button>
        </div>
        <ul class="mt-3 space-y-2">
          <li *ngFor="let n of notifications" class="p-2 rounded bg-gray-800">
            <div class="text-sm" [class.font-semibold]="!n.read">{{ n.message }}</div>
            <div class="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <small>{{ n.createdAt | date:'short' }}</small>
              <button (click)="markRead(n.id)" *ngIf="!n.read" class="text-xs text-blue-400">Mark</button>
            </div>
          </li>
        </ul>
      </section>

      <div class="mt-6 text-sm text-gray-400">
        <button (click)="logout()" class="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700">Logout</button>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit, OnDestroy {
  notifications: Array<any> = [];
  private sub?: Subscription;

  constructor(private notif: NotificationService, private auth: AuthService) {}

  ngOnInit(): void {
    // If user already has a token (e.g. after login), connect the socket
    const token = this.auth.getAccessToken();
    if (token) {
      this.notif.connect(token);
    }

    // Subscribe to incoming notifications and push them into local list
    this.sub = this.notif.notifications.subscribe((payload) => {
      if (!payload) return;

      // Keep a simple local representation. Adjust shape as needed.
      this.notifications = [
        {
          id: payload.commentId || payload.articleId || Math.random().toString(36).slice(2),
          message: payload.message,
          createdAt: new Date(),
          read: false,
        },
        ...this.notifications,
      ];
    });
  }

  markRead(id: string) {
    // For the new NotificationService we don't have markRead API in the provided file.
    // Implement local mark behavior so UI updates immediately.
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
  }

  markAll() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  logout() {
    this.notif.disconnect();
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.notif.disconnect();
  }
}

export default SidebarComponent;
