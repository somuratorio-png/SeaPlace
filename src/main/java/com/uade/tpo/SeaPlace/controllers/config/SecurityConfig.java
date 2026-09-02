package com.uade.tpo.SeaPlace.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/animales/**", "/refugios/**", "/categorias/**").permitAll()
                        // Estas tres rutas ya no chequean el rol a lo bruto: chequean el permiso
                        // puntual que la tabla rol_permiso le haya asignado al rol del usuario
                        // (ver Usuario.getAuthorities()). Hoy solo "administrador" tiene los tres
                        // permisos (data.sql), pero cualquier rol nuevo podria tener uno sin tener
                        // los otros dos.
                        .requestMatchers("/permisos/**", "/roles/**").hasAuthority("GESTIONAR_ROLES")
                        .requestMatchers(HttpMethod.POST, "/refugios/**").hasAuthority("GESTIONAR_REFUGIOS")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/*/rol").hasAuthority("GESTIONAR_USUARIOS")
                        // Crear/editar/borrar animales ya no es exclusivo de ADMINISTRADOR: cualquier
                        // usuario autenticado puede intentarlo, pero AnimalServiceImpl valida que sea
                        // el dueno del refugio (o admin). Asi el refugio gestiona sus propios animales.
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}