# Selector de ejércitos de Heroscape

Web estática para GitHub Pages, pensada para móvil. Los datos compartidos viven en una hoja de Google.

## Archivos
- `index.html`, `style.css`, `app.js`: la aplicación.
- `config.js`: URL de la hoja (`sheetsUrl`), mapas, colores e iconos de facción.
- `data/unit_data.csv`: datos de las unidades (ahora 14 de ejemplo; sustitúyelo por el tuyo).
- `images/<ID>.jpg`: imagen de cada unidad (p. ej. `images/7.jpg`). `images/factions/`: iconos opcionales (ruta en `icon` de `config.js`).
- `maps/`: imágenes del mapa (lista en `maps` de `config.js`). Al tocar un mapa se abre a tamaño completo para hacer zoom.
- `apps-script/Code.gs`: código del servidor (se pega en Google, no se publica en GitHub).

## Columnas de unit_data.csv
`ID, number, Name, Faction, Cost, Species, Rarity, Unit Type, Class, Personality, Size, Height, Life, Move, Range, Attack, Defense, Powers`. Las columnas extra se ignoran. Los nombres de `Faction` deben coincidir con los de `config.js`.

## Configurar la hoja de Google (una vez)
1. Crea una hoja con dos pestañas:
   - `Players` con la fila 1 `name | password | budget` y un jugador por fila.
   - `Armies` con la fila 1 `player | ids | cost | at` y nada más.
2. En Extensiones > Apps Script, pega `apps-script/Code.gs` y guarda.
3. Implementar > Nueva implementación > Aplicación web. Ejecutar como: Yo. Quién tiene acceso: Cualquier usuario. Autoriza los permisos que pida Google.
4. Copia la URL que termina en `/exec` en `sheetsUrl` de `config.js`.

## Cambiar de partida
- Jugadores, contraseñas y presupuestos: edita la pestaña `Players`. No hay que tocar el código.
- Reiniciar: borra las filas de `Armies` (todas, o solo la de un jugador para que rehaga su ejército).
- Si cambias el código de `Code.gs`, crea una nueva implementación (o edita la existente) para que se aplique.

## Publicar en GitHub Pages
Sube todo menos `apps-script/` a un repositorio. En Settings > Pages elige la rama `main` y la carpeta raíz.

## Modo demo
Sin `sheetsUrl` la web funciona solo en tu navegador, con los jugadores de `demoPlayers` en `config.js`.

## Regla de coste de los Generales
Una unidad con `Class` = `General` cuesta 0 mientras todas las unidades del ejército sean de su misma `Faction`. Si se añade una unidad de otra facción, su coste vuelve al valor del CSV. La tarjeta muestra el coste vigente y, tachado, el original.

## Límites
- Las contraseñas están en la hoja y las valida el script, no viajan en el código de la web. Aun así, es un control pensado para amigos.
- Los costes los envía el navegador; el servidor comprueba presupuesto y duplicados, pero no verifica los costes contra el CSV.
- Cada llamada a Google tarda 1 o 2 segundos y los ejércitos de otros se actualizan cada 30 segundos o al cambiar de pestaña, no en tiempo real.
