// ===== CONFIGURACIÓN (edita aquí) =====
window.CONFIG = {
  // URL de la aplicación web de Apps Script (termina en /exec). Los jugadores, contraseñas y presupuestos
  // se configuran en la hoja de Google (pestaña Players), no aquí.
  // Vacío = modo demo: todo se guarda solo en este navegador, con los jugadores de demoPlayers.
  sheetsUrl: '',
  demoPlayers: [
    { name: 'Jugador 1', password: '1111', budget: 1000 },
    { name: 'Jugador 2', password: '2222', budget: 1000 },
  ],
  // Imágenes del mapa (súbelas a /maps)
  maps: ['maps/map1.jpg'],
  // Colores (2 por facción) e icono (emoji, o ruta a imagen: 'images/factions/utgar.png')
  factions: {
    Utgar:   { c: ['#8b1a2b', '#2b1d17'], icon: '🔥' },
    Ullar:   { c: ['#0d5c3a', '#a8683a'], icon: '🌲' },
    Einar:   { c: ['#4b1c5f', '#c27a2e'], icon: '🏺' },
    Vydar:   { c: ['#5f89a3', '#4a4a4a'], icon: '❄️' },
    Jandar:  { c: ['#2f6fb3', '#d9dde0'], icon: '⚔️' },
    Valkrill:{ c: ['#8f7d34', '#b0703a'], icon: '💀' },
    Aquilla: { c: ['#121a3a', '#d3ad2f'], icon: '🦅' },
  },
};
