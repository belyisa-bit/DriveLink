package br.com.drivelink.vehicle.repository;

import br.com.drivelink.vehicle.domain.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleImageRepository
        extends JpaRepository<VehicleImage, Long> {
}