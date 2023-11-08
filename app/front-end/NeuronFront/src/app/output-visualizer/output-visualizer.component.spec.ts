import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputVisualizerComponent } from './output-visualizer.component';

describe('OutputVisualizerComponent', () => {
  let component: OutputVisualizerComponent;
  let fixture: ComponentFixture<OutputVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
