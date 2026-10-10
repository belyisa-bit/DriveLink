package br.com.drivelink.vehicle.dto;

import br.com.drivelink.vehicle.domain.VehicleImage;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleImageDTO {
    private Long id;
    private String url;
    private Integer displayOrder;
    private Boolean isMain;

    public static VehicleImageDTO fromEntity(VehicleImage image) {
        return VehicleImageDTO.builder()
                .id(image.getId())
                .url(image.getImageUrl())
                .displayOrder(image.getDisplayOrder())
                .isMain(image.getIsMain())
                .build();
    }
}
