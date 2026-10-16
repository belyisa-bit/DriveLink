package br.com.drivelink.vehicle.dto;

import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.VehicleImage;
import br.com.drivelink.vehicle.domain.enums.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class VehicleSummaryDTO {
    private Long id;
    private String brand;
    private String model;
    private String version;
    private String slug;
    private Integer year;
    private Integer mileage;
    private BigDecimal price;
    private FuelType fuel;
    private TransmissionType transmission;
    private BodyType bodyType;
    private String mainImageUrl;
    private Boolean featured;
    private VehicleStatus status;

    public static VehicleSummaryDTO fromEntity(Vehicle vehicle) {
        String mainImage = vehicle.getImages().stream()
                .filter(VehicleImage::getIsMain)
                .findFirst()
                .map(VehicleImage::getImageUrl)
                .orElse(vehicle.getImages().isEmpty() ? null : vehicle.getImages().get(0).getImageUrl());

        return VehicleSummaryDTO.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .version(vehicle.getVersion())
                .slug(vehicle.getSlug())
                .year(vehicle.getYear())
                .mileage(vehicle.getMileage())
                .price(vehicle.getPrice())
                .fuel(vehicle.getFuel())
                .transmission(vehicle.getTransmission())
                .bodyType(vehicle.getBodyType())
                .mainImageUrl(mainImage)
                .featured(vehicle.getFeatured())
                .status(vehicle.getStatus())
                .build();
    }
}
