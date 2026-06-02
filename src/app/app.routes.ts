  import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./modules/home/home').then(m => m.Home) },
  { path: 'investigadores', loadComponent: () => import('./modules/researchers/researchers').then(m => m.Researchers) },
  { path: 'proyectos', loadComponent: () => import('./modules/projects/projects').then(m => m.Projects) },
  { path: 'publicaciones', loadComponent: () => import('./modules/publications/publications').then(m => m.Publications) },
  { path: 'contacto', loadComponent: () => import('./modules/contact/contact').then(m => m.Contact) },
  { path: 'admin', loadComponent: () => import('./modules/admin/admin').then(m => m.Admin) },
  { path: 'forgot-password', loadComponent: () => import('./modules/auth/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./modules/auth/reset-password.component').then(m => m.ResetPasswordComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'researchers', pathMatch: 'full' },
      { path: 'researchers', loadComponent: () => import('./modules/dashboard/pages/researchers.component').then(m => m.ResearchersDashboardComponent) },
      { path: 'researchers/new', loadComponent: () => import('./modules/dashboard/pages/researcher-form.component').then(m => m.ResearcherFormComponent) },
      { path: 'researchers/edit/:id', loadComponent: () => import('./modules/dashboard/pages/researcher-form.component').then(m => m.ResearcherFormComponent) },
      
      { path: 'projects', loadComponent: () => import('./modules/dashboard/pages/projects.component').then(m => m.ProjectsDashboardComponent) },
      { path: 'projects/new', loadComponent: () => import('./modules/dashboard/pages/project-form.component').then(m => m.ProjectFormComponent) },
      { path: 'projects/edit/:id', loadComponent: () => import('./modules/dashboard/pages/project-form.component').then(m => m.ProjectFormComponent) },
      
      { path: 'publications', loadComponent: () => import('./modules/dashboard/pages/publications.component').then(m => m.PublicationsDashboardComponent) },
      { path: 'publications/new', loadComponent: () => import('./modules/dashboard/pages/publication-form.component').then(m => m.PublicationFormComponent) },
      { path: 'publications/edit/:id', loadComponent: () => import('./modules/dashboard/pages/publication-form.component').then(m => m.PublicationFormComponent) },
      
      { path: 'settings', loadComponent: () => import('./modules/dashboard/pages/settings.component').then(m => m.SettingsComponent) },

      { path: 'social-networks', loadComponent: () => import('./modules/dashboard/pages/social-networks.component').then(m => m.SocialNetworksDashboardComponent) },
      { path: 'social-networks/new', loadComponent: () => import('./modules/dashboard/pages/social-network-form.component').then(m => m.SocialNetworkFormComponent) },
      { path: 'social-networks/edit/:id', loadComponent: () => import('./modules/dashboard/pages/social-network-form.component').then(m => m.SocialNetworkFormComponent) },
      
      { path: 'settings', loadComponent: () => import('./modules/dashboard/pages/group-settings.component').then(m => m.GroupSettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
