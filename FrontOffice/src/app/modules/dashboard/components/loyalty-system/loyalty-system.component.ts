import { Component, OnInit } from '@angular/core';
import { LoyaltySystem } from 'src/app/modules/models/loyalty-system.model';
import { LoyaltySystemService } from 'src/app/shared/services/loyalty-system.service';

@Component({
  selector: 'app-loyalty-system',
  templateUrl: './loyalty-system.component.html',
  styleUrls: ['./loyalty-system.component.scss'],
})
export class LoyaltySystemComponent implements OnInit {
  conditions: LoyaltySystem = new LoyaltySystem();

  constructor(private loyaltyService: LoyaltySystemService) {}

  ngOnInit(): void {
    this.loyaltyService.getLoyaltyConditions().subscribe((res: any) => {
      if (res) {
        this.conditions.percentages = res[0].percentages;
        this.conditions.ages = res[0].ages;
        this.conditions.numAquisitions = res[0].numAcquisitions;
        this.conditions.numSoldBooks = res[0].numSoldBooks;
      }
    });
  }
}
