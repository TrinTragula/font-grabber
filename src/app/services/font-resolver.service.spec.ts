import { TestBed } from '@angular/core/testing';

import { FontResolverService } from './font-resolver.service';

describe('FontResolverService', () => {
  let service: FontResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
