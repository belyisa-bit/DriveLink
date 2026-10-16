package br.com.drivelink.vehicle.service;

import br.com.drivelink.common.exception.ResourceNotFoundException;
import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.enums.*;
import br.com.drivelink.vehicle.dto.*;
import br.com.drivelink.vehicle.repository.VehicleRepository;
import br.com.drivelink.vehicle.repository.specification.VehicleSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public Page<VehicleSummaryDTO> listVehicles(
            String search,
            String brand,
            String model,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minYear,
            Integer maxYear,
            Integer maxMileage,
            FuelType fuel,
            TransmissionType transmission,
            BodyType bodyType,
            String sortBy,
            int page,
            int size
    ) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Vehicle> spec = VehicleSpecification.filterVehicles(
                search, brand, model, minPrice, maxPrice, minYear, maxYear,
                maxMileage, fuel, transmission, bodyType, VehicleStatus.DISPONIVEL
        );

        return vehicleRepository.findAll(spec, pageable)
                .map(VehicleSummaryDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<VehicleSummaryDTO> getFeaturedVehicles() {
        return vehicleRepository.findByFeaturedTrueAndStatus(VehicleStatus.DISPONIVEL)
                .stream()
                .map(VehicleSummaryDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public VehicleDetailDTO getVehicleBySlug(String slug) {
        Vehicle vehicle = vehicleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com o slug: " + slug));
        return VehicleDetailDTO.fromEntity(vehicle);
    }

    @Transactional(readOnly = true)
    public List<VehicleSummaryDTO> getSimilarVehicles(String slug) {
        Vehicle vehicle = vehicleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com o slug: " + slug));

        return vehicleRepository.findTop4ByBrandAndIdNotAndStatus(
                        vehicle.getBrand(), vehicle.getId(), VehicleStatus.DISPONIVEL
                )
                .stream()
                .map(VehicleSummaryDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public FilterOptionsDTO getFilterOptions() {
        return FilterOptionsDTO.builder()
                .brands(vehicleRepository.findDistinctBrands())
                .fuels(Arrays.asList(FuelType.values()))
                .transmissions(Arrays.asList(TransmissionType.values()))
                .bodyTypes(Arrays.asList(BodyType.values()))
                .minPrice(vehicleRepository.findMinPrice())
                .maxPrice(vehicleRepository.findMaxPrice())
                .minYear(vehicleRepository.findMinYear())
                .maxYear(vehicleRepository.findMaxYear())
                .build();
    }

    // DRIV-24: Ordenação por recentes, menor/maior preço, menor km
    private Sort resolveSort(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.DESC, "createdAt");

        return switch (sortBy.toLowerCase()) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "mileage_asc" -> Sort.by(Sort.Direction.ASC, "mileage");
            case "year_desc" -> Sort.by(Sort.Direction.DESC, "year");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
