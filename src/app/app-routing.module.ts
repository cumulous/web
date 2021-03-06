import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';

import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: 'projects',
    canActivate: [AuthGuard],
    loadChildren: 'app/projects/projects.module#ProjectsModule',
  },
  {
    path: 'datasets',
    canActivate: [AuthGuard],
    loadChildren: 'app/datasets/datasets.module#DatasetsModule',
  },
  {
    path: 'analyses',
    canActivate: [AuthGuard],
    loadChildren: 'app/analyses/analyses.module#AnalysesModule',
  },
  {
    path: 'api',
    canActivate: [AuthGuard],
    loadChildren: 'app/swagger/swagger.module#SwaggerModule',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'message',
    component: NotificationComponent,
    outlet: 'notification',
  },
  {
    path: '',
    redirectTo: '/datasets',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
