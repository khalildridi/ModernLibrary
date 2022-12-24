import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { MaterialModule } from '../material/material.module';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ShoppingCartModalComponent } from './components/shopping-cart/shopping-cart-modal/shopping-cart-modal.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CustomToastComponent,
    ShoppingCartComponent,
    ShoppingCartModalComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  exports: [HeaderComponent, FooterComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
  ],
})
export class SharedModule {}
