import { TestBed } from '@angular/core/testing';

import { NnControlsService } from './nn-controls.service';

describe('NnControlsService', () => {
  let service: NnControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NnControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
