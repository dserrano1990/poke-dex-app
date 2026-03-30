import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { PokemonTranslationService } from './pokemon-translation.service';
import { environment } from '../../environments/environment';

// Mock del servicio de traducción
class MockPokemonTranslationService {
  translateTypes = jasmine.createSpy('translateTypes').and.callFake((types: any[]) => {
    return types.map(t => t.pokemon_v2_type.name === 'fire' ? 'Fuego' : 'Volador');
  });
  
  getFormattedTypes = jasmine.createSpy('getFormattedTypes').and.returnValue('Fuego/Volador');
  
  translateAbilities = jasmine.createSpy('translateAbilities').and.callFake((abilities: any[]) => {
    return abilities.map(a => a.pokemon_v2_ability.name === 'blaze' ? 'Mar Llamas' : 'Poder Solar');
  });
  
  getFormattedAbilities = jasmine.createSpy('getFormattedAbilities').and.returnValue('Mar Llamas, Poder Solar');
  
  getStat = jasmine.createSpy('getStat').and.callFake((stats: any[]) => {
    const hpStat = stats?.find(s => s.pokemon_v2_stat?.name === 'hp');
    return hpStat?.base_stat || 45;
  });
}

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  let mockTranslationService: MockPokemonTranslationService;

  beforeEach(() => {
    mockTranslationService = new MockPokemonTranslationService();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PokemonService,
        { provide: PokemonTranslationService, useValue: mockTranslationService }
      ]
    });
    
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la lista de Pokémon usando GraphQL', () => {
    const mockCountResponse = {
      data: {
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: 1
          }
        }
      }
    };

    const mockPokemonResponse = {
      data: {
        pokemon_v2_pokemon: [
          {
            id: 1,
            name: 'bulbasaur',
            height: 7,
            weight: 69,
            base_experience: 64,
            pokemon_v2_pokemontypes: [
              {
                pokemon_v2_type: {
                  name: 'grass'
                }
              }
            ],
            pokemon_v2_pokemonabilities: [
              {
                pokemon_v2_ability: {
                  name: 'overgrow'
                },
                is_hidden: false
              }
            ],
            pokemon_v2_pokemonstats: [
              {
                base_stat: 45,
                pokemon_v2_stat: {
                  name: 'hp'
                }
              }
            ]
          }
        ]
      }
    };

    service.getPokemonList().subscribe(pokemon => {
      expect(pokemon).toBeTruthy();
      expect(pokemon.length).toBe(1);
      expect(pokemon[0].name).toBe('bulbasaur');
      expect(pokemon[0].id).toBe(1);
    });

    const countReq = httpMock.expectOne(environment.graphqlUrl);
    countReq.flush(mockCountResponse);

    const pokemonReq = httpMock.expectOne(environment.graphqlUrl);
    pokemonReq.flush(mockPokemonResponse);
  });

  it('debería manejar errores en la petición de conteo', (done) => {
    service.getPokemonList().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Error al obtener lista de Pokémon');
        done();
      }
    });

    const countReq = httpMock.expectOne(environment.graphqlUrl);
    countReq.error(new ErrorEvent('Network error', { message: 'Error de conexión' }));
  });

  it('debería manejar respuesta con errores en la consulta de conteo', (done) => {
    const mockCountError = {
      errors: [
        { message: 'Error en la consulta GraphQL' }
      ],
      data: null
    };

    service.getPokemonList().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Error al obtener lista de Pokémon');
        done();
      }
    });

    const countReq = httpMock.expectOne(environment.graphqlUrl);
    countReq.flush(mockCountError, { status: 200, statusText: 'OK' });
  });

  it('debería llamar a getPokemonCount y usar el count en la query', (done) => {
    const expectedCount = 150;
    const mockCountResponse = {
      data: {
        pokemon_v2_pokemon_aggregate: {
          aggregate: {
            count: expectedCount
          }
        }
      }
    };

    const mockPokemonResponse = {
      data: {
        pokemon_v2_pokemon: []
      }
    };

    service.getPokemonList().subscribe(() => {
      done();
    });

    const countReq = httpMock.expectOne(environment.graphqlUrl);
    expect(countReq.request.body.query).toContain('pokemon_v2_pokemon_aggregate');
    countReq.flush(mockCountResponse);

    const pokemonReq = httpMock.expectOne(environment.graphqlUrl);
    const query = pokemonReq.request.body.query;
    expect(query).toContain(`limit: ${expectedCount}`);
    expect(query).toContain('is_default: { _eq: true }');
    expect(query).toContain('order_by: { id: asc }');
    expect(query).toContain('pokemon_v2_pokemontypes');
    expect(query).toContain('pokemon_v2_pokemonabilities');
    expect(query).toContain('pokemon_v2_pokemonstats');
    expect(query).toContain('base_experience');
    
    pokemonReq.flush(mockPokemonResponse);
  });

  it('debería manejar error cuando el count es undefined', (done) => {
    const mockCountResponse = {
      data: {
        pokemon_v2_pokemon_aggregate: {
          aggregate: {}
        }
      }
    };

    service.getPokemonList().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Error al obtener lista de Pokémon');
        done();
      }
    });

    const countReq = httpMock.expectOne(environment.graphqlUrl);
    countReq.flush(mockCountResponse);
  });
});