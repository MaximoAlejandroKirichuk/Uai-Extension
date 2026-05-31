# Reference: Routing and Auth Rules

## Current Routing Shape
- `BrowserRouter` esta configurado en `src/main.tsx`.
- `App.tsx` decide entre `Home` y `Login` segun `state.user`.

## Rules
- Verificar el flujo actual antes de introducir rutas declarativas.
- Si se cambia auth o redirects, validar reglas con el responsable UAI.
- Mantener redirects y estados de auth explicitos.
