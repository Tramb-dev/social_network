import { TestBed } from '@angular/core/testing';

import { FormsValidationService } from './forms-validation.service';

describe('FormsValidationService', () => {
  let service: FormsValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
