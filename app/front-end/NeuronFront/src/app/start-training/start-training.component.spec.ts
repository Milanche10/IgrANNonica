import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTrainingComponent } from './start-training.component';

describe('StartTrainingComponent', () => {
  let component: StartTrainingComponent;
  let fixture: ComponentFixture<StartTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
