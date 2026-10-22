package br.com.drivelink.vehicle.service;

import br.com.drivelink.common.exception.ResourceNotFoundException;
import br.com.drivelink.vehicle.domain.enums.VehicleStatus;
import br.com.drivelink.vehicle.repository.VehicleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    private VehicleService vehicleService;

    @BeforeEach
    void setUp() {
        vehicleService = new VehicleService(vehicleRepository);
    }

    @Test
    void deveRetornarPaginaVaziaQuandoNaoExistemVeiculos() {
        when(vehicleRepository.findAll(
                any(org.springframework.data.jpa.domain.Specification.class),
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(List.of()));

        Page<?> resultado = vehicleService.listVehicles(
                null, null, null,
                null, null, null, null, null,
                null, null, null,
                null, 0, 10
        );

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(vehicleRepository).findAll(
                any(org.springframework.data.jpa.domain.Specification.class),
                any(Pageable.class)
        );
    }

    @Test
    void deveRetornarListaVaziaQuandoNaoExistemVeiculosEmDestaque() {
        when(vehicleRepository.findByFeaturedTrueAndStatus(
                VehicleStatus.DISPONIVEL
        )).thenReturn(List.of());

        var resultado = vehicleService.getFeaturedVehicles();

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());

        verify(vehicleRepository)
                .findByFeaturedTrueAndStatus(VehicleStatus.DISPONIVEL);
    }

    @Test
    void deveLancarExcecaoQuandoSlugNaoExiste() {
        when(vehicleRepository.findBySlug("slug-inexistente"))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> vehicleService.getVehicleBySlug("slug-inexistente")
        );

        verify(vehicleRepository).findBySlug("slug-inexistente");
    }

    @Test
    void deveLancarExcecaoAoBuscarSimilaresDeSlugInexistente() {
        when(vehicleRepository.findBySlug("slug-inexistente"))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> vehicleService.getSimilarVehicles("slug-inexistente")
        );

        verify(vehicleRepository).findBySlug("slug-inexistente");
    }

    @Test
    void deveRetornarOpcoesDeFiltros() {
        when(vehicleRepository.findDistinctBrands())
                .thenReturn(List.of("Honda", "Toyota"));

        when(vehicleRepository.findMinPrice()).thenReturn(null);
        when(vehicleRepository.findMaxPrice()).thenReturn(null);
        when(vehicleRepository.findMinYear()).thenReturn(null);
        when(vehicleRepository.findMaxYear()).thenReturn(null);

        var resultado = vehicleService.getFilterOptions();

        assertNotNull(resultado);
        assertEquals(List.of("Honda", "Toyota"), resultado.getBrands());

        verify(vehicleRepository).findDistinctBrands();
        verify(vehicleRepository).findMinPrice();
        verify(vehicleRepository).findMaxPrice();
        verify(vehicleRepository).findMinYear();
        verify(vehicleRepository).findMaxYear();
    }
}