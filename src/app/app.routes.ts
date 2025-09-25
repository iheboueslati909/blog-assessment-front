import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) 
  },
 {
  path: 'articles',
  canActivate: [authGuard],
  children: [
    { path: '', loadComponent: () => import('./components/article/article-list.component').then(m => m.ArticleListComponent) },
    { path: 'new', loadComponent: () => import('./components/article/article-form.component').then(m => m.ArticleFormComponent) },
    { path: ':id', loadComponent: () => import('./components/article/article-detail.component').then(m => m.ArticleDetailComponent) },
    { path: ':id/edit', loadComponent: () => import('./components/article/article-form.component').then(m => m.ArticleFormComponent) },
  ],
}
,
  
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: '**', redirectTo: '/articles' }
];
