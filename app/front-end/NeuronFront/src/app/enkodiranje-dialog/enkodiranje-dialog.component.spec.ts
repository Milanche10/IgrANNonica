import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnkodiranjeDialogComponent } from './enkodiranje-dialog.component';

describe('EnkodiranjeDialogComponent', () => {
  let component: EnkodiranjeDialogComponent;
  let fixture: ComponentFixture<EnkodiranjeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnkodiranjeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnkodiranjeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
