import { TestBed } from '@angular/core/testing';

import { ProgressApiService } from './progress-api.service';

describe('ProgressApiService', () => {
  let service: ProgressApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
