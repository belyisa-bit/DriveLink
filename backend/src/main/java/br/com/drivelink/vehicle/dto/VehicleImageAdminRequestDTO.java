package br.com.drivelink.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VehicleImageAdminRequestDTO {

    @NotBlank
    private String imageUrl;

    @Min(0)
    private Integer displayOrder;

    private Boolean isMain;
}