import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Pokemon, PokemonApiResponse } from '../models/pokemon';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  getPokemonList(): Observable<Pokemon[]> {
    // Primero obtén el count, luego haz la consulta
    return this.getPokemonCount().pipe(
      switchMap(totalCount => {
        // Ahora sí tienes el número para usarlo en la query
        const body = this.query(totalCount);
        return this.http.post<PokemonApiResponse>(environment.graphqlUrl, body);
      }),
      map(response => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        }
        return response.data.pokemon_v2_pokemon;
      }),
      catchError(error => {
        console.error('Error en getPokemonList:', error);
        return throwError(() => new Error('Error al obtener lista de Pokémon'));
      })
    );
  }

  // query ahora recibe el limit como parámetro
  query(limit: number): Object {
    const query = {
      'query': `{
        pokemon_v2_pokemon(limit: ${limit}, offset: 0, where: { is_default: { _eq: true } }, order_by: { id: asc }) {
          id
          name
          height
          weight
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
          pokemon_v2_pokemonabilities {
            pokemon_v2_ability {
              name
            }
          }
          base_experience
          pokemon_v2_pokemonstats {
            base_stat
            pokemon_v2_stat {
              name
            }
          }
        }
      }`
    };
    return query;
  }

  getPokemonCount(): Observable<number> {
    const body = {
      query: `
        query {
          pokemon_v2_pokemon_aggregate {
            aggregate {
              count
            }
          }
        }
      `
    };

    return this.http.post<any>(environment.graphqlUrl, body).pipe(
      map(response => {
        if (response.errors) {
          throw new Error(response.errors[0].message);
        }
        
        const count = response.data?.pokemon_v2_pokemon_aggregate?.aggregate?.count;
        
        if (count === undefined) {
          throw new Error('No se pudo obtener el conteo de Pokémon');
        }
        
        return count;
      }),
      catchError(error => {
        console.error('Error en petición GraphQL:', error);
        return throwError(() => new Error('Error al obtener total de Pokémon'));
      })
    );
  }

  getPokemonProperties(id: number){
    const requestUrl = `${environment.apiUrl}pokemon/${id}`;

    return this.http.get(requestUrl);
  }
}
