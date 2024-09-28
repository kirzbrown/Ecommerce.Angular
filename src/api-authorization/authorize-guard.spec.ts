import { TestBed } from '@angular/core/testing';

import { AuthorizeGuard } from './authorize-guard';

describe('AuthorizeGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthorizeGuard = TestBed.get(AuthorizeGuard);
    expect(service).toBeTruthy();
  });
});
