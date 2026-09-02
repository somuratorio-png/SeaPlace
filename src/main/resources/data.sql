INSERT IGNORE INTO rol (nombre_rol) VALUES ('comprador');
INSERT IGNORE INTO rol (nombre_rol) VALUES ('administrador');

INSERT IGNORE INTO permiso (nombre_permiso, descripcion) VALUES ('GESTIONAR_ROLES', 'Crear roles y permisos, y asignar permisos a un rol');
INSERT IGNORE INTO permiso (nombre_permiso, descripcion) VALUES ('GESTIONAR_REFUGIOS', 'Dar de alta un refugio nuevo');
INSERT IGNORE INTO permiso (nombre_permiso, descripcion) VALUES ('GESTIONAR_USUARIOS', 'Cambiar el rol de un usuario');

-- El rol administrador arranca con los tres permisos de gestion; un rol nuevo podria
-- tener solo alguno de ellos sin volverse administrador completo.
INSERT IGNORE INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON p.nombre_permiso IN ('GESTIONAR_ROLES', 'GESTIONAR_REFUGIOS', 'GESTIONAR_USUARIOS')
WHERE r.nombre_rol = 'administrador';