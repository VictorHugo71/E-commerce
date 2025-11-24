import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCheckoutComponent } from './status-checkout.component';

describe('StatusCheckoutComponent', () => {
  let component: StatusCheckoutComponent;
  let fixture: ComponentFixture<StatusCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
