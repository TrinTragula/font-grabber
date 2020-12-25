import { TestBed } from '@angular/core/testing';

import { ResolvedFontsService } from './resolved-fonts.service';

describe('ResolvedFontsService', () => {
  let service: ResolvedFontsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResolvedFontsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
