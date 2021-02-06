import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { NoAdminGuard } from './no-admin.guard';

describe('NoAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoAdminGuard]
    });
  });

  it('should ...', inject([NoAdminGuard], (guard: NoAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
