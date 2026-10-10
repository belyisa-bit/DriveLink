package br.com.drivelink.vehicle.dto;

import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.VehicleFeature;
import br.com.drivelink.vehicle.domain.enums.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class VehicleDetailDTO {
    private Long id;
    private String brand;
    private String model;
    private String version;
    private String slug;
    private Integer year;
    private Integer mileage;
    private BigDecimal price;
    private String color;
    private FuelType fuel;
    private TransmissionType transmission;
    private String engine;
    private BodyType bodyType;
    private Integer doors;
    private String plateEnding;
    private Boolean hasWarranty;
    private String description;
    private Boolean singleOwner;
    private Boolean reviewed;
    private Boolean featured;
    private VehicleStatus status;
    private List<VehicleImageDTO> images;
    private List<String> features;

    public static VehicleDetailDTO fromEntity(Vehicle vehicle) {
        return VehicleDetailDTO.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .version(vehicle.getVersion())
                .slug(vehicle.getSlug())
                .year(vehicle.getYear())
                .mileage(vehicle.getMileage())
                .price(vehicle.getPrice())
                .color(vehicle.getColor())
                .fuel(vehicle.getFuel())
                .transmission(vehicle.getTransmission())
                .engine(vehicle.getEngine())
                .bodyType(vehicle.getBodyType())
                .doors(vehicle.getDoors())
                .plateEnding(vehicle.getPlateEnding())
                .hasWarranty(vehicle.getHasWarranty())
                .description(vehicle.getDescription())
                .singleOwner(vehicle.getSingleOwner())
                .reviewed(vehicle.getReviewed())
                .featured(vehicle.getFeatured())
                .status(vehicle.getStatus())
                .images(vehicle.getImages().stream().map(VehicleImageDTO::fromEntity).toList())
                .features(vehicle.getFeatures().stream().map(VehicleFeature::getName).toList())
                .build();
    }
}
