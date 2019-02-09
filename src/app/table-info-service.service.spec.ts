import { TestBed, inject } from '@angular/core/testing';

import { TableInfoServiceService } from './table-info-service.service';

describe('TableInfoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableInfoServiceService]
    });
  });

  it('should be created', inject([TableInfoServiceService], (service: TableInfoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
