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
                        .requestMatchers(HttpMethod.GET, "/animales/**", "/refugios/**", "/categorias/**", "/planes/**").permitAll()
                        .requestMatchers("/permisos/**", "/roles/**").hasAuthority("GESTIONAR_ROLES")
                        .requestMatchers(HttpMethod.POST, "/refugios/**").hasAuthority("GESTIONAR_REFUGIOS")
                        .requestMatchers(HttpMethod.PUT, "/refugios/**").hasAuthority("GESTIONAR_REFUGIOS")
                        .requestMatchers(HttpMethod.GET, "/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/usuarios/**").hasAuthority("GESTIONAR_USUARIOS")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/*/rol", "/usuarios/*/reactivar").hasAuthority("GESTIONAR_USUARIOS")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}