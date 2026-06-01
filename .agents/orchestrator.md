# AI Agent Orchestrator

## Purpose
Este archivo es el router para trabajo asistido por IA en Uai-Extension. Coordina sub-agentes especializados con Context Lazy Loading: cargar solo el skill que coincida con el trigger del pedido, y luego solo las referencias relevantes.

## Project Context
Uai-Extension es un frontend institucional UAI construido con React 19, TypeScript, Vite, Redux Toolkit, React Router v7 y Firebase (Auth, Firestore, Realtime Database). Usa Tailwind CSS (via `@tailwindcss/vite`) y estilos globales en `src/index.css`.

## Global Anti-Hallucination Rules
- `api.md` es la fuente primaria para contratos de API, reglas de auth, enums y comportamiento backend visible si existe.
- No inventar endpoints, payloads, campos de respuesta, query params, enums, reglas de auth, roles, permisos, estados o colecciones Firebase.
- Verificar comportamiento backend en `api.md` y en los archivos fuente antes de proponer o implementar cambios.
- Si codigo y documentacion no coinciden, reportar el drift y revisar la implementacion antes de decidir.
- Preguntar antes de crear reglas de negocio que no se puedan derivar del repo.
- Cargar el minimo contexto util: un skill principal, referencias necesarias y archivos afectados.
- Mantener codigo, comentarios, documentacion y commits en ingles salvo que el usuario pida espanol.
- Respetar la estructura actual: UI en `src/presentation/`, entidades en `src/core/entities/`, estado global en `src/store/`, hooks en `src/hooks/`, integraciones en `src/firebase/`.
- No agregar Redux si el estado es local o derivado.
- Si cambia comportamiento externo, actualizar documentacion relacionada cuando exista.
- Git: no usar prefijo `codex/` y no cambiar ramas sin pedido explicito.
- La rama base por defecto es `main` salvo indicacion explicita.

## Lazy Loading Router
1. Leer este archivo primero.
2. Identificar el trigger del pedido.
3. Cargar exactamente un skill principal desde `.agents/skills/` salvo que el pedido abarque varias areas.
4. Cargar skills adicionales solo si su trigger aplica directamente.
5. Cargar referencias desde `.agents/references/` solo cuando sean necesarias para decidir o implementar.
6. Leer archivos fuente afectados antes de proponer o implementar cambios.
7. Mantener contexto activo acotado: objetivo, archivos, reglas, supuestos y preguntas abiertas.

## Skill Index
- `01-requirements`: `.agents/skills/01-requirements.md`
- `02-frontend-architecture`: `.agents/skills/02-frontend-architecture.md`
- `03-react-implementation`: `.agents/skills/03-react-implementation.md`
- `04-ui-design`: `.agents/skills/04-ui-design.md`
- `05-testing-and-verification`: `.agents/skills/05-testing-and-verification.md`
- `06-branching-workflow`: `.agents/skills/06-branching-workflow.md`
- `07-commits`: `.agents/skills/07-commits.md`

## Reference Index
- `api-contracts`: `.agents/references/api-contracts.md`
- `repo-map`: `.agents/references/repo-map.md`
- `state-rules`: `.agents/references/state-rules.md`
- `forms-rules`: `.agents/references/forms-rules.md`
- `routing-auth-rules`: `.agents/references/routing-auth-rules.md`
- `uai-frontend-questions`: `.agents/references/uai-frontend-questions.md`

## Trigger Routing
- Usar `01-requirements` para requerimientos vagos, nuevas features, alcance incompleto, criterios de aceptacion ambiguos o dudas de flujo.
- Usar `02-frontend-architecture` para decidir ubicacion de codigo y estructura de cambios.
- Usar `03-react-implementation` para componentes, hooks, flujos async, formularios e integraciones.
- Usar `04-ui-design` para mejoras visuales, layout, tipografia y estilos distintivos.
- Usar `05-testing-and-verification` para validacion de cambios, comandos de verificacion y checklist manual.
- Usar `06-branching-workflow` para ramas, naming y flujo de merge.
- Usar `07-commits` para preparar commits, mensajes o dividir cambios.

## Default Multi-Skill Flows
- Nueva feature: `01-requirements` -> `02-frontend-architecture` -> `03-react-implementation` -> `04-ui-design` si aplica -> `05-testing-and-verification`.
- Flujo de formulario: `01-requirements` -> `03-react-implementation` -> `05-testing-and-verification`.
- Integracion backend/Firebase: `01-requirements` -> `02-frontend-architecture` -> `03-react-implementation` -> `05-testing-and-verification`.
- Rediseno visual: `04-ui-design` -> `03-react-implementation` -> `05-testing-and-verification`.
- Bug fix: iniciar en el skill del area rota y luego `05-testing-and-verification`.
- Preparar rama: `06-branching-workflow` -> skill especifico.
- Preparar commits: revisar diff -> `07-commits` -> `05-testing-and-verification` si la verificacion no es clara.

## Output Discipline
- Declarar que skills fueron cargados y por que.
- Declarar que referencias fueron cargadas y por que.
- Indicar si se consulto `api.md` (si existe) para comportamiento backend.
- Entregar hallazgos concretos, supuestos explicitos y preguntas abiertas.
- Mantener cambios acotados a los skills y referencias activados.
