import { TestBed } from '@angular/core/testing';

import { SeedingPlanService } from './seeding-plan.service';

describe('SeedingPlanService', () => {
  let service: SeedingPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeedingPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
