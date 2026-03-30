// app.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // ← Importa esto

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule // ← Agrega esto para manejar animaciones
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Verificar si crea componente', () => {
    expect(component).toBeTruthy();
  });

  it('Verificar título renderizado', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Pokédex Angular');
  });

  it('Verificar componentes hijos filter-list', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-pokemon-filter')).toBeTruthy();
    expect(compiled.querySelector('app-pokemon-list')).toBeTruthy();
  });

  it('Verificar estructura HTML', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.app-grid')).toBeTruthy();
    expect(compiled.querySelector('.app-header')).toBeTruthy();
    expect(compiled.querySelector('.filters-sticky')).toBeTruthy();
    expect(compiled.querySelector('.app-main')).toBeTruthy();
  });
});