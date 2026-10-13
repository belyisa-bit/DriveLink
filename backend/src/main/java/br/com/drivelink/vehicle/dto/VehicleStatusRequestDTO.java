package br.com.drivelink.vehicle.dto;

import br.com.drivelink.vehicle.domain.enums.VehicleStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleStatusRequestDTO {

    @NotNull
    private VehicleStatus status;
}