import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalExperimentControlsComponent } from './global-experiment-controls.component';

describe('GlobalExperimentControlsComponent', () => {
  let component: GlobalExperimentControlsComponent;
  let fixture: ComponentFixture<GlobalExperimentControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalExperimentControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalExperimentControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
