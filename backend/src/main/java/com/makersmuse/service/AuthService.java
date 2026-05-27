package com.makersmuse.service;

import com.makersmuse.dto.AuthRequest;
import com.makersmuse.dto.AuthResponse;
import com.makersmuse.dto.RegisterRequest;
import com.makersmuse.entity.ArtistProfile;
import com.makersmuse.entity.User;
import com.makersmuse.enums.Role;
import com.makersmuse.repository.ArtistProfileRepository;
import com.makersmuse.repository.UserRepository;
import com.makersmuse.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        Long artistProfileId = null;

        // Create artist profile if registering as artist
        if (request.getRole() == Role.ROLE_ARTIST) {
            ArtistProfile profile = ArtistProfile.builder()
                    .user(user)
                    .bio(request.getBio())
                    .build();
            profile = artistProfileRepository.save(profile);
            artistProfileId = profile.getId();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .userId(user.getId())
                .artistProfileId(artistProfileId)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // Throws AuthenticationException if credentials are invalid
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        Long artistProfileId = null;
        if (user.getRole() == Role.ROLE_ARTIST) {
            artistProfileId = artistProfileRepository.findByUserId(user.getId())
                    .map(ArtistProfile::getId).orElse(null);
        }

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .userId(user.getId())
                .artistProfileId(artistProfileId)
                .build();
    }
}
