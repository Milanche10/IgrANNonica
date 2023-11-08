import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationThingyComponent } from './evaluation-thingy.component';

describe('EvaluationThingyComponent', () => {
  let component: EvaluationThingyComponent;
  let fixture: ComponentFixture<EvaluationThingyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationThingyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationThingyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
