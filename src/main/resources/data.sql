INSERT IGNORE INTO rol (nombre_rol) VALUES ('padrino');
INSERT IGNORE INTO rol (nombre_rol) VALUES ('administrador');
INSERT IGNORE INTO rol (nombre_rol) VALUES ('duenioRefugio');

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

-- =====================================================================================
-- DATOS DE DEMO
-- Este archivo corre cada vez que arranca la app, asi que cada insert se fija antes si el
-- dato ya esta (INSERT IGNORE donde hay una clave unica, WHERE NOT EXISTS en el resto):
-- la primera vez carga todo y despues no duplica ni pisa lo que se haya cambiado.
-- =====================================================================================

-- Usuarios. Las contrasenias estan encriptadas con BCrypt, igual que las que guarda la app:
--   admin / admin1234 (administrador)      marina / foquita123 y tomas / nutria123 (padrinos)
--   ensenada, pacifico y costabrava / refugio123 (refugios; costabrava espera aprobacion)
INSERT IGNORE INTO usuario (id_rol, nombre, apellido, mail, nombre_usuario, contrasenia, fecha_registro, activo)
SELECT id_rol, 'Admin', 'SeaPlace', 'admin@seaplace.test', 'admin', '$2a$10$0jDJBuz3.2aMhrvb460btunbv5UieCKfFNpocU2jLdoEqDSjGcRyC', '2026-05-01 09:00:00', true
FROM rol WHERE nombre_rol = 'administrador';

INSERT IGNORE INTO usuario (id_rol, nombre, apellido, mail, nombre_usuario, contrasenia, fecha_registro, activo)
SELECT id_rol, 'Marina', 'Delgado', 'marina@seaplace.test', 'marina', '$2a$10$FX44OEg8QzGhj.U8BQdtTO11Ax8Wd2GyiHd4jdP6MuIEaBysi/OcG', '2026-06-01 09:00:00', true
FROM rol WHERE nombre_rol = 'padrino';

INSERT IGNORE INTO usuario (id_rol, nombre, apellido, mail, nombre_usuario, contrasenia, fecha_registro, activo)
SELECT id_rol, 'Tomás', 'Ibarra', 'tomas@seaplace.test', 'tomas', '$2a$10$Osz4H7v3dlQrxogYJOC4ROIWMtqVGBfztSoOmTbaIy92HSkGxV.7a', '2026-06-01 09:00:00', true
FROM rol WHERE nombre_rol = 'padrino';

INSERT IGNORE INTO usuario (id_rol, nombre, apellido, mail, nombre_usuario, contrasenia, fecha_registro, activo)
SELECT id_rol, 'Refugio', 'Ensenada Salina', 'ensenada@seaplace.test', 'ensenada', '$2a$10$ufpUITuHD23gRag3eZEy2.BYuNzkA9gpH0F19tbq4D5D93OIADkTq', '2026-05-10 09:00:00', true
FROM rol WHERE nombre_rol = 'duenioRefugio';

INSERT IGNORE INTO usuario (id_rol, nombre, apellido, mail, nombre_usuario, contrasenia, fecha_registro, activo)
SELECT id_rol, 'Refugio', 'Pacífico Abierto', 'pacifico@seaplace.test', 'pacifico', '$2a$10$ufpUITuHD23gRag3eZEy2.BYuNzkA9gpH0F19tbq4D5D93OIADkTq', '2026-05-10 09:00:00', true
FROM rol WHERE nombre_rol = 'duenioRefugio';

INSERT IGNORE INTO usuario (id_rol, nombre, apellido, mail, nombre_usuario, contrasenia, fecha_registro, activo)
SELECT id_rol, 'Refugio', 'Costa Brava', 'costabrava@seaplace.test', 'costabrava', '$2a$10$ufpUITuHD23gRag3eZEy2.BYuNzkA9gpH0F19tbq4D5D93OIADkTq', '2026-09-20 09:00:00', true
FROM rol WHERE nombre_rol = 'duenioRefugio';

-- Refugios (uno por cuenta de refugio). Costa Brava queda pendiente de aprobacion.
INSERT IGNORE INTO refugio (id_usuario, nombre_refugio, descripcion, aprobado)
SELECT id_usuario, 'Ensenada Salina', 'Centro de rescate y rehabilitación de focas y lobos marinos.', true
FROM usuario WHERE nombre_usuario = 'ensenada';

INSERT IGNORE INTO refugio (id_usuario, nombre_refugio, descripcion, aprobado)
SELECT id_usuario, 'Pacífico Abierto', 'Monitoreo satelital de nutrias, tortugas y cetáceos en mar abierto.', true
FROM usuario WHERE nombre_usuario = 'pacifico';

INSERT IGNORE INTO refugio (id_usuario, nombre_refugio, descripcion, aprobado)
SELECT id_usuario, 'Costa Brava', 'Refugio costero recién sumado a SeaPlace.', false
FROM usuario WHERE nombre_usuario = 'costabrava';

-- Categorias
INSERT INTO categoria (nombre_categoria, descripcion)
SELECT 'Focas y Leones Marinos', 'Pinnípedos en rescate y rehabilitación' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre_categoria = 'Focas y Leones Marinos');

INSERT INTO categoria (nombre_categoria, descripcion)
SELECT 'Nutrias del Pacífico', 'Nutrias marinas de los bosques de quelpos' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre_categoria = 'Nutrias del Pacífico');

INSERT INTO categoria (nombre_categoria, descripcion)
SELECT 'Cetáceos y Ballenas', 'Delfines y ballenas bajo monitoreo' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre_categoria = 'Cetáceos y Ballenas');

INSERT INTO categoria (nombre_categoria, descripcion)
SELECT 'Tortugas Marinas', 'Tortugas en ruta migratoria o anidación' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre_categoria = 'Tortugas Marinas');

-- Animales. Los cupos disponibles ya descuentan los apadrinamientos de demo de mas abajo.
INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Jacinta', 'Foca Común', '4 meses', 'Ensenada Salina', 'RECUPERACION', 'En Recuperación',
       'Rescatada tras una tormenta en la Ensenada Salina. Requiere alimentación con papilla rica en salmón y vitaminas.',
       24, 8, 6, true, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Ensenada Salina'
WHERE c.nombre_categoria = 'Focas y Leones Marinos'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Jacinta');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Kelp', 'Nutria de Mar', '1 año', 'Bosque de Quelpos', 'LISTO', 'Monitoreo GPS',
       'Huérfana adoptiva criada en el bosque de quelpos. Excelente buceadora que monitorea los arrecifes rocosos.',
       20, 5, 4, true, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Pacífico Abierto'
WHERE c.nombre_categoria = 'Nutrias del Pacífico'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Kelp');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Coral', 'León Marino', '2 años', 'Costa de Granito', 'LISTO', 'Rehabilitado',
       'Tratado por enredo de redes de pesca fantasma. Ya recuperó toda su fuerza muscular y nada en aguas abiertas.',
       18, 6, 6, true, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Ensenada Salina'
WHERE c.nombre_categoria = 'Focas y Leones Marinos'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Coral');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Mar', 'Tortuga Laúd', '8 años', 'Pacífico Abierto', 'LISTO', 'Ruta Migratoria',
       'Custodiada durante su cruce transoceánico de anidación. Su rastreador satelital previene colisiones con barcos.',
       25, 4, 3, true, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Pacífico Abierto'
WHERE c.nombre_categoria = 'Tortugas Marinas'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Mar');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Luna', 'Foca Monje', '14 meses', 'Bahía Moloka''i', 'CRITICO', 'Peligro Crítico',
       'Rescatada con desnutrición severa y enredo en redes de deriva. Requiere antibioterapia salina y nutrición continua.',
       18, 6, 5, false, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Ensenada Salina'
WHERE c.nombre_categoria = 'Focas y Leones Marinos'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Luna');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Barnaby', 'Nutria Marina', '10 meses', 'Monterey Bay', 'RECUPERACION', 'En Rehabilitación',
       'Recuperado de hipotermia tras contaminación de pelaje. Hoy sigue una dieta rica en erizos y almejas.',
       22, 5, 5, false, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Pacífico Abierto'
WHERE c.nombre_categoria = 'Nutrias del Pacífico'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Barnaby');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Océano', 'Foca Moteada', '2 meses', 'Unidad Neonatal', 'RECUPERACION', 'Cría Huérfana',
       'Separada de su madre tras fuertes marejadas invernales. Recibe papilla de arenque fortificada y electrolitos.',
       15, 10, 10, false, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Ensenada Salina'
WHERE c.nombre_categoria = 'Focas y Leones Marinos'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Océano');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Kailani', 'Delfín Mular', '5 años', 'Canal de Santa Bárbara', 'LISTO', 'Monitoreo Satelital',
       'Marcaje acústico no invasivo para registrar sus rutas y prevenir colisiones con embarcaciones comerciales.',
       25, 4, 4, false, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Pacífico Abierto'
WHERE c.nombre_categoria = 'Cetáceos y Ballenas'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Kailani');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Arenita', 'Tortuga Golfina', '3 años', 'Costa Oaxaqueña', 'LISTO', 'Nido Protegido',
       'Patrullaje nocturno de desove y viveros de temperatura controlada para el nacimiento seguro de 98 crías.',
       15, 3, 0, false, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Pacífico Abierto'
WHERE c.nombre_categoria = 'Tortugas Marinas'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Arenita');

INSERT INTO animal (id_categoria, id_refugio, nombre_animal, especie, edad, ubicacion, urgencia, condicion, descripcion, cuota_apadrinamiento, cupos_totales, cupos_disponibles, destacado, estado, fecha_publicacion)
SELECT c.id_categoria, r.id_refugio, 'Sammy', 'León Marino', '2 años', 'San Francisco Bay', 'RECUPERACION', 'Aleta en Cicatrización',
       'Curación de una herida dorsal por anzuelo de palangre. Ya realiza nados cortos en piscinas de rehabilitación.',
       20, 6, 6, false, 'ACTIVA', '2026-06-01 09:00:00'
FROM categoria c JOIN refugio r ON r.nombre_refugio = 'Ensenada Salina'
WHERE c.nombre_categoria = 'Focas y Leones Marinos'
  AND NOT EXISTS (SELECT 1 FROM animal WHERE nombre_animal = 'Sammy');

-- Fotos. Las imagenes las sirve el front (frontend-react/public/img/animales): por eso son rutas
-- del propio sitio. La de orden 1 es la principal; Jacinta ademas tiene galeria.
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/jacinta.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/jacinta-2.jpg', 2 FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 2);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/jacinta-3.jpg', 3 FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 3);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/jacinta-4.jpg', 4 FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 4);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/jacinta-5.jpg', 5 FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 5);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/jacinta-6.jpg', 6 FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 6);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/kelp.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Kelp' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/coral.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Coral' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/mar.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Mar' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/luna.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Luna' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/barnaby.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Barnaby' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/oceano.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Océano' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/kailani.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Kailani' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/arenita.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Arenita' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);
INSERT INTO foto_animal (id_animal, url_imagen, orden) SELECT a.id_animal, '/img/animales/sammy.jpg', 1 FROM animal a WHERE a.nombre_animal = 'Sammy' AND NOT EXISTS (SELECT 1 FROM foto_animal x WHERE x.id_animal = a.id_animal AND x.orden = 1);

-- Oferta de demo: Océano con 20% de descuento hasta fin de año. Si el refugio la quita
-- (queda inactiva), no se vuelve a crear.
INSERT INTO descuento (id_animal, porcentaje, fecha_inicio, fecha_fin, activo) SELECT a.id_animal, 20, '2026-09-01', '2026-12-31', true FROM animal a WHERE a.nombre_animal = 'Océano' AND NOT EXISTS (SELECT 1 FROM descuento d WHERE d.id_animal = a.id_animal);

-- Zarpar (pagos) de demo, con su detalle. Precio de un cupo = cuota del animal x multiplicador
-- del plan (0.5, 1 o 2). El total del zarpar es la suma de sus renglones.
INSERT INTO zarpar (id_usuario, fecha_zarpar, total, estado, con_botiquin) SELECT u.id_usuario, '2026-07-10 10:00:00', 48.0, 'CONFIRMADA', false FROM usuario u WHERE u.nombre_usuario = 'marina' AND NOT EXISTS (SELECT 1 FROM zarpar z WHERE z.id_usuario = u.id_usuario AND z.fecha_zarpar = '2026-07-10 10:00:00');
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'MAREA_PROFUNDA', 1, 48.0, 48.0 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Jacinta' WHERE u.nombre_usuario = 'marina' AND z.fecha_zarpar = '2026-07-10 10:00:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);
INSERT INTO zarpar (id_usuario, fecha_zarpar, total, estado, con_botiquin) SELECT u.id_usuario, '2026-08-22 18:30:00', 27.5, 'CONFIRMADA', false FROM usuario u WHERE u.nombre_usuario = 'marina' AND NOT EXISTS (SELECT 1 FROM zarpar z WHERE z.id_usuario = u.id_usuario AND z.fecha_zarpar = '2026-08-22 18:30:00');
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'GUARDIAN_DE_LA_BAHIA', 1, 20.0, 20.0 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Kelp' WHERE u.nombre_usuario = 'marina' AND z.fecha_zarpar = '2026-08-22 18:30:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'BRISA_MARINA', 1, 7.5, 7.5 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Arenita' WHERE u.nombre_usuario = 'marina' AND z.fecha_zarpar = '2026-08-22 18:30:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);
INSERT INTO zarpar (id_usuario, fecha_zarpar, total, estado, con_botiquin) SELECT u.id_usuario, '2026-06-15 09:15:00', 68.0, 'CONFIRMADA', false FROM usuario u WHERE u.nombre_usuario = 'tomas' AND NOT EXISTS (SELECT 1 FROM zarpar z WHERE z.id_usuario = u.id_usuario AND z.fecha_zarpar = '2026-06-15 09:15:00');
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'GUARDIAN_DE_LA_BAHIA', 1, 18.0, 18.0 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Luna' WHERE u.nombre_usuario = 'tomas' AND z.fecha_zarpar = '2026-06-15 09:15:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'MAREA_PROFUNDA', 1, 50.0, 50.0 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Mar' WHERE u.nombre_usuario = 'tomas' AND z.fecha_zarpar = '2026-06-15 09:15:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);
INSERT INTO zarpar (id_usuario, fecha_zarpar, total, estado, con_botiquin) SELECT u.id_usuario, '2026-09-03 21:05:00', 42.0, 'CONFIRMADA', false FROM usuario u WHERE u.nombre_usuario = 'tomas' AND NOT EXISTS (SELECT 1 FROM zarpar z WHERE z.id_usuario = u.id_usuario AND z.fecha_zarpar = '2026-09-03 21:05:00');
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'BRISA_MARINA', 1, 12.0, 12.0 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Jacinta' WHERE u.nombre_usuario = 'tomas' AND z.fecha_zarpar = '2026-09-03 21:05:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);
INSERT INTO zarpar_detalle (id_zarpar, id_animal, plan, cantidad, precio_unitario, subtotal) SELECT z.id_zarpar, a.id_animal, 'GUARDIAN_DE_LA_BAHIA', 2, 15.0, 30.0 FROM zarpar z JOIN usuario u ON u.id_usuario = z.id_usuario JOIN animal a ON a.nombre_animal = 'Arenita' WHERE u.nombre_usuario = 'tomas' AND z.fecha_zarpar = '2026-09-03 21:05:00' AND NOT EXISTS (SELECT 1 FROM zarpar_detalle d WHERE d.id_zarpar = z.id_zarpar AND d.id_animal = a.id_animal);

-- El apadrinamiento que dejo cada uno de esos pagos. Si el padrino ya tuvo (o cancelo) uno
-- de ese animal, no se vuelve a crear.
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'MAREA_PROFUNDA', 1, '2026-07-10 10:00:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Jacinta' WHERE u.nombre_usuario = 'marina' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'GUARDIAN_DE_LA_BAHIA', 1, '2026-08-22 18:30:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Kelp' WHERE u.nombre_usuario = 'marina' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'BRISA_MARINA', 1, '2026-08-22 18:30:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Arenita' WHERE u.nombre_usuario = 'marina' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'GUARDIAN_DE_LA_BAHIA', 1, '2026-06-15 09:15:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Luna' WHERE u.nombre_usuario = 'tomas' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'MAREA_PROFUNDA', 1, '2026-06-15 09:15:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Mar' WHERE u.nombre_usuario = 'tomas' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'BRISA_MARINA', 1, '2026-09-03 21:05:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Jacinta' WHERE u.nombre_usuario = 'tomas' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);
INSERT INTO apadrinamiento (id_usuario, id_animal, plan, cupos, fecha_inicio, activo) SELECT u.id_usuario, a.id_animal, 'GUARDIAN_DE_LA_BAHIA', 2, '2026-09-03 21:05:00', true FROM usuario u JOIN animal a ON a.nombre_animal = 'Arenita' WHERE u.nombre_usuario = 'tomas' AND NOT EXISTS (SELECT 1 FROM apadrinamiento x WHERE x.id_usuario = u.id_usuario AND x.id_animal = a.id_animal);

-- Novedades (bitacora) de demo
INSERT INTO novedad (id_animal, texto, fecha) SELECT a.id_animal, 'Hoy comió sola por primera vez: tres arenques enteros sin ayuda.', '2026-09-28 12:00:00' FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM novedad x WHERE x.id_animal = a.id_animal AND x.fecha = '2026-09-28 12:00:00');
INSERT INTO novedad (id_animal, texto, fecha) SELECT a.id_animal, 'Subió 1,2 kg esta semana. Ya nada en la pileta grande con otras dos crías.', '2026-09-12 12:00:00' FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM novedad x WHERE x.id_animal = a.id_animal AND x.fecha = '2026-09-12 12:00:00');
INSERT INTO novedad (id_animal, texto, fecha) SELECT a.id_animal, 'El rastreador muestra que amplió su zona de buceo hacia el arrecife norte.', '2026-09-20 12:00:00' FROM animal a WHERE a.nombre_animal = 'Kelp' AND NOT EXISTS (SELECT 1 FROM novedad x WHERE x.id_animal = a.id_animal AND x.fecha = '2026-09-20 12:00:00');
INSERT INTO novedad (id_animal, texto, fecha) SELECT a.id_animal, 'Terminó el tratamiento con antibióticos. La herida del cuello cerró bien.', '2026-09-25 12:00:00' FROM animal a WHERE a.nombre_animal = 'Luna' AND NOT EXISTS (SELECT 1 FROM novedad x WHERE x.id_animal = a.id_animal AND x.fecha = '2026-09-25 12:00:00');
INSERT INTO novedad (id_animal, texto, fecha) SELECT a.id_animal, 'Cruzó sin problemas una ruta de barcos comerciales. Sigue rumbo al sur.', '2026-09-18 12:00:00' FROM animal a WHERE a.nombre_animal = 'Mar' AND NOT EXISTS (SELECT 1 FROM novedad x WHERE x.id_animal = a.id_animal AND x.fecha = '2026-09-18 12:00:00');

-- Posiciones informadas por el refugio para algunos animales (frente a la costa del Pacifico)
INSERT INTO ubicacion_animal (id_animal, latitud, longitud, fecha_hora) SELECT a.id_animal, -33.142, -72.05, '2026-10-06 08:00:00' FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM ubicacion_animal x WHERE x.id_animal = a.id_animal AND x.fecha_hora = '2026-10-06 08:00:00');
INSERT INTO ubicacion_animal (id_animal, latitud, longitud, fecha_hora) SELECT a.id_animal, -33.16, -71.993, '2026-10-07 08:00:00' FROM animal a WHERE a.nombre_animal = 'Jacinta' AND NOT EXISTS (SELECT 1 FROM ubicacion_animal x WHERE x.id_animal = a.id_animal AND x.fecha_hora = '2026-10-07 08:00:00');
INSERT INTO ubicacion_animal (id_animal, latitud, longitud, fecha_hora) SELECT a.id_animal, -33.088, -71.897, '2026-10-07 08:00:00' FROM animal a WHERE a.nombre_animal = 'Mar' AND NOT EXISTS (SELECT 1 FROM ubicacion_animal x WHERE x.id_animal = a.id_animal AND x.fecha_hora = '2026-10-07 08:00:00');
INSERT INTO ubicacion_animal (id_animal, latitud, longitud, fecha_hora) SELECT a.id_animal, -33.052, -71.651, '2026-10-07 08:00:00' FROM animal a WHERE a.nombre_animal = 'Kelp' AND NOT EXISTS (SELECT 1 FROM ubicacion_animal x WHERE x.id_animal = a.id_animal AND x.fecha_hora = '2026-10-07 08:00:00');
INSERT INTO ubicacion_animal (id_animal, latitud, longitud, fecha_hora) SELECT a.id_animal, -33.232, -71.865, '2026-10-07 08:00:00' FROM animal a WHERE a.nombre_animal = 'Kailani' AND NOT EXISTS (SELECT 1 FROM ubicacion_animal x WHERE x.id_animal = a.id_animal AND x.fecha_hora = '2026-10-07 08:00:00');
