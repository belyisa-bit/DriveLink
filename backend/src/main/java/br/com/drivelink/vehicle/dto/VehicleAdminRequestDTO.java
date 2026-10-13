package br.com.drivelink.vehicle.dto;

import br.com.drivelink.vehicle.domain.enums.BodyType;
import br.com.drivelink.vehicle.domain.enums.FuelType;
import br.com.drivelink.vehicle.domain.enums.TransmissionType;
import br.com.drivelink.vehicle.domain.enums.VehicleStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class VehicleAdminRequestDTO {

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotBlank
    private String version;

    @NotNull
    @Min(1900)
    private Integer year;

    @NotNull
    @Min(0)
    private Integer mileage;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @NotBlank
    private String color;

    @NotNull
    private FuelType fuel;

    @NotNull
    private TransmissionType transmission;

    @NotBlank
    private String engine;

    @NotNull
    private BodyType bodyType;

    @NotNull
    @Min(2)
    private Integer doors;

    @NotBlank
    @Size(max = 1)
    private String plateEnding;

    @NotNull
    private Boolean hasWarranty;

    private String description;

    @NotNull
    private Boolean singleOwner;

    @NotNull
    private Boolean reviewed;

    @NotNull
    private Boolean featured;

    @NotNull
    private VehicleStatus status;

    private List<String> features;
}