package com.shreyash.jobportal.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                        writeError(res, 401, "Authentication required"))
                .accessDeniedHandler((req, res, e) ->
                        writeError(res, 403, "Access denied")))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // public
                .requestMatchers("/api/login", "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/filter",
                        "/api/jobs/count", "/api/jobs/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/applications/resume/**").permitAll()

                // employer
                
                .requestMatchers(HttpMethod.GET, "/api/employer").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/employer/{id}").hasRole("ADMIN")
                .requestMatchers("/api/employer/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.GET, "/api/jobs/employer/**",
                        "/api/jobs/count/employer/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/{id}").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/{id}")
                        .hasAnyRole("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/applications/employer/**",
                        "/api/applications/count/employer/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.PUT, "/api/applications/{id}/status")
                        .hasAnyRole("EMPLOYER", "ADMIN")

                // job seeker
                .requestMatchers(HttpMethod.POST, "/api/applications",
                        "/api/applications/upload").hasRole("JOBSEEKER")
                .requestMatchers(HttpMethod.GET, "/api/applications/user/**",
                        "/api/applications/check").hasRole("JOBSEEKER")

                // admin
                .requestMatchers(HttpMethod.GET, "/api/applications",
                        "/api/applications/count").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private static void writeError(HttpServletResponse res, int status, String message)
            throws IOException {
        res.setStatus(status);
        res.setContentType("application/json");
        res.getWriter().write("{\"status\":" + status + ",\"message\":\"" + message + "\"}");
    }
}