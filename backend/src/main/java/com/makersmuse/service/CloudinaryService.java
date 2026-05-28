package com.makersmuse.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final boolean enabled;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret
    ) {
        this.enabled = !cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank();
        if (enabled) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            log.info("Cloudinary storage enabled (cloud: {})", cloudName);
        } else {
            this.cloudinary = null;
            log.warn("Cloudinary not configured — falling back to local storage");
        }
    }

    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Uploads an image to Cloudinary and returns the secure HTTPS URL.
     * Automatically generates a 800px-wide thumbnail via Cloudinary transformations.
     *
     * @param file      The image file to upload
     * @param folder    Cloudinary folder (e.g. "makers-muse/thumbnails")
     * @param publicId  Optional stable public ID (e.g. "artwork_42_thumb")
     * @return secure HTTPS URL of the uploaded image
     */
    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, String folder, String publicId) throws IOException {
        if (!enabled) {
            throw new IllegalStateException("Cloudinary is not configured");
        }

        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "public_id", publicId,
                "overwrite", true,
                "resource_type", "image",
                // Auto-resize to max 800px width, keeping aspect ratio, quality auto
                "transformation", ObjectUtils.asMap(
                        "width", 800,
                        "crop", "limit",
                        "quality", "auto",
                        "fetch_format", "auto"
                )
        );

        Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), options);
        String url = (String) result.get("secure_url");
        log.info("Uploaded to Cloudinary: {}", url);
        return url;
    }

    /**
     * Uploads the original high-res image to Cloudinary (no resizing).
     */
    @SuppressWarnings("unchecked")
    public String uploadHighRes(MultipartFile file, String folder, String publicId) throws IOException {
        if (!enabled) {
            throw new IllegalStateException("Cloudinary is not configured");
        }

        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "public_id", publicId,
                "overwrite", true,
                "resource_type", "image"
        );

        Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), options);
        String url = (String) result.get("secure_url");
        log.info("Uploaded high-res to Cloudinary: {}", url);
        return url;
    }

    /**
     * Deletes an image from Cloudinary by its public ID.
     */
    @SuppressWarnings("unchecked")
    public void deleteImage(String publicId) {
        if (!enabled || publicId == null || publicId.isBlank()) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Deleted from Cloudinary: {}", publicId);
        } catch (Exception e) {
            log.error("Failed to delete Cloudinary image {}: {}", publicId, e.getMessage());
        }
    }
}
