# DPF-RP Phase 0 — Diagnóstico técnico

Fecha: 2026-07-24. Repositorio evaluado:
the local project working tree (absolute user path intentionally omitted).

## Arquitectura encontrada

Aplicación estática React 19 + TypeScript + Vite, `HashRouter`, Context +
`useReducer`, CSS plano y persistencia `localStorage`. El dominio está en
`src/domain`, el instrumento y taxonomías en `src/framework`, la persistencia
en `src/storage`, la importación en `src/import`, las estadísticas en
`src/statistics` y las pantallas en `src/modes`.

La aplicación ya implementa el instrumento estructurado v1.1, observaciones
F1–F6, `taxonomyItemRatings`, importación multiformato, merge con procedencia,
κ, auditoría, asignaciones y gestión local. Estas funciones deben conservarse.

## Situación del modelo

- Versiones actuales ambiguas: aplicación `0.1.0`, envelope `1.0.0`,
  instrumento `1.1.0`.
- Estados actuales:
  `not_started`, `in_progress`, `in_review`, `completed`, `abandoned`,
  `submitted`, `returned_for_revision`, `resubmitted`, `locked`,
  `included_in_analysis`, `excluded_from_analysis`.
- Institución: texto libre en metadatos.
- Persistencia: claves `dpft:<kind>:<id>` con índices por colección.
- No existen aún Institution, Supporting Documents, DocumentLink, Issues,
  IssueHistory ni Scientific Dashboard.
- Existe un ConsensusRecord operativo; la nueva instrucción lo limita a
  modelo futuro, por lo que no se ampliará y quedará fuera de los nuevos
  flujos Phase 0.

## Cambios necesarios

1. Separar Core 1.1, Platform 1.2.0 y Schema 1.1.
2. Añadir estados normalizados mediante una vista/adaptador compatible, sin
   reescribir estados históricos silenciosamente.
3. Añadir Institution, documentos, vínculos, snapshots, Issues e historial en
   colecciones independientes.
4. Proteger el snapshot científico desde el inicio de sesión.
5. Incorporar ORG-01 e INC-01 como `research-extension`, separados de E1–E5.
6. Añadir dashboard exclusivamente descriptivo y filtrable.
7. Extender importación/exportación conservando campos desconocidos seguros.

## Riesgos

- Las sesiones existentes no contienen todos los metadatos nuevos.
- Los estados de gobernanza actuales son más detallados que los siete estados
  científicos solicitados.
- Una migración in-place podría alterar evidencia histórica.
- ORG-01 e INC-01 llegan inicialmente como evaluaciones sin definición
  completa de escenario.

## Plan de migración

La migración será conservadora, idempotente y basada en copias. Cada resultado
retendrá el objeto original, versión de origen/destino, fecha y advertencias.
Solo `not_started` se transforma en `draft`; `abandoned` nunca se convierte en
`excluded`. No se asignan `locked` o `excluded` sin evidencia explícita. La
simulación no escribe en `localStorage`. No se aplicará una migración
destructiva sobre datos reales sin confirmación posterior.

## Plan de implementación

Fase 0A: contratos, repositorio, estados, instituciones, inmutabilidad y
migración simulada. Fase 0B: dashboard. Fase 0C: documentos. Fase 0D: Issues.
Después: intercambio, documentación, pruebas, accesibilidad y build.
