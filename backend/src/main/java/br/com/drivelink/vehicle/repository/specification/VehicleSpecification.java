package br.com.drivelink.vehicle.repository.specification;

import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.enums.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> filterVehicles(
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
            VehicleStatus status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status padrão DISPONIVEL se não especificado
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            } else {
                predicates.add(cb.equal(root.get("status"), VehicleStatus.DISPONIVEL));
            }

            // DRIV-25: Busca por palavra-chave em marca, modelo ou versão
            if (search != null && !search.isBlank()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                Predicate searchBrand = cb.like(cb.lower(root.get("brand")), term);
                Predicate searchModel = cb.like(cb.lower(root.get("model")), term);
                Predicate searchVersion = cb.like(cb.lower(root.get("version")), term);
                predicates.add(cb.or(searchBrand, searchModel, searchVersion));
            }

            if (brand != null && !brand.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("brand")), brand.trim().toLowerCase()));
            }

            if (model != null && !model.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("model")), model.trim().toLowerCase()));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minYear != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("year"), minYear));
            }

            if (maxYear != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("year"), maxYear));
            }

            if (maxMileage != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("mileage"), maxMileage));
            }

            if (fuel != null) {
                predicates.add(cb.equal(root.get("fuel"), fuel));
            }

            if (transmission != null) {
                predicates.add(cb.equal(root.get("transmission"), transmission));
            }

            if (bodyType != null) {
                predicates.add(cb.equal(root.get("bodyType"), bodyType));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
