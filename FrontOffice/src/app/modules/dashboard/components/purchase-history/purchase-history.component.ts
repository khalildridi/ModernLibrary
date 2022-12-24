import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/models/user.model';
import { UserRestService } from 'src/app/shared/services/user-rest.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss'],
})
export class PurchaseHistoryComponent implements OnInit {
  user: User = new User();
  currentDate: Date = new Date();

  constructor(private userService: UserRestService) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getId().subscribe((res: any) => {
      if (res) {
        this.user = res.user;
      }
    });
  }
}
