import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosDialogComponent } from './dados-dialog.component';

describe('DadosDialogComponent', () => {
  let component: DadosDialogComponent;
  let fixture: ComponentFixture<DadosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DadosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
