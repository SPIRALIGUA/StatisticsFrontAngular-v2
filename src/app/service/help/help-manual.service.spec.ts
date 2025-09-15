import { TestBed } from '@angular/core/testing';

import { HelpManualService } from './help-manual.service';

describe('HelpManualService', () => {
  let service: HelpManualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpManualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
