// components/pokemon-filter/pokemon-filter.component.ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { PokemonFilterService } from '../../../services/pokemon-filter.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-pokemon-filter',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatIconModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './pokemon-filter.component.html',
  styleUrl: './pokemon-filter.component.scss'
})
export class PokemonFilterComponent {
  filterValue = signal<string>('');

  constructor(private filterService: PokemonFilterService) {}

  onFilterChange(value: string) {
    this.filterValue.set(value);
    this.filterService.setFilter(value);
  }

  clearFilter() {
    this.filterValue.set('');
    this.filterService.setFilter('');
  }
}