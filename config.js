// ===== CONFIGURACIÓN (edita aquí) =====
window.CONFIG = {
  // URL de la aplicación web de Apps Script (termina en /exec). Los jugadores, contraseñas y presupuestos
  // se configuran en la hoja de Google (pestaña Players), no aquí.
  // Vacío = modo demo: todo se guarda solo en este navegador, con los jugadores de demoPlayers.
  sheetsUrl: 'https://script.google.com/macros/s/AKfycbwxjn61ZS6sb0ilpDBpk9DxduucS7OiUwzaNjxqX-gI0s5mjNO2Rt1Gdqn2ePuEVqeEcw/exec',
  demoPlayers: [
    { name: 'Jugador 1', budget: 1000 },
    { name: 'Jugador 2', budget: 1000 },
  ],
  // Imágenes del mapa (súbelas a /maps)
  maps: ['maps/map1.jpg', 'maps/map2.jpg'],
  // Texto sobre el mapa. Formato: "Título\n\nTexto\n\nOtro título\n\nOtro texto" (vacío = sin recuadro)
  mapText: 'Reglas del mapa\n\nEscribe aquí las reglas o notas de la partida.',
  // Por facción: c = 2 colores del fondo diagonal, icon = emblema (emoji o ruta a imagen),
  // frame = marco decorativo del botón (imagen con el interior transparente; opcional).
  factions: {
    Utgar:   { c: ['#8b1a2b', '#2b1d17'], icon: 'images/factions/utgar.webp',    frame: 'images/factions/utgar-frame.webp' },
    Ullar:   { c: ['#0d5c3a', '#a8683a'], icon: 'images/factions/ullar.webp',    frame: 'images/factions/ullar-frame.webp' },
    Einar:   { c: ['#4b1c5f', '#c27a2e'], icon: 'images/factions/einar.webp',    frame: 'images/factions/einar-frame.webp' },
    Vydar:   { c: ['#5f89a3', '#3a3a3a'], icon: 'images/factions/vydar.webp',    frame: 'images/factions/vydar-frame.webp' },
    Jandar:  { c: ['#2f6fb3', '#d9dde0'], icon: 'images/factions/jandar.webp',   frame: 'images/factions/jandar-frame.webp' },
    Valkrill:{ c: ['#8f7d34', '#2e1f17'], icon: 'images/factions/valkrill.webp', frame: 'images/factions/valkrill-frame.webp' },
    Aquilla: { c: ['#121a3a', '#d3ad2f'], icon: 'images/factions/aquilla.webp',  frame: 'images/factions/aquilla-frame.webp' },
  },
};