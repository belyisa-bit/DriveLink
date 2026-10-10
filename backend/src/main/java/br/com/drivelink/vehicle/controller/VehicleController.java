package br.com.drivelink.vehicle.controller;

import br.com.drivelink.vehicle.domain.enums.*;
import br.com.drivelink.vehicle.dto.*;
import br.com.drivelink.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // DRIV-23, DRIV-24, DRIV-25
    @GetMapping
    public ResponseEntity<Page<VehicleSummaryDTO>> listVehicles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) FuelType fuel,
            @RequestParam(required = false) TransmissionType transmission,
            @RequestParam(required = false) BodyType bodyType,
            @RequestParam(required = false, defaultValue = "recent") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<VehicleSummaryDTO> vehicles = vehicleService.listVehicles(
                search, brand, model, minPrice, maxPrice, minYear, maxYear,
                maxMileage, fuel, transmission, bodyType, sortBy, page, size
        );
        return ResponseEntity.ok(vehicles);
    }

    // DRIV-26
    @GetMapping("/featured")
    public ResponseEntity<List<VehicleSummaryDTO>> getFeaturedVehicles() {
        return ResponseEntity.ok(vehicleService.getFeaturedVehicles());
    }

    // DRIV-27
    @GetMapping("/filters")
    public ResponseEntity<FilterOptionsDTO> getFilterOptions() {
        return ResponseEntity.ok(vehicleService.getFilterOptions());
    }

    // DRIV-28
    @GetMapping("/{slug}")
    public ResponseEntity<VehicleDetailDTO> getVehicleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(vehicleService.getVehicleBySlug(slug));
    }

    // DRIV-28
    @GetMapping("/{slug}/similar")
    public ResponseEntity<List<VehicleSummaryDTO>> getSimilarVehicles(@PathVariable String slug) {
        return ResponseEntity.ok(vehicleService.getSimilarVehicles(slug));
    }
}
