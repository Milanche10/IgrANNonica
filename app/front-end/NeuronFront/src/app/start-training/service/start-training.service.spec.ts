import { TestBed } from '@angular/core/testing';

import { StartTrainingService } from './start-training.service';

describe('StartTrainingService', () => {
  let service: StartTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
