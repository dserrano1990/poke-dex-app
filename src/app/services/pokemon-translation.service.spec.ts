import { TestBed } from '@angular/core/testing';

import { PokemonTranslationService } from './pokemon-translation.service';

describe('PokemonTranslationServiceTsService', () => {
  let service: PokemonTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
