import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { ArticleComment } from '../../models/comment.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'article-detail',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './article-detail.component.html',
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  comments: ArticleComment[] = [];
  newCommentContent = '';
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
    if (!id || id === 'new') {
      this.router.navigate(['/articles', 'new']);
      return;
    }

    this.load(id);
    this.loadComments(id);
  }

  load(id: string) {
    this.loading = true;
    this.error = null;
    this.cdRef.detectChanges();

    this.svc.get(id).subscribe({
      next: res => {
        this.article = res;
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: err => {
        this.error = err?.error?.message || err?.message || 'Failed to load article';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  loadComments(articleId: string) {
    this.svc.getComments(articleId).subscribe({
      next: res => {
        this.comments = res;
        this.cdRef.detectChanges();
      },
      error: err => console.error('Failed to load comments', err)
    });
  }

  addComment(parentCommentId?: string) {
    if (!this.article || !this.newCommentContent.trim()) return;

    const comment: Partial<ArticleComment> = {
      articleId: this.article._id!,
      authorId: this.auth.getCurrentUserId(),
      content: this.newCommentContent,
      parentCommentId
    };

    this.svc.createComment(comment).subscribe({
      next: res => {
        this.comments.unshift(res);
        this.newCommentContent = '';
        this.cdRef.detectChanges();
      },
      error: err => alert(err?.error?.message || 'Failed to post comment')
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
