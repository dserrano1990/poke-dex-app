import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { PokemonListComponent } from './pokemon-list.component';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonFilterService } from '../../services/pokemon-filter.service';
import { PokemonTranslationService } from '../../services/pokemon-translation.service';
import { Pokemon } from '../../models/pokemon';
import { environment } from '../../../environments/environment';

// Mock de datos
const mockPokemonList: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    img: environment.imgUrl + '001.png',
    types: ['Planta', 'Veneno'],
    typesFormat: 'Planta/Veneno',
    abilities: ['Espesura'],
    abilitiesFormat: 'Espesura',
    hp: 45,
    pokemon_v2_pokemontypes: [],
    pokemon_v2_pokemonabilities: [],
    pokemon_v2_pokemonstats: []
  },
  {
    id: 2,
    name: 'ivysaur',
    height: 10,
    weight: 130,
    base_experience: 142,
    img: environment.imgUrl + '002.png',
    types: ['Planta', 'Veneno'],
    typesFormat: 'Planta/Veneno',
    abilities: ['Espesura'],
    abilitiesFormat: 'Espesura',
    hp: 60,
    pokemon_v2_pokemontypes: [],
    pokemon_v2_pokemonabilities: [],
    pokemon_v2_pokemonstats: []
  },
  {
    id: 3,
    name: 'venusaur',
    height: 20,
    weight: 1000,
    base_experience: 236,
    img: environment.imgUrl + '003.png',
    types: ['Planta', 'Veneno'],
    typesFormat: 'Planta/Veneno',
    abilities: ['Espesura'],
    abilitiesFormat: 'Espesura',
    hp: 80,
    pokemon_v2_pokemontypes: [],
    pokemon_v2_pokemonabilities: [],
    pokemon_v2_pokemonstats: []
  }
];

// Mock de servicios
class MockPokemonService {
  getPokemonList = jasmine.createSpy('getPokemonList').and.returnValue(of(mockPokemonList));
}

class MockPokemonFilterService {
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();
  setFilter = jasmine.createSpy('setFilter');
  
  emitFilter(value: string) {
    this.filterSubject.next(value);
  }
}

class MockPokemonTranslationService {
  translateTypes = jasmine.createSpy('translateTypes').and.returnValue(['Planta', 'Veneno']);
  getFormattedTypes = jasmine.createSpy('getFormattedTypes').and.returnValue('Planta/Veneno');
  translateAbilities = jasmine.createSpy('translateAbilities').and.returnValue(['Espesura']);
  getFormattedAbilities = jasmine.createSpy('getFormattedAbilities').and.returnValue('Espesura');
  getStat = jasmine.createSpy('getStat').and.returnValue(45);
}

class MockMatDialog {
  open = jasmine.createSpy('open');
}

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let mockPokemonService: MockPokemonService;
  let mockFilterService: MockPokemonFilterService;
  let mockTranslationService: MockPokemonTranslationService;
  let mockDialog: MockMatDialog;

  beforeEach(async () => {
    mockPokemonService = new MockPokemonService();
    mockFilterService = new MockPokemonFilterService();
    mockTranslationService = new MockPokemonTranslationService();
    mockDialog = new MockMatDialog();

    await TestBed.configureTestingModule({
      imports: [
        PokemonListComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: PokemonFilterService, useValue: mockFilterService },
        { provide: PokemonTranslationService, useValue: mockTranslationService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    
    spyOn(console, 'log');
    
    fixture.detectChanges();
  });

  it('Verificar si crea componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar datos al inicializar', () => {
    expect(mockPokemonService.getPokemonList).toHaveBeenCalled();
    expect(component.allPokemonList().length).toBe(3);
    expect(component.pokemonList().length).toBe(3);
    expect(component.loading()).toBe(false);
  });

  it('debería mostrar el spinner cuando loading es true', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    const loadingText = fixture.debugElement.query(By.css('.loading-container p'));

    expect(spinner).toBeTruthy();
    expect(loadingText).toBeTruthy();
    expect(loadingText.nativeElement.textContent).toContain('Cargando listado...');
  });

  it('debería mostrar la cuadrícula de Pokémon cuando loading es false', () => {
    component.loading.set(false);
    component.pokemonList.set(mockPokemonList);
    fixture.detectChanges();

    const pokemonCards = fixture.debugElement.queryAll(By.css('.pokemon-card'));
    expect(pokemonCards.length).toBe(3);
  });

  it('debería mostrar el nombre del Pokémon en la tarjeta', () => {
    component.loading.set(false);
    component.pokemonList.set(mockPokemonList);
    fixture.detectChanges();

    const firstCardTitle = fixture.debugElement.query(By.css('.pokemon-card mat-card-title'));
    expect(firstCardTitle.nativeElement.textContent).toContain('bulbasaur');
  });

  it('debería mostrar la imagen del Pokémon', () => {
    component.loading.set(false);
    component.pokemonList.set(mockPokemonList);
    fixture.detectChanges();

    const images = fixture.debugElement.queryAll(By.css('.pokemon-card img'));
    expect(images.length).toBe(3);
    expect(images[0].properties['src']).toContain('001.png');
  });

  it('debería mostrar altura y peso del Pokémon', () => {
    component.loading.set(false);
    component.pokemonList.set(mockPokemonList);
    fixture.detectChanges();

    const badges = fixture.debugElement.queryAll(By.css('.badge-primary, .badge-secondary'));
    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0].nativeElement.textContent).toContain('Altura: 0.7m');
    expect(badges[1].nativeElement.textContent).toContain('Peso: 6.9kg');
  });

  it('debería mostrar tipos y habilidades', () => {
    component.loading.set(false);
    component.pokemonList.set(mockPokemonList);
    fixture.detectChanges();

    const typeBadge = fixture.debugElement.query(By.css('.badge-secondary-fixed'));
    expect(typeBadge).toBeTruthy();
    expect(typeBadge.nativeElement.textContent).toContain('Tipos:');
  });

  it('debería aplicar filtro cuando cambia el servicio de filtro', () => {
    spyOn(component as any, 'applyFilter').and.callThrough();
    
    mockFilterService.emitFilter('bulbasaur');
    fixture.detectChanges();
    
    expect(component.currentFilter()).toBe('bulbasaur');
    expect((component as any).applyFilter).toHaveBeenCalled();
  });

  it('debería filtrar Pokémon por nombre', () => {
    component.allPokemonList.set(mockPokemonList);
    component.currentFilter.set('bulbasaur');
    (component as any).applyFilter();
    
    expect(component.pokemonList().length).toBe(1);
    expect(component.pokemonList()[0].name).toBe('bulbasaur');
  });

  it('debería mostrar todos los Pokémon cuando el filtro está vacío', () => {
    component.allPokemonList.set(mockPokemonList);
    component.currentFilter.set('');
    (component as any).applyFilter();
    
    expect(component.pokemonList().length).toBe(3);
  });

  it('debería paginar correctamente', () => {
    const totalPokemons = 65;
    const mockLargeList = Array(totalPokemons).fill(null).map((_, index) => ({
      ...mockPokemonList[0],
      id: index + 1,
      name: `pokemon-${index + 1}`
    }));
    component.allPokemonList.set(mockLargeList);
    component.currentPage.set(1);
    
    component.pokemonList.set(component.filteredList());
    
    expect(component.pokemonList().length).toBe(30);
  });

  it('debería ir a la página siguiente', () => {
    component.pages.set([1, 2, 3]);
    component.currentPage.set(1);
    
    component.nextPage();
    
    expect(component.currentPage()).toBe(2);
    expect(component.currentFilter()).toBe('');
    expect(mockPokemonService.getPokemonList).toHaveBeenCalled();
  });

  it('debería ir a la página anterior', () => {
    component.pages.set([1, 2, 3]);
    component.currentPage.set(2);
    
    component.previousPage();
    
    expect(component.currentPage()).toBe(1);
    expect(component.currentFilter()).toBe('');
    expect(mockPokemonService.getPokemonList).toHaveBeenCalled();
  });

  it('debería cambiar de página usando el select', () => {
    component.pages.set([1, 2, 3]);
    component.currentPage.set(1);
    
    const mockEvent = { value: 3 } as MatSelectChange;
    component.changePage(mockEvent);
    
    expect(component.currentPage()).toBe(3);
    expect(component.currentFilter()).toBe('');
    expect(mockPokemonService.getPokemonList).toHaveBeenCalled();
  });

  it('debería deshabilitar el botón anterior en la primera página', () => {
    component.currentPage.set(1);
    component.loading.set(false);
    fixture.detectChanges();
    
    const prevButton = fixture.debugElement.query(By.css('.pagination-wrapper button:first-child'));
    expect(prevButton.nativeElement.disabled).toBe(true);
  });

  it('debería deshabilitar el botón siguiente en la última página', () => {
    component.pages.set([1, 2, 3]);
    component.currentPage.set(3);
    component.loading.set(false);
    fixture.detectChanges();
    
    const nextButton = fixture.debugElement.query(By.css('.pagination-wrapper button:last-child'));
    expect(nextButton.nativeElement.disabled).toBe(true);
  });

  it('debería deshabilitar botones mientras carga', () => {
    component.currentPage.set(2);
    component.loading.set(true);
    fixture.detectChanges();
    
    const buttons = fixture.debugElement.queryAll(By.css('.pagination-wrapper button'));
    buttons.forEach(button => {
      expect(button.nativeElement.disabled).toBe(true);
    });
  });

  it('debería abrir el diálogo de detalle al hacer clic en un Pokémon', () => {
    const pokemon = mockPokemonList[0];
    component.openPokemonDetail(pokemon);
    
    expect(mockDialog.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      {
        width: '400px',
        data: { pokemon: pokemon },
        panelClass: 'custom-dialog-container',
        disableClose: false,
        autoFocus: false
      }
    );
  });

  // TEST CORREGIDO: Calcular total de páginas
  it('debería calcular correctamente el total de páginas', fakeAsync(() => {
    const totalPokemons = 95;
    const mockLargeList = Array(totalPokemons).fill(null).map((_, index) => ({
      ...mockPokemonList[0],
      id: index + 1,
      name: `pokemon-${index + 1}`
    }));
    
    // Crear una nueva instancia del componente para este test específico
    mockPokemonService.getPokemonList.and.returnValue(of(mockLargeList));
    
    // Crear un nuevo fixture para este test
    const newFixture = TestBed.createComponent(PokemonListComponent);
    const newComponent = newFixture.componentInstance;
    
    newComponent.loadData();
    tick();
    newFixture.detectChanges();
    
    const expectedPages = Math.ceil(totalPokemons / 30);
    
    expect(newComponent.pages().length).toBe(expectedPages);
    expect(newComponent.pages()[0]).toBe(1);
    expect(newComponent.pages()[newComponent.pages().length - 1]).toBe(expectedPages);
  }));

  // TEST ADICIONAL: Verificar paginación con diferentes tamaños
  it('debería calcular páginas correctamente con diferentes cantidades de Pokémon', fakeAsync(() => {
    const testCases = [
      { total: 30, expectedPages: 1 },
      { total: 31, expectedPages: 2 },
      { total: 60, expectedPages: 2 },
      { total: 61, expectedPages: 3 },
      { total: 150, expectedPages: 5 }
    ];
    
    for (const testCase of testCases) {
      const mockList = Array(testCase.total).fill(null).map((_, index) => ({
        ...mockPokemonList[0],
        id: index + 1,
        name: `pokemon-${index + 1}`
      }));
      
      mockPokemonService.getPokemonList.and.returnValue(of(mockList));
      
      const newFixture = TestBed.createComponent(PokemonListComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.loadData();
      tick();
      newFixture.detectChanges();
      
      expect(newComponent.pages().length).toBe(testCase.expectedPages);
      
      // Limpiar para la siguiente iteración
      tick();
    }
  }));

  it('debería generar correctamente los IDs de Pokémon desde URL', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/25/';
    const id = component.getPokemonIdFromUrl(url);
    expect(id).toBe(25);
  });
});