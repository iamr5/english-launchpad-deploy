# Demos

Un archivo por demo. El nombre del archivo **es** la URL:
`democip.json` → `aprendoenglish.com/democip`.

Cada archivo sólo lista lo que se aparta de los valores por defecto
(`DEFAULTS` en [`src/lib/demo-config.ts`](../lib/demo-config.ts)). Un demo sin
nada configurado se ve exactamente como el demo genérico.

## Crear uno

```json
{
  "institution": "Universidad Ejemplo",
  "published": true,
  "meta": {
    "title": "AprendoEnglish × Ejemplo · Demo",
    "description": "Texto que sale al compartir el enlace por WhatsApp."
  },
  "brand": { "headerText": "Inglés Ejemplo", "logo": "https://…/logo.png" },
  "colors": {
    "accent": "#0F5B8C",
    "modules": ["#3faa24", "#ff6ba0", "#b875f5", "#1cb0f6", "#fd5d04"],
    "spinner": "#0F5B8C"
  },
  "mascot": { "pack": "ozito" },
  "icons": { "streak": "🔥", "goal": "", "dashboard": "📊" },
  "copy": { "audience": "estudiante" },
  "map": { "backgrounds": [null, null, "https://…/mapa3.png", null, null] }
}
```

Todos los campos son opcionales salvo `institution`.

## Qué significa cada bloque

| Bloque | Qué cambia |
| --- | --- |
| `meta` | Título de la pestaña y la tarjeta al compartir el enlace |
| `brand` | Texto de cabecera, logo, icono de la barra superior |
| `colors` | `accent` (cabeceras, chips), `button`, `spinner`, y un color por módulo |
| `mascot` | Qué pack usar; `name`/`kind`/`emoji` sobrescriben lo que diga el pack |
| `icons` | Racha, meta diaria y panel. Emoji o URL de imagen. `goal` vacío conserva el anillo de progreso |
| `copy` | `audience` es cómo el curso se dirige al alumno: «ingenier@», «ruter@» |
| `map` | Fondos del mapa, uno por módulo. `null` deja el de fábrica |
| `features` | Apagar el test de ubicación, el compartir o el panel |

## Sobre `copy.audience` y la mascota

El texto del curso no menciona a la mascota por su nombre: trae marcadores
`{{mascot}}`, `{{mascotKind}}`, `{{mascotEmoji}}` y `{{audience}}`, que se
sustituyen al cargar. Así el mismo contenido sirve para un demo con Ozzy y otro
con Boti, y para un colegio de ingenieros o una universidad.

`mascot.name` sale del pack si no se indica: `ozito` → «Ozzy», `boti` → «Boti».

## Más adelante

Cuando exista el panel de gestión, los demos vivirán en la tabla `demos` de
Supabase y estos archivos serán la semilla. `getDemoConfig()` es el único sitio
que habrá que tocar: el resto del código pasa siempre por ahí.
