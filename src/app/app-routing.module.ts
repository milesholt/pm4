import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';

// route guard
import { AuthGuard } from './services/shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
    //loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', component: LoginComponent, loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule) },
  { path: 'register', component: RegisterComponent, loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterModule) },
{ path: 'dashboard', component: DashboardComponent, loadChildren: () => import('./pages/user/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: 'verify-email', component: VerifyEmailComponent, loadChildren: () => import('./pages/auth/verify-email/verify-email.module').then(m => m.VerifyEmailModule) },
];
@NgModule({
  imports: [
    IonicModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
