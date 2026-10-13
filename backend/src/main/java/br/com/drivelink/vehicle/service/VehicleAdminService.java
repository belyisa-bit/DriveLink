package br.com.drivelink.vehicle.service;

import br.com.drivelink.common.exception.ResourceNotFoundException;
import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.VehicleFeature;
import br.com.drivelink.vehicle.domain.VehicleImage;
import br.com.drivelink.vehicle.dto.VehicleAdminRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleDetailDTO;
import br.com.drivelink.vehicle.dto.VehicleFeaturedRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleImageAdminRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleImageDTO;
import br.com.drivelink.vehicle.dto.VehicleStatusRequestDTO;
import br.com.drivelink.vehicle.repository.VehicleImageRepository;
import br.com.drivelink.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class VehicleAdminService {

    private final VehicleRepository vehicleRepository;
    private final VehicleImageRepository vehicleImageRepository;

    @Transactional(readOnly = true)
    public List<VehicleDetailDTO> listarTodos() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleDetailDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public VehicleDetailDTO buscarPorId(Long id) {
        return VehicleDetailDTO.fromEntity(buscarVeiculo(id));
    }

    @Transactional
    public VehicleDetailDTO cadastrar(VehicleAdminRequestDTO dto) {
        Vehicle vehicle = new Vehicle();

        atualizarDados(vehicle, dto);

        vehicle.setSlug(vehicle.generateSlug());

        aplicarCaracteristicas(vehicle, dto.getFeatures());

        return VehicleDetailDTO.fromEntity(
                vehicleRepository.save(vehicle)
        );
    }

    @Transactional
    public VehicleDetailDTO atualizar(
            Long id,
            VehicleAdminRequestDTO dto
    ) {
        Vehicle vehicle = buscarVeiculo(id);

        atualizarDados(vehicle, dto);

        vehicle.setSlug(vehicle.generateSlug());

        aplicarCaracteristicas(vehicle, dto.getFeatures());

        return VehicleDetailDTO.fromEntity(
                vehicleRepository.save(vehicle)
        );
    }

    @Transactional
    public void excluir(Long id) {
        Vehicle vehicle = buscarVeiculo(id);
        vehicleRepository.delete(vehicle);
    }

    @Transactional
    public VehicleImageDTO adicionarImagem(
            Long vehicleId,
            VehicleImageAdminRequestDTO dto
    ) {
        Vehicle vehicle = buscarVeiculo(vehicleId);

        VehicleImage image = VehicleImage.builder()
                .vehicle(vehicle)
                .imageUrl(dto.getImageUrl())
                .displayOrder(
                        dto.getDisplayOrder() != null
                                ? dto.getDisplayOrder()
                                : vehicle.getImages().size()
                )
                .isMain(
                        dto.getIsMain() != null
                                ? dto.getIsMain()
                                : vehicle.getImages().isEmpty()
                )
                .build();

        vehicle.getImages().add(image);

        if (Boolean.TRUE.equals(image.getIsMain())) {
            definirImagemPrincipal(vehicle, image);
        }

        vehicleRepository.save(vehicle);

        return VehicleImageDTO.fromEntity(image);
    }

    @Transactional
    public List<VehicleImageDTO> reordenarImagens(
            Long vehicleId,
            List<Long> imageIds
    ) {
        Vehicle vehicle = buscarVeiculo(vehicleId);

        if (imageIds == null
                || imageIds.size() != vehicle.getImages().size()
                || new HashSet<>(imageIds).size() != imageIds.size()) {
            throw new IllegalArgumentException(
                    "Informe todos os IDs das imagens, sem repetições."
            );
        }

        Set<Long> idsExistentes = new HashSet<>();

        for (VehicleImage image : vehicle.getImages()) {
            idsExistentes.add(image.getId());
        }

        if (!idsExistentes.equals(new HashSet<>(imageIds))) {
            throw new IllegalArgumentException(
                    "Os IDs informados devem pertencer ao veículo."
            );
        }

        for (int i = 0; i < imageIds.size(); i++) {
            Long imageId = imageIds.get(i);

            vehicle.getImages().stream()
                    .filter(image -> image.getId().equals(imageId))
                    .findFirst()
                    .orElseThrow()
                    .setDisplayOrder(i);
        }

        vehicleRepository.save(vehicle);

        return vehicle.getImages().stream()
                .sorted((a, b) ->
                        a.getDisplayOrder().compareTo(b.getDisplayOrder()))
                .map(VehicleImageDTO::fromEntity)
                .toList();
    }

    @Transactional
    public VehicleImageDTO definirImagemPrincipal(
            Long vehicleId,
            Long imageId
    ) {
        Vehicle vehicle = buscarVeiculo(vehicleId);

        VehicleImage principal = vehicle.getImages().stream()
                .filter(image -> image.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Imagem não encontrada para esse veículo."
                        )
                );

        definirImagemPrincipal(vehicle, principal);

        vehicleRepository.save(vehicle);

        return VehicleImageDTO.fromEntity(principal);
    }

    @Transactional
    public VehicleDetailDTO alterarDestaque(
            Long id,
            VehicleFeaturedRequestDTO dto
    ) {
        Vehicle vehicle = buscarVeiculo(id);

        vehicle.setFeatured(dto.getFeatured());

        return VehicleDetailDTO.fromEntity(
                vehicleRepository.save(vehicle)
        );
    }

    @Transactional
    public VehicleDetailDTO alterarStatus(
            Long id,
            VehicleStatusRequestDTO dto
    ) {
        Vehicle vehicle = buscarVeiculo(id);

        vehicle.setStatus(dto.getStatus());

        return VehicleDetailDTO.fromEntity(
                vehicleRepository.save(vehicle)
        );
    }

    private Vehicle buscarVeiculo(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Veículo não encontrado: " + id
                        )
                );
    }

    private void atualizarDados(
            Vehicle vehicle,
            VehicleAdminRequestDTO dto
    ) {
        vehicle.setBrand(dto.getBrand());
        vehicle.setModel(dto.getModel());
        vehicle.setVersion(dto.getVersion());
        vehicle.setYear(dto.getYear());
        vehicle.setMileage(dto.getMileage());
        vehicle.setPrice(dto.getPrice());
        vehicle.setColor(dto.getColor());
        vehicle.setFuel(dto.getFuel());
        vehicle.setTransmission(dto.getTransmission());
        vehicle.setEngine(dto.getEngine());
        vehicle.setBodyType(dto.getBodyType());
        vehicle.setDoors(dto.getDoors());
        vehicle.setPlateEnding(dto.getPlateEnding());
        vehicle.setHasWarranty(dto.getHasWarranty());
        vehicle.setDescription(dto.getDescription());
        vehicle.setSingleOwner(dto.getSingleOwner());
        vehicle.setReviewed(dto.getReviewed());
        vehicle.setFeatured(dto.getFeatured());
        vehicle.setStatus(dto.getStatus());
    }

    private void aplicarCaracteristicas(
            Vehicle vehicle,
            List<String> features
    ) {
        vehicle.getFeatures().clear();

        if (features == null) {
            return;
        }

        for (String name : features) {
            if (name == null || name.isBlank()) {
                continue;
            }

            VehicleFeature feature = VehicleFeature.builder()
                    .name(name.trim())
                    .vehicle(vehicle)
                    .build();

            vehicle.getFeatures().add(feature);
        }
    }

    private void definirImagemPrincipal(
            Vehicle vehicle,
            VehicleImage principal
    ) {
        for (VehicleImage image : vehicle.getImages()) {
            image.setIsMain(image.getId() != null
                    && image.getId().equals(principal.getId()));
        }

        principal.setIsMain(true);
    }
}