import { TestBed } from '@angular/core/testing';

import { LoadingScreenServiceService } from './loading-screen-service.service';

describe('LoadingScreenServiceService', () => {
  let service: LoadingScreenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingScreenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
