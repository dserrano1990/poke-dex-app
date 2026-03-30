import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pokemon } from '../../models/pokemon';
import { PokemonTranslationService } from '../../services/pokemon-translation.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<PokemonDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pokemon: any },
    private tralationService: PokemonTranslationService
  ){}
  ngOnInit(): void {
    console.log(this.data);
    
  }

  // Convierte las habilidades a array
  getPokemonAbilitiesArray(abilities: string | any[]): any[] {
    if (Array.isArray(abilities)) {
      return abilities;
    }
    // Si es string con formato "ability1, ability2"
    return abilities.split(',').map(a => ({ name: a.trim(), is_hidden: false }));
  }

  translateType(type: string): string {
    return this.tralationService.translateType(type)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
