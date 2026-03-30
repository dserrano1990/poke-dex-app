import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PokemonTranslationService {
  
  // Diccionario de tipos en español
  private typesMap: { [key: string]: string } = {
    'normal': 'Normal',
    'fire': 'Fuego',
    'water': 'Agua',
    'electric': 'Eléctrico',
    'grass': 'Planta',
    'ice': 'Hielo',
    'fighting': 'Lucha',
    'poison': 'Veneno',
    'ground': 'Tierra',
    'flying': 'Volador',
    'psychic': 'Psíquico',
    'bug': 'Bicho',
    'rock': 'Roca',
    'ghost': 'Fantasma',
    'dragon': 'Dragón',
    'dark': 'Siniestro',
    'steel': 'Acero',
    'fairy': 'Hada',
    'stellar': 'Estelar',
    'unknown': 'Desconocido'
  };

  // Diccionario de habilidades en español
  private abilitiesMap: { [key: string]: string } = {
    // Habilidades comunes
    'overgrow': 'Espesura',
    'chlorophyll': 'Clorofila',
    'blaze': 'Mar llamas',
    'torrent': 'Torrente',
    'solar-power': 'Poder solar',
    'thick-fat': 'Sebo',
    'intimidate': 'Intimidación',
    'flash-fire': 'Absorbe fuego',
    'levitate': 'Levitación',
    'pressure': 'Presión',
    'static': 'Elec. estática',
    'lightning-rod': 'Pararrayos',
    'cute-charm': 'Gran encanto',
    'magic-guard': 'Armadura mágica',
    'water-absorb': 'Absorbe agua',
    'volt-absorb': 'Absorbe voltios',
    'flame-body': 'Cuerpo llama',
    'poison-point': 'Punto tóxico',
    'adaptability': 'Adaptable',
    'sand-stream': 'Chorro arena',
    'drought': 'Sequía',
    'drizzle': 'Lluvia',
    'snow-warning': 'Nevada',
    'sand-rush': 'Ímpetu arena',
    'sand-force': 'Poder arena',
    'swift-swim': 'Nado rápido',
    'rain-dish': 'Colector',
    'zen-mode': 'Modo daruma',
    'moxie': 'Autoestima',
    'reckless': 'Audaz',
    'sheer-force': 'Potencia bruta',
    'iron-fist': 'Puño férreo',
    'technician': 'Experto',
    'sniper': 'Francotirador',
    'super-luck': 'Afortunado',
    'unnerve': 'Nerviosismo',
    'hustle': 'Entusiasmo',
    'guts': 'Agallas',
    'quick-feet': 'Pies rápidos',
    'limber': 'Flexibilidad',
    'immunity': 'Inmunidad',
    'own-tempo': 'Ritmo propio',
    'oblivious': 'Despiste',
    'inner-focus': 'Foco interno',
    'keen-eye': 'Vista lince',
    'tangled-feet': 'Tumbos',
    'run-away': 'Huida',
    'shell-armor': 'Caparazón',
    'natural-cure': 'Cura natural',
    'hydration': 'Hidratación',
    'dry-skin': 'Piel seca',
    'shed-skin': 'Mudar',
    'healer': 'Alma curalotodo',
    'regenerator': 'Regeneración',
    'magic-bounce': 'Espejo mágico',
    'prankster': 'Bromista',
    'shadow-tag': 'Sombra trampa',
    'arena-trap': 'Trampa arena',
    'wonder-guard': 'Velo maravillas',
    'sturdy': 'Robustez',
    'rock-head': 'Cabeza roca',
    'sticky-hold': 'Viscosidad',
    'clear-body': 'Cuerpo puro',
    'white-smoke': 'Humo blanco',
    'magnet-pull': 'Imán',
    'soundproof': 'Insonorizar',
    'damp': 'Humedad',
    'forewarn': 'Alarma',
    'trace': 'Calco',
    'download': 'Descarga',
    'analytic': 'Cálculo final',
    'filter': 'Filtro',
    'solid-rock': 'Roca sólida',
    'storm-drain': 'Colector',
    'motor-drive': 'Electromotor',
    'heatproof': 'Ignífugo',
    'battle-armor': 'Armadura batalla',
    'aftermath': 'Resquicio',
    'anger-point': 'Irascible',
    'anticipation': 'Anticipación',
    'frisk': 'Cacheo',
    'infiltrator': 'Allanamiento',
    'mold-breaker': 'Rompemoldes',
    'scrappy': 'Intrépido',
    'unaware': 'Ignorante',
    'simple': 'Simple',
    'gluttony': 'Glotonería',
    'pickup': 'Recogida',
    'synchronize': 'Sincronía',
    'shield-dust': 'Polvo escudo',
    'compound-eyes': 'Ojos compuestos',
    'tinted-lens': 'Cromolente',
    'swarm': 'Enjambre',
    'rivalry': 'Rivalidad',
    'vital-spirit': 'Espíritu vital',
    'early-bird': 'Madrugar',
    'insomnia': 'Insomnio',
    'big-pecks': 'Pecho ánimo',
    'friend-guard': 'Compiescolta',
    'flower-gift': 'Don floral',
    'harvest': 'Cosecha',
    'ice-body': 'Cuerpo hielo',
    'magma-armor': 'Escudo magma',
    'water-veil': 'Velo agua',
    'weak-armor': 'Armadura frágil',
    'heavy-metal': 'Metal pesado',
    'light-metal': 'Metal liviano',
    'toxic-boost': 'Ímpetu tóxico',
    'flare-boost': 'Ímpetu llama',
    'contrary': 'Inversión',
    'defiant': 'Competitivo',
    'justified': 'Justiciero',
    'competitive': 'Tenacidad',
    'cursed-body': 'Cuerpo maldito',
    'mummy': 'Momia',
    'imposter': 'Impostor',
    'protean': 'Multitipo',
    'libero': 'Líbero',
    'bulletproof': 'Antibalas',
    'magician': 'Prestidigitador',
    'pickpocket': 'Hurto',
    'stance-change': 'Cambio táctico',
    'schooling': 'Colegata',
    'comatose': 'Letargo',
    'disguise': 'Disfraz',
    'berserk': 'Irascible',
    'water-compaction': 'Hidrocompac.',
    'queenly-majesty': 'Júbilo majestuoso',
    'dazzling': 'Resplandor',
    'battle-bond': 'Fuerte afecto',
    'soul-heart': 'Corazón alma',
    'shadow-shield': 'Escudo sombra',
    'prism-armor': 'Armadura prisma',
    'beast-boost': 'Propulsión',
    'power-construct': 'Agrupación',
    'corrosion': 'Corrosión',
    'galvanize': 'Electrogénesis',
    'surge-surfer': 'Surfeo galvánico',
    'grassy-surge': 'Herbogénesis',
    'misty-surge': 'Nieblagénesis',
    'electric-surge': 'Electrogénesis',
    'psychic-surge': 'Psicogénesis',
    'long-reach': 'Alcance',
    'liquid-voice': 'Voz líquida',
    'fluffy': 'Peluche',
    'receiver': 'Receptor',
    'dancer': 'Pareja baile',
    'stakeout': 'Vigilante',
    'triage': 'Triaje',
    'emergency-exit': 'Retirada',
    'water-bubble': 'Burbuja',
    'steelworker': 'Acerero',
    'wimp-out': 'Huida',
    'innards-out': 'Sacar tripas',
    'costar': 'Camarada',
    'ice-scales': 'Escamas hielo',
    'mirror-armor': 'Armadura espejo',
    'propeller-tail': 'Cola hélice',
    'transistor': 'Transistor',
    'dragon-maw': 'Mandíbula dragón',
    'intrepid-sword': 'Espada indómita',
    'dauntless-shield': 'Escudo indómito',
    'lingering-aroma': 'Aroma envolvente',
    'gulp-missile': 'Tragamisil',
    'steely-spirit': 'Acero espiritual',
    'ripen': 'Maduración',
    'cotton-down': 'Algodón',
    'punishment': 'Castigo',
    'pastel-veil': 'Velo pastel',
    'curious-medicine': 'Medicina extraña',
    'gorilla-tactics': 'Agitación',
    'ice-face': 'Máscara hielo',
    'screen-cleaner': 'Limpiapantalla',
    'stamina': 'Firmeza',
    'steam-engine': 'Vapor',
    'wandering-spirit': 'Espíritu errante',
    'mimicry': 'Mimetismo'
  };

  // Traducir tipo
  translateType(typeName: string): string {
    return this.typesMap[typeName.toLowerCase()] || typeName;
  }

  // Traducir habilidad
  translateAbility(abilityName: string): string {
    return this.abilitiesMap[abilityName.toLowerCase()] || abilityName;
  }

  // Traducir lista de tipos
  translateTypes(types: any[]): string[] {
    return types.map(t => this.translateType(t.pokemon_v2_type.name));
  }

  // Traducir lista de habilidades
  translateAbilities(abilities: any[]): Array<{name: string, isHidden?: boolean}> {
    return abilities.map(a => ({
      name: this.translateAbility(a.pokemon_v2_ability.name),
      isHidden: a.is_hidden || false
    }));
  }

  // Obtener tipos formateados para mostrar
  getFormattedTypes(types: any[]): string {
    return this.translateTypes(types).join(' / ');
  }

  // Obtener habilidades formateadas para mostrar
  getFormattedAbilities(abilities: any[]): string {
    return this.translateAbilities(abilities)
      .map(a => a.name)
      .join(', ');
  }

  getStat(stats: any[]): number{
    const hpStat = stats.find((s) => s.pokemon_v2_stat.name === 'hp');
    return hpStat?.base_stat ?? 0;
  }
}