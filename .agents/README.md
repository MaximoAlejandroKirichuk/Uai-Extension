# AI Agent Workspace (Uai-Extension)

Esta carpeta contiene el enrutador de agentes y referencias livianas para trabajo asistido por IA.

Inicio recomendado:
- Leer `.agents/orchestrator.md`.

Objetivos:
- carga minima de contexto
- reglas anti-alucinacion claras
- ownership explicito entre skills

Politica de carga:
1. Leer `.agents/orchestrator.md` primero.
2. Cargar un solo skill primario desde `.agents/skills/`.
3. Cargar solo referencias necesarias desde `.agents/references/`.
4. Leer archivos fuente afectados antes de proponer o implementar cambios.

Contrato backend canonico:
- `api.md` (si existe)
