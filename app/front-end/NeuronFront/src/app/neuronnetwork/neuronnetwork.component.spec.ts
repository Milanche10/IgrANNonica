import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuronnetworkComponent } from './neuronnetwork.component';

describe('NeuronnetworkComponent', () => {
  let component: NeuronnetworkComponent;
  let fixture: ComponentFixture<NeuronnetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuronnetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuronnetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
