package br.com.drivelink.vehicle.repository;

import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.enums.VehicleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

    Optional<Vehicle> findBySlug(String slug);

    List<Vehicle> findByFeaturedTrueAndStatus(VehicleStatus status);

    List<Vehicle> findTop4ByBrandAndIdNotAndStatus(String brand, Long id, VehicleStatus status);

    @Query("SELECT DISTINCT v.brand FROM Vehicle v WHERE v.status = 'DISPONIVEL' ORDER BY v.brand ASC")
    List<String> findDistinctBrands();

    @Query("SELECT MIN(v.price) FROM Vehicle v WHERE v.status = 'DISPONIVEL'")
    BigDecimal findMinPrice();

    @Query("SELECT MAX(v.price) FROM Vehicle v WHERE v.status = 'DISPONIVEL'")
    BigDecimal findMaxPrice();

    @Query("SELECT MIN(v.year) FROM Vehicle v WHERE v.status = 'DISPONIVEL'")
    Integer findMinYear();

    @Query("SELECT MAX(v.year) FROM Vehicle v WHERE v.status = 'DISPONIVEL'")
    Integer findMaxYear();
}
