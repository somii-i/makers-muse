package com.makersmuse.controller;

import com.makersmuse.service.EarningsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artist")
@RequiredArgsConstructor
public class EarningsController {

    private final EarningsService earningsService;

    /** GET /api/artist/earnings — ROLE_ARTIST only */
    @GetMapping("/earnings")
    public ResponseEntity<EarningsService.EarningsSummary> getEarnings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(earningsService.getEarnings(userDetails.getUsername()));
    }
}
