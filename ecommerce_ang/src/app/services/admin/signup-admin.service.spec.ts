import { TestBed } from '@angular/core/testing';

import { SignupAdminService } from './signup-admin.service';

describe('SignupAdminService', () => {
  let service: SignupAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
