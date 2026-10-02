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
- Ajustá usuario/contraseña de MySQL según tu entorno local antes de correr el proyecto.
- ⚠️ El `application.properties` actual tiene usuario/password y el secret de JWT hardcodeados en texto plano. Para una entrega en repo público conviene moverlos a variables de entorno.

## Cómo levantar el proyecto

```bash
# con el wrapper de maven
./mvnw spring-boot:run

# o con maven instalado
mvn spring-boot:run
```

La app levanta por defecto en `http://localhost:8080`.

Al arrancar, `data.sql` siembra los roles base:

```sql
INSERT IGNORE INTO rol (nombre_rol) VALUES ('padrino');
INSERT IGNORE INTO rol (nombre_rol) VALUES ('administrador');
INSERT IGNORE INTO rol (nombre_rol) VALUES ('refugio');
```

## Modelo de dominio

14 entidades: `Usuario`, `Rol`, `Permiso`, `Refugio`, `Categoria`, `Animal`, `Foto_Animal`, `Ubicacion_Animal`, `Descuento`, `Muelle`, `Muelle_Detalle`, `Zarpar`, `Zarpar_Detalle` (`Rol_Permiso` está modelado como relación `@ManyToMany`, no como entidad aparte).

Regla clave: cada `Animal` tiene una cantidad limitada de padrinos — se modela con `cuposTotales` y `cuposDisponibles` (Integer), no con un booleano de disponibilidad única. Al agregar al muelle se valida que la cantidad no supere los cupos disponibles, pero no se reservan; se descuentan recién al confirmar el zarpar, donde se vuelve a validar.

## Autenticación y roles

- Login vía JWT. Endpoints públicos: `POST /auth/register`, `POST /auth/register-refugio` y `POST /auth/authenticate`.
- Hay tres roles: `padrino` (apadrina animales), `duenioRefugio` (administra su refugio y publica animales, pero no puede apadrinar) y `administrador`.
- `/auth/register` crea un usuario con rol `padrino`. `/auth/register-refugio` crea, en un solo paso, un usuario con rol `refugio` junto con su refugio (si algo falla, no se guarda nada).
- El primer `administrador` hay que asignarlo a mano en la base. A partir de ahí, un administrador puede cambiar el rol de cualquier usuario con `PUT /usuarios/{usuarioId}/rol` (el sistema no deja al último administrador sin su rol).
- Las autoridades de Spring Security se arman como `ROLE_<NOMBRE_ROL_EN_MAYUSCULAS>` a partir del rol del usuario.

### Baja de usuarios

- `DELETE /usuarios/{usuarioId}` no borra nada: deja la cuenta inactiva. Lo puede hacer el propio usuario o un administrador, y no se puede dar de baja a un administrador.
- Una cuenta inactiva no puede iniciar sesión y su token deja de servir. Si era dueño de un refugio, sus animales activos pasan a `PAUSADA` y el refugio deja de listarse (solo lo ve un administrador).
- Durante 30 días, volver a iniciar sesión con la contraseña correcta reactiva la cuenta (los animales pausados se republican a mano).
- Pasados los 30 días la cuenta ya no se recupera: cuando alguien se registra con ese mail o nombre de usuario, a la cuenta vieja se le cambian por `eliminado-<id>` y quedan libres. Las filas no se borran, así se conserva el historial.

### Reglas de autorización

| Recurso | Método | Acceso |
|---|---|---|
| `/auth/**` | POST | Público |
| `/animales/**`, `/refugios/**`, `/categorias/**` | GET | Público (de los animales, solo las publicaciones activas; el dueño del refugio ve además sus pausadas y el administrador ve todas) |
| `/animales/**` | POST / PUT / DELETE | Autenticado: el administrador o el dueño del refugio del animal (incluye fotos, ubicaciones y descuentos) |
| `/refugios/**` | POST | `GESTIONAR_REFUGIOS` (administrador) |
| `/categorias/**` | POST | Administrador |
| `/permisos/**`, `/roles/**` | Todos | `GESTIONAR_ROLES` (administrador) |
| `/usuarios/**` | GET | `GESTIONAR_USUARIOS` (administrador) |
| `/usuarios` | POST | Administrador |
| `/usuarios/{usuarioId}/rol` | PUT | `GESTIONAR_USUARIOS` (administrador) |
| `/usuarios/{usuarioId}` | DELETE | El propio usuario o un administrador (no se puede dar de baja a un administrador) |
| `/muelles/**`, `/zarpar/**` | Todos | Autenticado; cada usuario solo accede a lo suyo y los usuarios con rol `refugio` no pueden usarlos |
| Cualquier otro endpoint | — | Requiere estar autenticado |

## Endpoints principales

| Recurso | Base path | Notas |
|---|---|---|
| Auth | `/auth` | `register`, `register-refugio`, `authenticate` |
| Animales | `/animales` | CRUD, GET público |
| Refugios | `/refugios` | GET público, POST admin |
| Categorías | `/categorias` | GET público, POST admin |
| Fotos de animal | `/animales/{animalId}/fotos` | — |
| Ubicaciones de animal | `/animales/{animalId}/ubicaciones` | incluye `/ultima` |
| Descuentos | `/animales/{animalId}/descuentos` | — |
| Muelle | `/muelles` | agregar/editar/quitar items |
| Zarpar | `/zarpar` | genera el zarpar a partir del muelle |
| Usuarios | `/usuarios` | alta (admin), baja (`DELETE`), cambio de rol (admin) |
| Roles | `/roles` | solo admin |
| Permisos | `/permisos` | solo admin |

## Manejo de errores

Tres excepciones tipadas centralizadas en `GlobalExceptionHandler` (`@RestControllerAdvice`):

- `RecursoNoEncontradoException` → 404
- `RecursoDuplicadoException` → 409
- `ReglaDeNegocioException` → 400