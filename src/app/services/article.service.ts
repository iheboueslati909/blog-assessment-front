import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, ArticleCreateRequest, ArticleUpdateRequest } from '../models/article.model';
import { ArticleComment, PaginatedComments } from '../models/comment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private readonly API_URL = 'http://localhost:3001/api/articles';

  private authHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getAccessToken();
    const headers = new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    });
    return { headers };
  }

  list(query?: { tag?: string; authorId?: string }): Observable<Article[]> {
    const params: Record<string, string> = {};
    if (query?.tag) params['tag'] = query.tag;
    if (query?.authorId) params['authorId'] = query.authorId;
    return this.http.get<Article[]>(this.API_URL, { params });
  }

  get(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.API_URL}/${id}`);
  }

  create(payload: ArticleCreateRequest): Observable<Article> {
    return this.http.post<Article>(this.API_URL, payload, this.authHeaders());
  }

  update(id: string, payload: ArticleUpdateRequest): Observable<Article> {
    return this.http.put<Article>(`${this.API_URL}/${id}`, payload, this.authHeaders());
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, this.authHeaders());
  }

  /**
   * Get comments for an article. The backend returns a paginated payload with top-level comments
   * where each comment may include a `replies` array.
   */
  getComments(articleId: string, page = 1, limit = 20): Observable<PaginatedComments> {
    const params: any = { page, limit };
    return this.http.get<PaginatedComments>(`${this.API_URL}/${articleId}/comments`, { params });
  }

  createComment(comment: Partial<ArticleComment>): Observable<ArticleComment> {
    return this.http.post<ArticleComment>(`${this.API_URL}/${comment.articleId}/comments`, comment);
  }
}
