package com.makersmuse.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class LocalStorageService {

    @Value("${storage.local.upload-dir:./uploads}")
    private String uploadDir;

    private Path highResDir;
    private Path thumbDir;

    @PostConstruct
    public void init() {
        highResDir = Paths.get(uploadDir, "highres").toAbsolutePath().normalize();
        thumbDir = Paths.get(uploadDir, "thumbnails").toAbsolutePath().normalize();

        try {
            Files.createDirectories(highResDir);
            Files.createDirectories(thumbDir);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directories!", ex);
        }
    }

    public String uploadHighRes(MultipartFile file, Long artworkId) throws IOException {
        String filename = artworkId + "_" + UUID.randomUUID() + "_highres_" + sanitize(file.getOriginalFilename());
        Path targetLocation = highResDir.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation);
        log.info("High-res uploaded locally: {}", filename);
        return filename;
    }

    public String uploadThumbnail(MultipartFile file, Long artworkId) throws IOException {
        String filename = artworkId + "_" + UUID.randomUUID() + "_thumb.jpg";
        Path targetLocation = thumbDir.resolve(filename);
        
        Thumbnails.of(file.getInputStream())
                .width(800)
                .keepAspectRatio(true)
                .outputFormat("jpg")
                .outputQuality(0.80)
                .toFile(targetLocation.toFile());

        String publicUrl = "/api/files/thumbnails/" + filename;
        log.info("Thumbnail uploaded locally: {}", publicUrl);
        return publicUrl;
    }

    public String generatePresignedUrl(String objectKey) {
        // For local storage, we just return a special local endpoint URL that requires the JWT or download token
        return "/api/files/downloads/" + objectKey;
    }

    public void deleteHighRes(String key) {
        try {
            Files.deleteIfExists(highResDir.resolve(key));
        } catch (IOException e) {
            log.error("Failed to delete high-res file: {}", key, e);
        }
    }

    public void deleteThumbnail(String thumbnailUrl) {
        String key = thumbnailUrl.substring(thumbnailUrl.lastIndexOf("/") + 1);
        try {
            Files.deleteIfExists(thumbDir.resolve(key));
        } catch (IOException e) {
            log.error("Failed to delete thumbnail: {}", key, e);
        }
    }

    private String sanitize(String filename) {
        return filename == null ? "file" : filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
