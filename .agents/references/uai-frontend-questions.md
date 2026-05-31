# UAI Frontend Questions (Para Responsable UAI)

## Contexto y Objetivos
- Cual es el objetivo principal del frontend?
- Cuales son los flujos criticos que deben estar si o si?

## Usuarios y Roles
- Que roles existen (admin, docente, alumno, etc)?
- Que permisos tiene cada rol?
- Hay usuarios con multiples roles?

## Autenticacion y Seguridad
- Proveedor de auth (Firebase, SSO UAI, otro)?
- Reglas de session, expiracion y refresh de token?
- Reglas de acceso por rol o por unidad academica?

## Datos y Contratos
- Existe documento `api.md` o especificacion de endpoints/colecciones?
- Para cada entidad: campos obligatorios, opcionales y reglas de validacion?
- Estados posibles y transiciones (ej: aprobado, pendiente, rechazado)?

## Reglas de Negocio
- Reglas clave que impactan UI (visibilidad, validacion, restricciones)?
- Dependencias entre entidades (relaciones y jerarquia)?

## Flujos y Pantallas
- Lista de pantallas obligatorias y orden del flujo principal.
- Casos de error y estados vacios esperados.
- Reglas para carga inicial y refresco de datos.

## UX y Diseno
- Lineamientos de marca (colores, tipografia, logos)?
- Reglas de accesibilidad requeridas?
- Soporte mobile requerido? (breakpoints)

## Operaciones
- Ambientes y variables necesarias (`.env`)?
- Reglas de despliegue y versionado?
- Requisitos de logging y monitoreo?

## Aceptacion
- Criterios de aceptacion por feature.
- Escenarios de validacion manual esperados.
