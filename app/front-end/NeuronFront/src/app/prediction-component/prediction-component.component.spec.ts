import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionComponentComponent } from './prediction-component.component';

describe('PredictionComponentComponent', () => {
  let component: PredictionComponentComponent;
  let fixture: ComponentFixture<PredictionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
