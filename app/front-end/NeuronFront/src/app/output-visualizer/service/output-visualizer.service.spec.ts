import { TestBed } from '@angular/core/testing';

import { OutputVisualizerService } from './output-visualizer.service';

describe('OutputVisualizerService', () => {
  let service: OutputVisualizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutputVisualizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
