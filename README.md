## ✨ Características

- **Listado de Pokémon**: Visualización de Pokémon en formato de tarjetas con paginación
- **Búsqueda en tiempo real**: Filtro dinámico para buscar Pokémon por nombre
- **Detalle de Pokémon**: Vista detallada con información completa (tipos, habilidades, estadísticas)
- **Traducción automática**: Tipos y habilidades traducidos al español
- **Diseño responsive**: Adaptado para dispositivos móviles, tablets y escritorio
- **Interfaz moderna**: Componentes de Angular Material con diseño atractivo

## 🚀 Tecnologías

### Frontend
- **Angular 17+** - Framework principal
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático

### Herramientas de Desarrollo
- **Karma** - Framework de pruebas
- **Jasmine** - Framework de testing
- **Angular CLI** - Herramientas de desarrollo

## Estructura del Proyecto
src/
├── app/
│ ├── components/
│ │ ├── pokemon-list/
│ │ │ ├── pokemon-list.component.ts
│ │ │ ├── pokemon-list.component.html
│ │ │ ├── pokemon-list.component.scss
│ │ │ └── pokemon-list.component.spec.ts
│ │ ├── pokemon-detail/
│ │ │ ├── pokemon-detail.component.ts
│ │ │ ├── pokemon-detail.component.html
│ │ │ ├── pokemon-detail.component.scss
│ │ │ └── pokemon-detail.component.spec.ts
│ │ └── pokemon-filter/
│ │ ├── pokemon-filter.component.ts
│ │ ├── pokemon-filter.component.html
│ │ └── pokemon-filter.component.spec.ts
│ ├── services/
│ │ ├── pokemon.service.ts
│ │ ├── pokemon-filter.service.ts
│ │ └── pokemon-translation.service.ts
│ ├── models/
│ │ └── pokemon.ts
│ └── app.config.ts
├── assets/
│ └── gif/
│ └── loading.gif
└── environments/
├── environment.ts
└── environment.prod.ts


## Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Angular CLI** (v17 o superior)


## Clonar el repositorio
git clone https://github.com/tu-usuario/pokemon-app.git
cd pokemon-app

## Instalar dependencias
npm install

## Ejecutar pruebas unitarias
## Ejecutar todas las pruebas
ng test

## Ejecutar pruebas de un componente específico
ng test --include='**/pokemon-list.component.spec.ts'
ng test --include='**/pokemon-detail.component.spec.ts'
ng test --include='**/pokemon-filter.component.spec.ts'

## Ejecutar pruebas sin caché
ng test --source-map=false --watch=false

### Ejecución
## Iniciar servidor de desarrollo
ng serve
Navegar a http://localhost:4200