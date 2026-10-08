# SeaPlace 🐬

Backend en Spring Boot para una plataforma de **apadrinamiento de animales marinos**. Múltiples refugios/ONGs publican animales disponibles, los usuarios los apadrinan, y lo recaudado se destina a la conservación de las especies.

Trabajo Práctico Obligatorio (TPO) — 2do cuatrimestre 2026.

## Stack

- **Java 21**
- Spring Boot 4.1.0
- Spring Security + JWT (`jjwt` 0.12.6)
- Spring Data JPA / Hibernate
- MySQL
- Lombok
- Maven

## Requisitos previos

- **JDK 21** instalado (`java -version`). Si tenés otra versión, o bien la instalás, o modificás `<java.version>` en el `pom.xml` — pero al bajar de 21 podrían romperse features del código.
- MySQL corriendo localmente (o accesible por red).
- Maven (o usar el wrapper `./mvnw` si está incluido).

## Configuración

La conexión a la base y el secreto JWT están en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/seaplace?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=*****

spring.jpa.hibernate.ddl-auto=update
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
```

- La base `seaplace` se crea sola si no existe (`createDatabaseIfNotExist=true`).
- `defer-datasource-initialization=true` + `sql.init.mode=always` son necesarios para que `data.sql` corra **después** de que Hibernate genere el schema (si no, falla porque las tablas todavía no existen).
- **Contraseña de MySQL:** cada integrante tiene la suya, así que no va en `application.properties`. Copiá `application-local.properties.example` como `application-local.properties` (en la raíz, al lado del `pom.xml`) y poné ahí tu contraseña. Ese archivo está en `.gitignore` y pisa lo que diga `application.properties`.
- ⚠️ El `application.properties` actual tiene usuario/password y el secret de JWT hardcodeados en texto plano. Para una entrega en repo público conviene moverlos a variables de entorno.

## Cómo levantar el proyecto

```bash
# con el wrapper de maven
./mvnw spring-boot:run

# o con maven instalado
mvn spring-boot:run
```

La app levanta por defecto en `http://localhost:8080`.

Al arrancar, `data.sql` siembra los roles base (`padrino`, `administrador` y `duenioRefugio`), los permisos y un juego de **datos de demo**: 4 categorías, 3 refugios, 10 animales con sus fotos, una oferta, apadrinamientos con sus pagos, novedades y ubicaciones. Cada insert se fija antes si el dato ya está, así que correrlo en cada arranque no duplica ni pisa nada.

Usuarios de demo (las contraseñas están guardadas con BCrypt):

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin1234` | administrador |
| `marina`, `tomas` | `foquita123`, `nutria123` | padrino |
| `ensenada`, `pacifico` | `refugio123` | duenioRefugio (refugios aprobados) |
| `costabrava` | `refugio123` | duenioRefugio (refugio pendiente de aprobación) |

## Frontend (React + Vite)

El front está en `frontend-react/` y consume esta API:

```bash
cd frontend-react
npm install
npm run dev      # http://localhost:5173
```

- No se usa CORS: el navegador le pide todo a `localhost:5173` y el **proxy de Vite** (`vite.config.js`) reenvía lo que empieza con `/api` a `http://localhost:8080`, sin el prefijo. El backend tiene que estar levantado.
- Todos los pedidos pasan por `src/services/api.js` (agrega el token JWT y convierte los errores del backend en mensajes); el resto de `src/services/` tiene una función por endpoint.
- Las fotos de los animales de demo las sirve el front (`frontend-react/public/img/animales`); las que sube un refugio se guardan en la base y las sirve la API.

## Modelo de dominio

Entidades: `Usuario`, `Rol`, `Permiso`, `Refugio`, `Categoria`, `Animal`, `Foto_Animal`, `Archivo_Foto`, `Ubicacion_Animal`, `Descuento`, `Novedad`, `Favorito`, `Muelle`, `Muelle_Detalle`, `Zarpar`, `Zarpar_Detalle` y `Apadrinamiento` (`Rol_Permiso` está modelado como relación `@ManyToMany`, no como entidad aparte).

- **Planes.** Hay tres niveles de apadrinamiento fijos (enum `Plan`): `BRISA_MARINA` (×0,5), `GUARDIAN_DE_LA_BAHIA` (×1, el que se usa si el pedido no indica plan) y `MAREA_PROFUNDA` (×2). El precio de un cupo es la cuota del animal, con su descuento vigente, por el multiplicador del plan. El plan se elige al agregar al muelle.
- **Apadrinamiento.** Un zarpar es un pago; lo que queda después es el apadrinamiento (padrino, animal, plan, cupos, desde cuándo). Se crea al confirmar el zarpar (o suma cupos si el padrino ya apadrinaba a ese animal), se le puede cambiar el plan y se puede cancelar: no se borra, queda inactivo y devuelve sus cupos al animal.
- **Botiquín.** El zarpar acepta `conBotiquin`: suma un adicional fijo de 5 al total.
- **Ficha del animal.** Además de nombre, cuota y cupos, un animal tiene `especie`, `edad`, `ubicacion`, `urgencia` (`CRITICO`, `RECUPERACION` o `LISTO`), `condicion` y `destacado` (lo cambia solo un administrador). La respuesta incluye sus fotos ordenadas, el descuento que rige hoy y `progreso` (porcentaje de cupos tomados).
- **Aprobación de refugios.** Un refugio que se registra solo queda pendiente (`aprobado = false`) y no puede publicar hasta que un administrador lo aprueba. Los que da de alta un administrador nacen aprobados.

Regla clave: cada `Animal` tiene una cantidad limitada de padrinos — se modela con `cuposTotales` y `cuposDisponibles` (Integer), no con un booleano de disponibilidad única. Al agregar al muelle se valida que la cantidad no supere los cupos disponibles, pero no se reservan; se descuentan recién al confirmar el zarpar, donde se vuelve a validar.

## Autenticación y roles

- Login vía JWT. Endpoints públicos: `POST /auth/register`, `POST /auth/register-refugio`, `POST /auth/authenticate`, `POST /auth/olvide-contrasenia` y `POST /auth/restablecer-contrasenia`.
- Hay tres roles: `padrino` (apadrina animales), `duenioRefugio` (administra su refugio y publica animales, pero no puede apadrinar) y `administrador`.
- `/auth/register` crea un usuario con rol `padrino`. `/auth/register-refugio` crea, en un solo paso, un usuario con rol `duenioRefugio` junto con su refugio, que queda pendiente de aprobación (si algo falla, no se guarda nada).
- `data.sql` crea un administrador de demo (`admin`). Un administrador puede cambiar el rol de cualquier usuario con `PUT /usuarios/{usuarioId}/rol` (el sistema no deja al último administrador sin su rol). Si le da el rol `duenioRefugio` a alguien que no tiene refugio, se le crea uno ya aprobado.
- Las autoridades de Spring Security se arman como `ROLE_<NOMBRE_ROL_EN_MAYUSCULAS>` a partir del rol del usuario.

### Baja de usuarios

- `DELETE /usuarios/{usuarioId}` no borra nada: deja la cuenta inactiva. Lo puede hacer el propio usuario o un administrador, y no se puede dar de baja a un administrador.
- Una cuenta inactiva no puede iniciar sesión y su token deja de servir. Si era dueño de un refugio, sus animales activos pasan a `PAUSADA` y el refugio deja de listarse (solo lo ve un administrador).
- Durante 30 días, volver a iniciar sesión con la contraseña correcta reactiva la cuenta (los animales pausados se republican a mano). En ese mismo plazo también la puede reactivar un administrador con `PUT /usuarios/{usuarioId}/reactivar`.
- Pasados los 30 días la cuenta ya no se recupera: cuando alguien se registra con ese mail o nombre de usuario, a la cuenta vieja se le cambian por `eliminado-<id>` y quedan libres. Las filas no se borran, así se conserva el historial.

### Perfil y recuperación de contraseña

- `GET /usuarios/me` devuelve los datos del usuario logueado (sin la contraseña) y `PUT /usuarios/me` modifica su nombre, apellido y mail. El nombre de usuario no se puede cambiar (es el que lleva el token), y el rol y el estado de la cuenta tampoco: eso lo hace un administrador o la baja.
- `PUT /usuarios/me/contrasenia` cambia la contraseña del usuario logueado: hay que mandar la actual y la nueva (distinta de la actual y con el mínimo de caracteres).
- Si el usuario olvidó su contraseña: `POST /auth/olvide-contrasenia` con su mail genera un código de un solo uso que vence a los 5 minutos, y `POST /auth/restablecer-contrasenia` con el mail, el código y la contraseña nueva la cambia.
- El código se guarda encriptado. La respuesta de `olvide-contrasenia` es siempre la misma exista o no el mail, y los errores de `restablecer-contrasenia` usan un solo mensaje, para no revelar qué mails están registrados.
- El proyecto no envía mails reales: el "mail" con el código se imprime en la consola del servidor.

### Reglas de autorización

| Recurso | Método | Acceso |
|---|---|---|
| `/auth/**` | POST | Público |
| `/animales/**`, `/refugios/**`, `/categorias/**`, `/planes` | GET | Público (de los animales, solo las publicaciones activas; el dueño del refugio ve además sus pausadas y el administrador ve todas. De los refugios, solo los aprobados y activos) |
| `/animales/**` | POST / PUT / DELETE | Autenticado: el administrador o el dueño del refugio del animal (incluye fotos, ubicaciones, descuentos y novedades). Un refugio sin aprobar no puede publicar |
| `/refugios/**` | POST / PUT | `GESTIONAR_REFUGIOS` (administrador) |
| `/apadrinamientos` | GET | Autenticado: el administrador ve todos, el dueño de un refugio los de sus animales y un padrino los suyos |
| `/apadrinamientos/{id}/plan`, `/apadrinamientos/{id}` | PUT / DELETE | El padrino dueño del apadrinamiento (o un administrador) |
| `/favoritos/**` | Todos | Autenticado; cada usuario solo ve y modifica los suyos |
| `/usuarios/{usuarioId}/reactivar` | PUT | `GESTIONAR_USUARIOS` (administrador) |
| `/categorias/**` | POST | Administrador |
| `/permisos/**`, `/roles/**` | Todos | `GESTIONAR_ROLES` (administrador) |
| `/usuarios/**` | GET | `GESTIONAR_USUARIOS` (administrador) |
| `/usuarios` | POST | Administrador |
| `/usuarios/{usuarioId}/rol` | PUT | `GESTIONAR_USUARIOS` (administrador) |
| `/usuarios/{usuarioId}` | DELETE | El propio usuario o un administrador (no se puede dar de baja a un administrador) |
| `/usuarios/me` | GET | Autenticado: devuelve los datos del propio usuario |
| `/usuarios/me` | PUT | Autenticado: modifica nombre, apellido y mail del propio usuario (no el nombre de usuario, el rol ni el estado de la cuenta) |
| `/usuarios/me/contrasenia` | PUT | Autenticado: cambia la contraseña del propio usuario (requiere la actual) |
| `/muelles/**`, `/zarpar/**` | Todos | Autenticado; cada usuario solo accede a lo suyo y los usuarios con rol `duenioRefugio` no pueden usarlos |
| Cualquier otro endpoint | — | Requiere estar autenticado |

## Endpoints principales

| Recurso | Base path | Notas |
|---|---|---|
| Auth | `/auth` | `register`, `register-refugio`, `authenticate`, `olvide-contrasenia`, `restablecer-contrasenia` |
| Animales | `/animales` | CRUD, GET público |
| Refugios | `/refugios` | GET público, POST admin, `PUT /{refugioId}/aprobar` (admin) |
| Categorías | `/categorias` | GET público, POST admin |
| Planes | `/planes` | GET público: los tres niveles de apadrinamiento |
| Fotos de animal | `/animales/{animalId}/fotos` | por url (`POST`) o subiendo el archivo (`POST /archivo`, multipart, campo `archivo`, imagen de hasta 2 MB); `GET /{fotoId}/archivo` devuelve la imagen subida |
| Ubicaciones de animal | `/animales/{animalId}/ubicaciones` | incluye `/ultima` |
| Descuentos | `/animales/{animalId}/descuentos` | `DELETE /{descuentoId}` quita la oferta (queda inactiva) |
| Novedades | `/animales/{animalId}/novedades` | la bitácora del animal: GET público, POST su refugio |
| Muelle | `/muelles` | agregar/editar/quitar items; cada item lleva su `plan` |
| Zarpar | `/zarpar` | genera el zarpar a partir del muelle (acepta `conBotiquin`) y crea los apadrinamientos |
| Apadrinamientos | `/apadrinamientos` | listar (con sus pagos), cambiar de plan (`PUT /{id}/plan`), cancelar (`DELETE /{id}`) |
| Favoritos | `/favoritos` | listar, guardar (`PUT /{animalId}`) y quitar (`DELETE /{animalId}`) los del usuario logueado |
| Usuarios | `/usuarios` | alta (admin), baja (`DELETE`), reactivar (admin), cambio de rol (admin), ver y modificar el propio perfil (`GET` y `PUT /usuarios/me`), cambiar la propia contraseña (`PUT /usuarios/me/contrasenia`) |
| Roles | `/roles` | solo admin |
| Permisos | `/permisos` | solo admin |

## Manejo de errores

Tres excepciones tipadas centralizadas en `GlobalExceptionHandler` (`@RestControllerAdvice`):

- `RecursoNoEncontradoException` → 404
- `RecursoDuplicadoException` → 409
- `ReglaDeNegocioException` → 400