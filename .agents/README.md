# AI Agent Workspace (Uai-Extension)

Esta carpeta contiene el enrutador de agentes y referencias livianas para trabajo asistido por IA.

Inicio recomendado:
- Leer `AGENTS.md` en la raiz del repo.
- Luego leer `.agents/orchestrator.md`.

Objetivos:
- carga minima de contexto
- reglas anti-alucinacion claras
- ownership explicito entre skills

Politica de carga:
1. Leer `AGENTS.md` si existe.
2. Leer `.agents/orchestrator.md`.
3. Cargar un solo skill primario desde `.agents/skills/`.
4. Cargar solo referencias necesarias desde `.agents/references/`.
5. Leer archivos fuente afectados antes de proponer o implementar cambios.

Contrato backend canonico:
- `api.md` (si existe)
