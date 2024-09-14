import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//Auth Components
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';

//Shop Components
import { ShopComponent } from './pages/shop/shop.component';
import { ProductComponent } from './pages/shop/product/product.component';
import { CartShopComponent } from './pages/shop/cart/cart.shop.component';

import { TestComponent } from './pages/test/test.component';

//Old Shop Content component
import { ShopContentComponent } from './pages/shop/content/content.component';

//Content Component
import { ContentComponent } from './pages/content/content.component';

//Project deus
import { DeusComponent } from './pages/projectdeus/deus.component';

//AIAnalysisService
import { AIComponent } from './pages/ai/ai.component';

//Brand Builder
import { BrandBuilderComponent } from './pages/brandbuilder/brandbuilder.component';

// route guard
import { AuthGuard } from './services/shared/guard/auth.guard';

// payment
import { ResponsePaymentComponent } from './pages/components/payment/response/response.payment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/brandbuilder',
    pathMatch: 'full',
    //loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'payment-response',
    component: ResponsePaymentComponent,
    loadChildren: () =>
      import(
        './pages/components/payment/response/response.payment.module'
      ).then((m) => m.ResponsePaymentModule),
  },
  {
    path: 'test',
    component: TestComponent,
    loadChildren: () =>
      import('./pages/test/test.module').then((m) => m.TestModule),
  },
  {
    path: 'login',
    component: LoginComponent,
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    component: RegisterComponent,
    loadChildren: () =>
      import('./pages/auth/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () =>
      import('./pages/user/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    loadChildren: () =>
      import('./pages/auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    loadChildren: () =>
      import('./pages/auth/verify-email/verify-email.module').then(
        (m) => m.VerifyEmailModule
      ),
  },
  {
    path: 'shop',
    component: ShopComponent,
    loadChildren: () =>
      import('./pages/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'shop/:category',
    component: ShopComponent,
    loadChildren: () =>
      import('./pages/shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'cart',
    component: CartShopComponent,
    loadChildren: () =>
      import('./pages/shop/cart/cart.shop.module').then(
        (m) => m.CartShopModule
      ),
  },
  {
    path: 'shop/product/:alias',
    component: ProductComponent,
    loadChildren: () =>
      import('./pages/shop/product/product.module').then(
        (m) => m.ProductModule
      ),
  },
  {
    path: 'shipping-policy',
    component: ShopContentComponent,
    loadChildren: () =>
      import('./pages/shop/content/content.module').then(
        (m) => m.ShopContentModule
      ),
  },
  {
    path: 'privacy-policy',
    component: ShopContentComponent,
    loadChildren: () =>
      import('./pages/shop/content/content.module').then(
        (m) => m.ShopContentModule
      ),
  },
  {
    path: 'refund-policy',
    component: ShopContentComponent,
    loadChildren: () =>
      import('./pages/shop/content/content.module').then(
        (m) => m.ShopContentModule
      ),
  },
  {
    path: 'terms-and-conditions',
    component: ShopContentComponent,
    loadChildren: () =>
      import('./pages/shop/content/content.module').then(
        (m) => m.ShopContentModule
      ),
  },
  {
    path: 'about-us',
    component: ShopContentComponent,
    loadChildren: () =>
      import('./pages/shop/content/content.module').then(
        (m) => m.ShopContentModule
      ),
  },
  {
    path: 'contact-us',
    component: ShopContentComponent,
    loadChildren: () =>
      import('./pages/shop/content/content.module').then(
        (m) => m.ShopContentModule
      ),
  },
  {
    path: 'deus',
    component: DeusComponent,
    loadChildren: () =>
      import('./pages/projectdeus/deus.module').then((m) => m.DeusModule),
  },
  {
    path: 'brandbuilder',
    component: BrandBuilderComponent,
    loadChildren: () =>
      import('./pages/brandbuilder/brandbuilder.module').then(
        (m) => m.BrandBuilderModule
      ),
  },
  {
    path: 'ai',
    component: AIComponent,
    loadChildren: () => import('./pages/ai/ai.module').then((m) => m.AIModule),
  },
];

@NgModule({
  imports: [
    IonicModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
