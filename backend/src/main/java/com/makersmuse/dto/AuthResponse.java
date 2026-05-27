package com.makersmuse.dto;

import com.makersmuse.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private Role role;
    private Long userId;
    private Long artistProfileId; // null for customers
}
