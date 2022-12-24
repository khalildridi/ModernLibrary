import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BooksListModule } from 'src/app/modules/books/books-list/books-list.module';
import { CustomToastComponent } from 'src/app/shared/components/custom-toast/custom-toast.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from 'src/app/modules/auth/auth.module';
import { CheckoutComponent } from 'src/app/modules/checkout/checkout.component';
import { DashboardModule } from 'src/app/modules/dashboard/dashboard.module';
import { SwiperModule } from 'swiper/angular';
import { PageNotFoundComponent } from 'src/app/modules/page-not-found/page-not-found.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    PostsComponent,
    CheckoutComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    MaterialModule,
    BooksListModule,
    AuthModule,
    ReactiveFormsModule,
    DashboardModule,
    SwiperModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true,
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    }),
    NgxSpinnerModule,
  ],
  entryComponents: [CustomToastComponent], // add!
  exports: [DefaultComponent],
})
export class DefaultModule {}
