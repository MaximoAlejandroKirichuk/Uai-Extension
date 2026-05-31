# Reference: State Rules

## Default Order
1. estado derivado
2. estado local de componente
3. estado de hooks locales (ej: `useForm`)
4. Redux solo si es compartido o session-critical

## Rules
- No duplicar props en estado local.
- No agregar Redux para comportamiento puramente local.
- Mantener estados async explicitos (loading, error, success).
- Usar hooks tipados (`useAppDispatch`, `useAppSelector`).
