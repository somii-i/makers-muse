package com.makersmuse.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFixer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixCategoryConstraint() {
        try {
            System.out.println("Attempting to drop the artworks_category_check constraint...");
            jdbcTemplate.execute("ALTER TABLE artworks DROP CONSTRAINT artworks_category_check");
            System.out.println("Successfully dropped artworks_category_check constraint!");
        } catch (Exception e) {
            System.out.println("Constraint might already be dropped or an error occurred: " + e.getMessage());
        }

        try {
            System.out.println("Attempting to drop the artworks_license_type_check constraint...");
            jdbcTemplate.execute("ALTER TABLE artworks DROP CONSTRAINT artworks_license_type_check");
            System.out.println("Successfully dropped artworks_license_type_check constraint!");
        } catch (Exception e) {
            System.out.println("Constraint might already be dropped or an error occurred: " + e.getMessage());
        }

        try {
            System.out.println("Migrating old enum values in the database...");
            jdbcTemplate.execute("UPDATE artworks SET license_type = 'DIGITAL' WHERE license_type = 'DIGITAL_DOWNLOAD'");
            jdbcTemplate.execute("UPDATE artworks SET license_type = 'PHYSICAL' WHERE license_type = 'PHYSICAL_PRINT'");
            
            jdbcTemplate.execute("UPDATE order_items SET license_type = 'DIGITAL' WHERE license_type = 'DIGITAL_DOWNLOAD'");
            jdbcTemplate.execute("UPDATE order_items SET license_type = 'PHYSICAL' WHERE license_type = 'PHYSICAL_PRINT'");
            System.out.println("Data migration complete!");
        } catch (Exception e) {
            System.out.println("Data migration skipped or an error occurred: " + e.getMessage());
        }
    }
}
