package br.com.drivelink.vehicle.controller;

import br.com.drivelink.vehicle.dto.VehicleAdminRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleDetailDTO;
import br.com.drivelink.vehicle.dto.VehicleFeaturedRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleImageAdminRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleImageDTO;
import br.com.drivelink.vehicle.dto.VehicleStatusRequestDTO;
import br.com.drivelink.vehicle.service.VehicleAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/vehicles")
@RequiredArgsConstructor
public class VehicleAdminController {

    private final VehicleAdminService vehicleAdminService;

    @GetMapping
    public ResponseEntity<List<VehicleDetailDTO>> listarTodos() {
        return ResponseEntity.ok(
                vehicleAdminService.listarTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDetailDTO> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                vehicleAdminService.buscarPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<VehicleDetailDTO> cadastrar(
            @Valid @RequestBody VehicleAdminRequestDTO dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehicleAdminService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleDetailDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody VehicleAdminRequestDTO dto
    ) {
        return ResponseEntity.ok(
                vehicleAdminService.atualizar(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {
        vehicleAdminService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<VehicleImageDTO> adicionarImagem(
            @PathVariable Long id,
            @Valid @RequestBody VehicleImageAdminRequestDTO dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehicleAdminService.adicionarImagem(id, dto));
    }

    @PutMapping("/{id}/images/order")
    public ResponseEntity<List<VehicleImageDTO>> reordenarImagens(
            @PathVariable Long id,
            @RequestBody List<Long> imageIds
    ) {
        return ResponseEntity.ok(
                vehicleAdminService.reordenarImagens(id, imageIds)
        );
    }

    @PatchMapping("/{id}/images/{imageId}/main")
    public ResponseEntity<VehicleImageDTO> definirImagemPrincipal(
            @PathVariable Long id,
            @PathVariable Long imageId
    ) {
        return ResponseEntity.ok(
                vehicleAdminService.definirImagemPrincipal(id, imageId)
        );
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<VehicleDetailDTO> alterarDestaque(
            @PathVariable Long id,
            @Valid @RequestBody VehicleFeaturedRequestDTO dto
    ) {
        return ResponseEntity.ok(
                vehicleAdminService.alterarDestaque(id, dto)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VehicleDetailDTO> alterarStatus(
            @PathVariable Long id,
            @Valid @RequestBody VehicleStatusRequestDTO dto
    ) {
        return ResponseEntity.ok(
                vehicleAdminService.alterarStatus(id, dto)
        );
    }
}