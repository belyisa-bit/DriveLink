package br.com.drivelink.vehicle.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleFeaturedRequestDTO {

    @NotNull
    private Boolean featured;
}