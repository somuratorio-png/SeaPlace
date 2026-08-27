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
spring.datasource.password=****

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
INSERT IGNORE INTO rol (nombre_rol) VALUES ('comprador');
INSERT IGNORE INTO rol (nombre_rol) VALUES ('administrador');
```

## Modelo de dominio

14 entidades: `Usuario`, `Rol`, `Permiso`, `Refugio`, `Categoria`, `Animal`, `Foto_Animal`, `Ubicacion_Animal`, `Descuento`, `Carrito`, `Carrito_Detalle`, `Compra`, `Compra_Detalle` (`Rol_Permiso` está modelado como relación `@ManyToMany`, no como entidad aparte).

Regla clave: cada `Animal` es un individuo único, apadrinable **una sola vez** — se modela con un booleano `disponible`, no hay campos de stock/cupo.

## Autenticación y roles

- Login vía JWT. Endpoints públicos: `POST /auth/register` y `POST /auth/authenticate`.
- Todo usuario registrado por `/auth/register` recibe el rol `comprador` por defecto.
- Para tener un usuario `administrador` hoy en día hace falta actualizarlo manualmente en la base (no hay endpoint para cambiar de rol todavía).
- Las autoridades de Spring Security se arman como `ROLE_<NOMBRE_ROL_EN_MAYUSCULAS>` a partir del rol del usuario.

### Reglas de autorización

| Recurso | Método | Acceso |
|---|---|---|
| `/auth/**` | POST | Público |
| `/animales/**`, `/refugios/**`, `/categorias/**` | GET | Público |
| `/animales/**` | POST / PUT / DELETE | `ADMINISTRADOR` |
| `/refugios/**` | POST | `ADMINISTRADOR` |
| `/permisos/**`, `/roles/**` | Todos | `ADMINISTRADOR` |
| Cualquier otro endpoint | — | Requiere estar autenticado |

## Endpoints principales

| Recurso | Base path | Notas |
|---|---|---|
| Auth | `/auth` | `register`, `authenticate` |
| Animales | `/animales` | CRUD, GET público |
| Refugios | `/refugios` | GET público, POST admin |
| Categorías | `/categorias` | GET público, POST admin |
| Fotos de animal | `/animales/{animalId}/fotos` | — |
| Ubicaciones de animal | `/animales/{animalId}/ubicaciones` | incluye `/ultima` |
| Descuentos | `/animales/{animalId}/descuentos` | — |
| Carrito | `/carritos` | agregar/editar/quitar items |
| Compras | `/compras` | genera la compra a partir del carrito |
| Usuarios | `/usuarios` | — |
| Roles | `/roles` | solo admin |
| Permisos | `/permisos` | solo admin |

## Manejo de errores

Tres excepciones tipadas centralizadas en `GlobalExceptionHandler` (`@RestControllerAdvice`):

- `RecursoNoEncontradoException` → 404
- `RecursoDuplicadoException` → 409
- `ReglaDeNegocioException` → 400
