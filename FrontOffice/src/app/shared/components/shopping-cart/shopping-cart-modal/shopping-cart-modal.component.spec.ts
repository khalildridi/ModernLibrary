import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartModalComponent } from './shopping-cart-modal.component';

describe('ShoppingCartModalComponent', () => {
  let component: ShoppingCartModalComponent;
  let fixture: ComponentFixture<ShoppingCartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingCartModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
