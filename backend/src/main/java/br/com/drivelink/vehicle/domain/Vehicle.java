package br.com.drivelink.vehicle.domain;

import br.com.drivelink.vehicle.domain.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String version;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "manufacture_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer mileage;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransmissionType transmission;

    @Column(nullable = false)
    private String engine;

    @Enumerated(EnumType.STRING)
    @Column(name = "body_type", nullable = false)
    private BodyType bodyType;

    @Column(nullable = false)
    private Integer doors;

    @Column(name = "plate_ending", nullable = false)
    private String plateEnding;

    @Column(name = "has_warranty", nullable = false)
    private Boolean hasWarranty;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "single_owner", nullable = false)
    private Boolean singleOwner;

    @Column(nullable = false)
    private Boolean reviewed;

    @Column(nullable = false)
    private Boolean featured;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VehicleImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VehicleFeature> features = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.slug == null || this.slug.isBlank()) {
            this.slug = generateSlug();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String generateSlug() {
        String base = String.format("%s-%s-%s-%d", brand, model, version, year);
        String NOWHITESPACE = Pattern.compile("[\\s]").matcher(base).replaceAll("-");
        String normalized = Normalizer.normalize(NOWHITESPACE, Normalizer.Form.NFD);
        String slugStr = Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("");
        return slugStr.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-");
    }
}
