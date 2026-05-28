package com.makersmuse.config;

import com.makersmuse.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity          // Enables @PreAuthorize on methods
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — we use stateless JWT
            .csrf(AbstractHttpConfigurer::disable)

            // CORS — uses the CorsConfigurationSource bean from CorsConfig
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Stripe webhook — must be public (validated by signature)
                .requestMatchers("/api/webhook/stripe").permitAll()

                // Public artwork browsing (GET only)
                .requestMatchers(HttpMethod.GET, "/api/artworks/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/artworks").permitAll()

                // Public reviews (GET only)
                .requestMatchers(HttpMethod.GET, "/api/artworks/*/reviews").permitAll()

                // Public chatbot
                .requestMatchers("/api/chat").permitAll()

                // Public download (token-auth)
                .requestMatchers("/api/download/**").permitAll()

                // Public file access (thumbnails)
                .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()

                // Public contact + newsletter
                .requestMatchers("/api/contact").permitAll()
                .requestMatchers("/api/newsletter/**").permitAll()

                // Actuator health
                .requestMatchers("/actuator/health").permitAll()

                // Artist-only endpoints
                .requestMatchers(HttpMethod.POST, "/api/artworks").hasAuthority("ROLE_ARTIST")
                .requestMatchers(HttpMethod.DELETE, "/api/artworks/**").hasAuthority("ROLE_ARTIST")
                .requestMatchers("/api/artworks/my").hasAuthority("ROLE_ARTIST")
                .requestMatchers("/api/artist/**").hasAuthority("ROLE_ARTIST")

                // Customer-only endpoints
                .requestMatchers("/api/orders/**").hasAuthority("ROLE_CUSTOMER")
                .requestMatchers(HttpMethod.POST, "/api/artworks/*/reviews").hasAuthority("ROLE_CUSTOMER")

                // All other requests require authentication
                .anyRequest().authenticated()
            )

            // Stateless — no HTTP sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Custom auth provider
            .authenticationProvider(authenticationProvider())

            // Register JWT filter before Spring's UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
