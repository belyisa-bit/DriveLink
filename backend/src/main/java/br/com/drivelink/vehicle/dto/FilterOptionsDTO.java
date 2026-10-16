package br.com.drivelink.vehicle.dto;

import br.com.drivelink.vehicle.domain.enums.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class FilterOptionsDTO {
    private List<String> brands;
    private List<FuelType> fuels;
    private List<TransmissionType> transmissions;
    private List<BodyType> bodyTypes;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer minYear;
    private Integer maxYear;
}
