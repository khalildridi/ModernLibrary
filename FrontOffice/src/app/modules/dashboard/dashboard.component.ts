import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  openTab = 1;

  constructor() {}

  ngOnInit(): void {}

  toggleTabs($tabNumber: number) {
    this.openTab = $tabNumber;
  }
}
