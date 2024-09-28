import { TestBed } from '@angular/core/testing';

import { CustomSpaSettingsService } from './custom-spa-settings.service';

describe('CustomSpaSettingsService', () => {
  let service: CustomSpaSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomSpaSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
