import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleneuronComponent } from './singleneuron.component';

describe('SingleneuronComponent', () => {
  let component: SingleneuronComponent;
  let fixture: ComponentFixture<SingleneuronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleneuronComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleneuronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
