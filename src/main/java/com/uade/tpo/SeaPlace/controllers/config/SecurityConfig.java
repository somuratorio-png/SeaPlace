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
                        .requestMatchers("/permisos/**", "/roles/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.POST, "/refugios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/*/rol").hasRole("ADMINISTRADOR")
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