import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

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
export class SidebarComponent {

  constructor(private notif: NotificationService, private auth: AuthService) {}

  get notifications() {
    return this.notif.list();
  }

  markRead(id: string) {
    this.notif.markRead(id);
  }

  markAll() {
    this.notif.markAllRead();
  }

  logout() {
    this.auth.logout();
  }
}

export default SidebarComponent;
