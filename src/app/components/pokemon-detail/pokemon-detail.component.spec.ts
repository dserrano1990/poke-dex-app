import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PokemonDetailComponent } from './pokemon-detail.component';
import { PokemonTranslationService } from '../../services/pokemon-translation.service';
import { Pokemon } from '../../models/pokemon';
import { environment } from '../../../environments/environment';

// Mock de Pokémon individual
const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  img: environment.imgUrl + '025.png',
  types: ['electric'],
  typesFormat: 'Eléctrico',
  abilities: [
    { name: 'static', is_hidden: false },
    { name: 'lightning-rod', is_hidden: true }
  ],
  abilitiesFormat: 'Estática, Pararrayos',
  hp: 35,
  pokemon_v2_pokemontypes: [],
  pokemon_v2_pokemonabilities: [],
  pokemon_v2_pokemonstats: []
};

// Mock del servicio de traducción
class MockPokemonTranslationService {
  translateType = jasmine.createSpy('translateType').and.callFake((type: string) => {
    const translations: { [key: string]: string } = {
      'electric': 'electric-type',
      'fire': 'fire-type',
      'water': 'water-type',
      'grass': 'grass-type'
    };
    return translations[type] || type;
  });
}

// Mock de MatDialogRef
class MockMatDialogRef {
  close = jasmine.createSpy('close');
}

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let mockDialogRef: MockMatDialogRef;
  let mockTranslationService: MockPokemonTranslationService;

  beforeEach(async () => {
    mockDialogRef = new MockMatDialogRef();
    mockTranslationService = new MockPokemonTranslationService();

    await TestBed.configureTestingModule({
      imports: [PokemonDetailComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { pokemon: mockPokemon } },
        { provide: PokemonTranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    
    // Espiar console.log para evitar ruido en pruebas
    spyOn(console, 'log');
    
    fixture.detectChanges();
  });

  // Pruebas básicas
  it('Verificar si crea componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería recibir datos del Pokémon a través de MAT_DIALOG_DATA', () => {
    expect(component.data.pokemon).toEqual(mockPokemon);
    expect(component.data.pokemon.name).toBe('pikachu');
    expect(component.data.pokemon.id).toBe(25);
  });

  // Pruebas de UI - ID y nombre
  it('debería mostrar el ID del Pokémon formateado con 3 dígitos', () => {
    const idElement = fixture.debugElement.query(By.css('.pokemon-id'));
    expect(idElement).toBeTruthy();
    expect(idElement.nativeElement.textContent).toContain('#025');
  });

  it('debería mostrar el nombre del Pokémon en formato título', () => {
    const nameElement = fixture.debugElement.query(By.css('.pokemon-name'));
    expect(nameElement).toBeTruthy();
    expect(nameElement.nativeElement.textContent).toContain('Pikachu');
  });

  it('debería mostrar los HP del Pokémon', () => {
    const hpElement = fixture.debugElement.query(By.css('.hp-value'));
    expect(hpElement).toBeTruthy();
    expect(hpElement.nativeElement.textContent).toContain('35');
  });

  it('debería mostrar el icono de corazón para HP', () => {
    const hpIcon = fixture.debugElement.query(By.css('.hp-icon'));
    expect(hpIcon).toBeTruthy();
    expect(hpIcon.nativeElement.textContent).toContain('❤️');
  });

  // Pruebas de imagen
  it('debería mostrar la imagen del Pokémon', () => {
    const imgElement = fixture.debugElement.query(By.css('.pokemon-image'));
    expect(imgElement).toBeTruthy();
    expect(imgElement.properties['src']).toBe(mockPokemon.img);
    expect(imgElement.properties['alt']).toBe(mockPokemon.name);
  });

  it('debería tener el contenedor de imagen con glow', () => {
    const imageGlow = fixture.debugElement.query(By.css('.image-glow'));
    expect(imageGlow).toBeTruthy();
  });

  // Pruebas de estadísticas
  it('debería mostrar la altura del Pokémon en metros', () => {
    const statItems = fixture.debugElement.queryAll(By.css('.stat-item'));
    const heightItem = statItems[0];
    const heightValue = heightItem.query(By.css('.stat-value'));
    const expectedHeight = mockPokemon.height / 10;
    expect(heightValue.nativeElement.textContent).toContain(expectedHeight.toString());
    expect(heightValue.nativeElement.textContent).toContain('m');
  });

  it('debería mostrar el peso del Pokémon en kilogramos', () => {
    const statItems = fixture.debugElement.queryAll(By.css('.stat-item'));
    const weightItem = statItems[1];
    const weightValue = weightItem.query(By.css('.stat-value'));
    const expectedWeight = mockPokemon.weight / 10;
    expect(weightValue.nativeElement.textContent).toContain(expectedWeight.toString());
    expect(weightValue.nativeElement.textContent).toContain('kg');
  });

  it('debería mostrar la experiencia base del Pokémon', () => {
    const statItems = fixture.debugElement.queryAll(By.css('.stat-item'));
    const experienceItem = statItems[2];
    const experienceValue = experienceItem.query(By.css('.stat-value'));
    expect(experienceValue.nativeElement.textContent).toContain('112');
  });

  it('debería mostrar separadores entre estadísticas', () => {
    const dividers = fixture.debugElement.queryAll(By.css('.stat-divider'));
    expect(dividers.length).toBe(2);
  });

  // Pruebas de tipos
  it('debería mostrar los tipos del Pokémon', () => {
    const typeBadges = fixture.debugElement.queryAll(By.css('.type-badge'));
    expect(typeBadges.length).toBe(mockPokemon.types.length);
  });

  it('debería llamar al servicio de traducción para cada tipo', () => {
    expect(mockTranslationService.translateType).toHaveBeenCalledWith('electric');
  });

  it('debería aplicar la clase CSS correcta según el tipo', () => {
    const typeBadge = fixture.debugElement.query(By.css('.type-badge'));
    expect(typeBadge.classes['electric-type']).toBeTruthy();
  });

  // Pruebas de habilidades
  it('debería mostrar las habilidades del Pokémon', () => {
    const abilityItems = fixture.debugElement.queryAll(By.css('.ability-item'));
    expect(abilityItems.length).toBe(mockPokemon.abilities.length);
  });

  it('debería mostrar el nombre de la habilidad', () => {
    const abilityNames = fixture.debugElement.queryAll(By.css('.ability-name'));
    expect(abilityNames[0].nativeElement.textContent).toContain('Static');
  });

  it('debería mostrar indicador de habilidad oculta', () => {
    const abilityItems = fixture.debugElement.queryAll(By.css('.ability-item'));
    const hiddenBadge = abilityItems[1].query(By.css('.ability-hidden'));
    expect(hiddenBadge).toBeTruthy();
    expect(hiddenBadge.nativeElement.textContent).toContain('Oculta');
  });

  it('debería mostrar el título de habilidades con icono', () => {
    const sectionTitle = fixture.debugElement.query(By.css('.section-title'));
    expect(sectionTitle).toBeTruthy();
    expect(sectionTitle.nativeElement.textContent).toContain('Habilidades');
    const titleIcon = sectionTitle.query(By.css('.title-icon'));
    expect(titleIcon.nativeElement.textContent).toContain('⚡');
  });

  // Pruebas de interacción
  it('debería cerrar el diálogo al hacer clic en el botón cerrar', () => {
    const closeButton = fixture.debugElement.query(By.css('.close-button'));
    expect(closeButton).toBeTruthy();
    
    closeButton.triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  // Pruebas de footer
  it('debería mostrar el footer con el nombre del Pokémon', () => {
    const footerText = fixture.debugElement.query(By.css('.footer-text'));
    expect(footerText).toBeTruthy();
    expect(footerText.nativeElement.textContent).toContain('Pokémon • pikachu');
  });

  it('debería mostrar el patrón decorativo en el footer', () => {
    const footerPattern = fixture.debugElement.query(By.css('.footer-pattern'));
    expect(footerPattern).toBeTruthy();
  });

  // Pruebas de métodos
  it('debería convertir habilidades a array correctamente', () => {
    // Test con array
    const abilitiesArray = [{ name: 'static', is_hidden: false }];
    const result1 = component.getPokemonAbilitiesArray(abilitiesArray);
    expect(result1).toEqual(abilitiesArray);
    
    // Test con string
    const abilitiesString = 'static, lightning-rod';
    const result2 = component.getPokemonAbilitiesArray(abilitiesString);
    expect(result2.length).toBe(2);
    expect(result2[0].name).toBe('static');
    expect(result2[0].is_hidden).toBe(false);
    expect(result2[1].name).toBe('lightning-rod');
    expect(result2[1].is_hidden).toBe(false);
  });

  it('debería traducir tipos usando el servicio', () => {
    const translatedType = component.translateType('electric');
    expect(mockTranslationService.translateType).toHaveBeenCalledWith('electric');
    expect(translatedType).toBe('electric-type');
  });

  it('debería manejar string vacío en getPokemonAbilitiesArray', () => {
    const result = component.getPokemonAbilitiesArray('');
    expect(result).toEqual([{ name: '', is_hidden: false }]);
  });

  it('debería manejar array vacío en getPokemonAbilitiesArray', () => {
    const result = component.getPokemonAbilitiesArray([]);
    expect(result).toEqual([]);
  });
});

// Pruebas adicionales para escenarios específicos
describe('PokemonDetailComponent con diferentes datos', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let mockDialogRef: MockMatDialogRef;
  let mockTranslationService: MockPokemonTranslationService;

  const mockPokemonSinHabilidades: Pokemon = {
    ...mockPokemon,
    name: 'ditto',
    id: 132,
    abilities: [],
    types: ['normal']
  };

  const mockPokemonSinExperiencia: Pokemon = {
    ...mockPokemon,
    name: 'missingno',
    id: 0,
    base_experience: 0
  };

  const mockPokemonConTiposMultiples: Pokemon = {
    ...mockPokemon,
    name: 'charizard',
    id: 6,
    types: ['fire', 'flying'],
    abilities: [{ name: 'blaze', is_hidden: false }]
  };

  beforeEach(async () => {
    mockDialogRef = new MockMatDialogRef();
    mockTranslationService = new MockPokemonTranslationService();

    await TestBed.configureTestingModule({
      imports: [PokemonDetailComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { pokemon: mockPokemonSinHabilidades } },
        { provide: PokemonTranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería manejar Pokémon sin habilidades', () => {
    const abilityItems = fixture.debugElement.queryAll(By.css('.ability-item'));
    expect(abilityItems.length).toBe(0);
    const abilitiesList = fixture.debugElement.query(By.css('.abilities-list'));
    expect(abilitiesList).toBeTruthy();
  });

  it('debería mostrar el valor por defecto cuando no hay experiencia (0)', () => {
    const newFixture = TestBed.createComponent(PokemonDetailComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.data = { pokemon: mockPokemonSinExperiencia };
    newFixture.detectChanges();
    
    const statItems = newFixture.debugElement.queryAll(By.css('.stat-item'));
    const experienceValue = statItems[2].query(By.css('.stat-value'));
    expect(experienceValue.nativeElement.textContent).toContain('0');
  });

  it('debería manejar Pokémon con múltiples tipos', async () => {
    const newFixture = TestBed.createComponent(PokemonDetailComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.data = { pokemon: mockPokemonConTiposMultiples };
    newFixture.detectChanges();
    
    const typeBadges = newFixture.debugElement.queryAll(By.css('.type-badge'));
    expect(typeBadges.length).toBe(2);
    expect(mockTranslationService.translateType).toHaveBeenCalledWith('fire');
    expect(mockTranslationService.translateType).toHaveBeenCalledWith('flying');
  });
});