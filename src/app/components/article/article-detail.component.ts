import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'article-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.component.html',
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private svc: ArticleService, 
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); 
    if (!id) {
      this.error = 'No article ID provided';
      return;
    }

    if (id === 'new') {
      this.router.navigate(['/articles', 'new']);
      return;
    }



    this.load(id);
  }

  load(id: string) {
    this.loading = true;
    this.error = null;
    this.cdRef.detectChanges();

    this.svc.get(id).subscribe({
      next: (res) => {
        this.article = res;
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load article';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });

    this.auth.currentUser$.subscribe(user => {
  console.log('AuthService currentUser$ updated:', user);
});
  }

  canEdit(): boolean {
    return this.auth.hasAnyRole(['Editor', 'Admin']);
  }

  canDelete(): boolean {
    return this.auth.hasRole('Admin');
  }

  edit() {
    if (!this.article?._id || !this.canEdit()) return;
    this.router.navigate(['/articles', this.article._id, 'edit']);
  }

  remove() {
    if (!this.article?._id || !this.canDelete()) return;
    if (!confirm('Delete this article?')) return;
    this.svc.delete(this.article._id).subscribe({
      next: () => this.router.navigate(['/articles']),
      error: (err) => alert(err?.error?.message || err?.message || 'Delete failed'),
    });
  }
}
