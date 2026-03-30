// components/pokemon-list/pokemon-list.component.ts
import { Component, OnInit, signal, effect, computed } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonFilterService } from '../../services/pokemon-filter.service'; 
import { Pokemon } from '../../models/pokemon';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatOption, MatSelectChange } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { PokemonTranslationService } from '../../services/pokemon-translation.service';
import { MatDialog } from '@angular/material/dialog';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    MatCardModule, 
    MatBadgeModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    MatFormField, 
    MatSelect, 
    MatOption,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent implements OnInit {
  // Lista completa de Pokémon (sin filtrar)
  allPokemonList = signal<Pokemon[]>([]);
  
  // Lista filtrada para mostrar
  pokemonList = signal<Pokemon[]>([]);
  
  loading = signal<boolean>(false);
  error = signal<string>('');
  // previous = signal<string>('');
  // next = signal<string>('');
  currentFilter = signal<string>('');
  pages = signal<number[]>([]);
  currentPage = signal<number>(1);

  constructor(
    private service: PokemonService,
    private filterService: PokemonFilterService,
    private translationService: PokemonTranslationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    // Suscribirse a los cambios del filtro
    this.filterService.filter$.subscribe(filter => {
      this.currentFilter.set(filter);
      this.applyFilter();
    });
  }

  // Aplicar filtro a la lista completa
  private applyFilter() {
    const filter = this.currentFilter().toLowerCase();
    const allPokemon = this.allPokemonList();
    
    if (!filter) {
      this.pokemonList.set(this.filteredList());
      console.log('pokemonList', this.pokemonList());
    } else {
      const filtered = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filter)
      );
      if (filtered && filtered.length > 0) {
        this.pokemonList.set(filtered);
      }else{
        //ir a buscar por nombre a api
      }
    }
  }

  filteredList(){
    const start = (this.currentPage() - 1) * 30;
    const end = start + 30;
    const paginatedPokemon = this.allPokemonList().slice(start, end);
    return paginatedPokemon;
  }

  loadData() {
    this.loading.set(true);
    this.error.set('');

    this.service.getPokemonList()
    .pipe(
      map((response) => {
        return response.map(pokemon => {
          const id_format =
            pokemon.id.toString().length === 1 ? "00" + pokemon.id :
            pokemon.id.toString().length === 2 ? "0" + pokemon.id :
            pokemon.id;

          return {
            ...pokemon,
            img: environment.imgUrl + id_format + ".png",
            types: this.translationService.translateTypes(
              pokemon.pokemon_v2_pokemontypes
            ),
            typesFormat: this.translationService.getFormattedTypes(
              pokemon.pokemon_v2_pokemontypes
            ),
            abilities: this.translationService.translateAbilities(
              pokemon.pokemon_v2_pokemonabilities
            ),
            abilitiesFormat: this.translationService.getFormattedAbilities(
              pokemon.pokemon_v2_pokemonabilities
            ),
            hp: this.translationService.getStat(pokemon.pokemon_v2_pokemonstats)
          };
        });
      }),
      tap((transformedPokemons) => {
        // 👉 Guardas TODO
        this.allPokemonList.set(transformedPokemons);

        // 👉 Aquí recién filtras/paginas
        this.pokemonList.set(this.filteredList());

        if (this.pages().length === 0) {
          const totalPages = Math.ceil(transformedPokemons.length / 30);
          const newArray = Array.from({ length: totalPages }, (_, i) => i + 1);
          this.pages.set(newArray);
        }
        console.log(this.allPokemonList);
        
        this.loading.set(false);
      })
    )
    .subscribe();
  }

  nextPage() {
    this.currentFilter.set('');
    this.currentPage.update(page => page + 1);
    this.loadData();
  }

  previousPage() {
    this.currentFilter.set('');
    this.currentPage.update(page => page - 1);
    this.loadData();
  }

  changePage(event: MatSelectChange){
    this.currentFilter.set('');
    const pageNumber = event.value as number;
    this.currentPage.update(page => pageNumber);
    
    this.loadData();
  }

  getPokemonIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  }

  openPokemonDetail(pokemon: Pokemon): void {
    this.dialog.open(PokemonDetailComponent, {
      width: '400px',
      data: { pokemon: pokemon },
      panelClass: 'custom-dialog-container',
      disableClose: false,
      autoFocus: false
    });
  }
}