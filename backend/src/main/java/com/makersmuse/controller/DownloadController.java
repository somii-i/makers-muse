package com.makersmuse.controller;

import com.makersmuse.service.DownloadTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/download")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadTokenService downloadTokenService;

    /**
     * GET /api/download/{token}
     * Public — token itself is the auth. Returns a presigned S3 URL.
     * Token is validated (expiry + usage count) before generating the URL.
     */
    @GetMapping("/{token}")
    public ResponseEntity<Map<String, String>> download(@PathVariable String token) {
        String presignedUrl = downloadTokenService.redeemToken(token);
        return ResponseEntity.ok(Map.of("downloadUrl", presignedUrl));
    }
}
