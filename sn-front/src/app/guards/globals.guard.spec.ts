import { TestBed } from '@angular/core/testing';

import { GlobalsGuard } from './globals.guard';

describe('GlobalsGuard', () => {
  let guard: GlobalsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GlobalsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
