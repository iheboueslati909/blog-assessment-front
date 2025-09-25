import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  standalone: true,
  selector: 'article-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './article-form.component.html',
})
export class ArticleFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error: string | null = null;
  editingId: string | null = null;

  constructor(private fb: FormBuilder, private svc: ArticleService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      image: [''],
      tags: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.editingId = id;
      this.load(id);
    }
  }

  load(id: string) {
    this.loading = true;
    this.svc.get(id).subscribe({
      next: (a) => {
        this.form.patchValue({
          title: a.title,
          content: a.content,
          image: a.image || '',
          tags: (a.tags || []).join(', '),
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load article';
        this.loading = false;
      },
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const raw = this.form.value;
    const payload = {
      title: raw.title,
      content: raw.content,
      image: raw.image || undefined,
      tags: raw.tags ? raw.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };

    const obs = this.editingId ? this.svc.update(this.editingId, payload) : this.svc.create(payload as any);
    obs.subscribe({
      next: (res: Article) => {
        this.loading = false;
        this.router.navigate(['/articles', res._id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Save failed';
      },
    });
  }
}

export default ArticleFormComponent;
