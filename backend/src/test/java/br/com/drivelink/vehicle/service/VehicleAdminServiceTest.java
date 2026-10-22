package br.com.drivelink.vehicle.service;

import br.com.drivelink.common.exception.ResourceNotFoundException;
import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.domain.VehicleImage;
import br.com.drivelink.vehicle.domain.enums.BodyType;
import br.com.drivelink.vehicle.domain.enums.FuelType;
import br.com.drivelink.vehicle.domain.enums.TransmissionType;
import br.com.drivelink.vehicle.domain.enums.VehicleStatus;
import br.com.drivelink.vehicle.dto.VehicleAdminRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleFeaturedRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleImageAdminRequestDTO;
import br.com.drivelink.vehicle.dto.VehicleStatusRequestDTO;
import br.com.drivelink.vehicle.repository.VehicleImageRepository;
import br.com.drivelink.vehicle.repository.VehicleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleAdminServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleImageRepository vehicleImageRepository;

    private VehicleAdminService service;

    @BeforeEach
    void setUp() {
        service = new VehicleAdminService(
                vehicleRepository,
                vehicleImageRepository
        );
    }

    private Vehicle criarVeiculo() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .brand("Honda")
                .model("Civic")
                .version("EXL")
                .year(2022)
                .mileage(30000)
                .price(new BigDecimal("120000.00"))
                .color("Preto")
                .fuel(FuelType.FLEX)
                .transmission(TransmissionType.AUTOMATICO)
                .engine("2.0")
                .bodyType(BodyType.SEDAN)
                .doors(4)
                .plateEnding("5")
                .hasWarranty(false)
                .description("Veículo de teste")
                .singleOwner(true)
                .reviewed(true)
                .featured(false)
                .status(VehicleStatus.DISPONIVEL)
                .slug("honda-civic-exl-2022")
                .images(new ArrayList<>())
                .features(new ArrayList<>())
                .build();

        return vehicle;
    }

    @Test
    void deveListarTodosOsVeiculos() {
        when(vehicleRepository.findAll())
                .thenReturn(List.of(criarVeiculo()));

        var resultado = service.listarTodos();

        assertEquals(1, resultado.size());
        assertEquals("Honda", resultado.get(0).getBrand());

        verify(vehicleRepository).findAll();
    }

    @Test
    void deveBuscarVeiculoPorId() {
        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(criarVeiculo()));

        var resultado = service.buscarPorId(1L);

        assertEquals(1L, resultado.getId());
        assertEquals("Civic", resultado.getModel());

        verify(vehicleRepository).findById(1L);
    }

    @Test
    void deveLancarExcecaoQuandoVeiculoNaoExiste() {
        when(vehicleRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.buscarPorId(99L)
        );
    }

    @Test
    void deveExcluirVeiculoExistente() {
        Vehicle vehicle = criarVeiculo();

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));

        service.excluir(1L);

        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void deveAlterarDestaqueDoVeiculo() {
        Vehicle vehicle = criarVeiculo();

        VehicleFeaturedRequestDTO dto =
                new VehicleFeaturedRequestDTO();
        dto.setFeatured(true);

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var resultado = service.alterarDestaque(1L, dto);

        assertTrue(resultado.getFeatured());
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void deveAlterarStatusDoVeiculo() {
        Vehicle vehicle = criarVeiculo();

        VehicleStatusRequestDTO dto = new VehicleStatusRequestDTO();
        dto.setStatus(VehicleStatus.VENDIDO);

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var resultado = service.alterarStatus(1L, dto);

        assertEquals(VehicleStatus.VENDIDO, resultado.getStatus());
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void deveAdicionarImagemAoVeiculo() {
        Vehicle vehicle = criarVeiculo();

        VehicleImageAdminRequestDTO dto =
                new VehicleImageAdminRequestDTO();
        dto.setImageUrl("https://exemplo.com/civic.jpg");

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var resultado = service.adicionarImagem(1L, dto);

        assertEquals(
                "https://exemplo.com/civic.jpg",
                resultado.getUrl()
        );
        assertEquals(1, vehicle.getImages().size());
        assertTrue(vehicle.getImages().get(0).getIsMain());

        verify(vehicleRepository).save(vehicle);
    }
}