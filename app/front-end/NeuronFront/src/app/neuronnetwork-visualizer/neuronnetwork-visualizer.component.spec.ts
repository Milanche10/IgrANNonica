import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuronnetworkVisualizerComponent } from './neuronnetwork-visualizer.component';

describe('NeuronnetworkVisualizerComponent', () => {
  let component: NeuronnetworkVisualizerComponent;
  let fixture: ComponentFixture<NeuronnetworkVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuronnetworkVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuronnetworkVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
