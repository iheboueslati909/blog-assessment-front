import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  standalone: true,
  selector: 'article-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private svc: ArticleService, 
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Change 'id' to '_id'
    console.log('Article ID from route:', id);
    
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
    this.cdRef.detectChanges(); // Force change detection
    
    this.svc.get(id).subscribe({
      next: (res) => {
        this.article = res;
        this.loading = false;
        this.cdRef.detectChanges(); // Force change detection
        console.log('Article loaded:', res);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load article';
        this.loading = false;
        this.cdRef.detectChanges(); // Force change detection
        console.error('Error loading article:', err);
      },
    });
  }

  edit() {
    if (!this.article?._id) return;
    this.router.navigate(['/articles', this.article._id, 'edit']);
  }

  remove() {
    if (!this.article?._id) return;
    if (!confirm('Delete this article?')) return;
    this.svc.delete(this.article._id).subscribe({
      next: () => this.router.navigate(['/articles']),
      error: (err) => alert(err?.error?.message || err?.message || 'Delete failed'),
    });
  }
}