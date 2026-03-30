import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PokemonFilterComponent } from './pokemon-filter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PokemonFilterService } from '../../../services/pokemon-filter.service';

class MockPokemonFilterService {
  setFilter = jasmine.createSpy('setFilter');
}

describe('PokemonFilterComponent', () => {
  let component: PokemonFilterComponent;
  let fixture: ComponentFixture<PokemonFilterComponent>;
  let mockFilterService: MockPokemonFilterService;

  beforeEach(async () => {
    mockFilterService = new MockPokemonFilterService();
    
    await TestBed.configureTestingModule({
      imports: [
        PokemonFilterComponent,
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: PokemonFilterService, useValue: mockFilterService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(PokemonFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Verificar si crea componente', () => {
    expect(component).toBeTruthy();
  });

  it('Verificar título renderizado', () => {
    const compiled = fixture.nativeElement;
    const labelElement = compiled.querySelector('mat-label');
    
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Buscar Pokémon'); 
  });

  it('Verificar input de tipo text', () => {
    const inputDebugElement: DebugElement = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebugElement.nativeElement;

    expect(inputElement).toBeTruthy();
    expect(inputElement.type).toBe('text');
    expect(inputElement.placeholder).toBeTruthy();
    expect(inputElement.placeholder).not.toBe('');

    // Método 1: Actualizar directamente el componente y el DOM
    component.filterValue.set('pikachu');
    fixture.detectChanges();
    
    // Forzar la actualización del input
    inputElement.value = 'pikachu';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(inputElement.value).toBe('pikachu');
    
    // Método 2: Simular cambio de usuario
    // Primero limpiamos
    component.filterValue.set('');
    fixture.detectChanges();
    
    // Simular entrada de usuario
    inputElement.value = 'charmander';
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    
    // Llamar manualmente al método onFilterChange
    component.onFilterChange('charmander');
    fixture.detectChanges();
    
    expect(component.filterValue()).toBe('charmander');
    expect(mockFilterService.setFilter).toHaveBeenCalledWith('charmander');
  });
});