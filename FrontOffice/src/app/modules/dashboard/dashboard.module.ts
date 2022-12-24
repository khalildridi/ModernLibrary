import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AccountComponent } from './components/account/account.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { LoyaltySystemComponent } from './components/loyalty-system/loyalty-system.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,
    PurchaseHistoryComponent,
    LoyaltySystemComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
