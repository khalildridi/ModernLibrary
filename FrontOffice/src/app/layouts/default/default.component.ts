import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { fade } from 'src/app/animations';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  animations: [fade],
})
export class DefaultComponent implements OnInit {
  constructor(private contexts: ChildrenOutletContexts) {}

  ngOnInit(): void {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
