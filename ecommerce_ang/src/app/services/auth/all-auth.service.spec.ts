import { TestBed } from '@angular/core/testing';

import { AllAuthService } from './all-auth.service';

describe('AllAuthService', () => {
  let service: AllAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
