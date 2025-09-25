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
    <aside class="sidebar">
      <div class="brand">My Blog</div>
      <nav>
        <a routerLink="/articles" class="nav-link">Articles</a>
        <a routerLink="/articles/new" class="nav-link">New Article</a>
      </nav>

      <section class="notifications">
        <h4>Notifications <button (click)="markAll()" class="link-btn">Mark all read</button></h4>
        <ul>
          <li *ngFor="let n of notifications">
            <div class="msg" [class.unread]="!n.read">{{ n.message }}</div>
            <div class="meta">
              <small>{{ n.createdAt | date:'short' }}</small>
              <button (click)="markRead(n.id)" *ngIf="!n.read">Mark read</button>
            </div>
          </li>
        </ul>
      </section>

      <div class="footer">
        <button (click)="logout()">Logout</button>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.css'],
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
