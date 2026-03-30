// services/pokemon-filter.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonFilterService {
  // BehaviorSubject mantiene el valor actual del filtro
  private filterSubject = new BehaviorSubject<string>('');
  
  // Observable público para que los componentes se suscriban
  filter$ = this.filterSubject.asObservable();

  // Método para actualizar el filtro desde el componente de filtro
  setFilter(filter: string) {
    this.filterSubject.next(filter);
  }

  // Método para obtener el valor actual del filtro
  getCurrentFilter(): string {
    return this.filterSubject.value;
  }
}