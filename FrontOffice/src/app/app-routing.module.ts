import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { BooksListComponent } from './modules/books/books-list/books-list.component';
import { HomeComponent } from './modules/home/home.component';
import { PostsComponent } from './modules/posts/posts.component';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { RegisterComponent } from './modules/auth/components/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { LoginGuardService } from './shared/services/login-guard.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { BookDetailsComponent } from './modules/books/books-list/components/book-details/book-details.component';
import { CheckoutGuardService } from './shared/services/checkout-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { animation: 'HomePage' },
      },
      {
        path: 'posts',
        component: PostsComponent,
        data: { animation: 'PostsPage' },
      },
      {
        path: 'books',
        component: BooksListComponent,
        data: { animation: 'BooksPage' },
        children: [],
      },
      {
        path: 'books/details/:id',
        component: BookDetailsComponent,
        data: { animation: 'BookDetailsPage' },
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: { animation: 'Checkout' },
        canActivate: [AuthGuardService, CheckoutGuardService],
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { animation: 'Login' },
        canActivate: [LoginGuardService],
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { animation: 'Register' },
        canActivate: [LoginGuardService],
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { animation: 'Dashboard' },
        canActivate: [AuthGuardService],
      },
      { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
    ],
  },
  //Wild Card Route for 404 request
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
