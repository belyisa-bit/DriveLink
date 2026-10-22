package br.com.drivelink.lead.service;

import br.com.drivelink.lead.domain.enums.LeadStatus;
import br.com.drivelink.lead.dto.CreateLeadRequest;
import br.com.drivelink.lead.repository.LeadRepository;
import br.com.drivelink.vehicle.repository.VehicleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeadServiceTest {

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private LeadNotificationService leadNotificationService;

    private LeadService leadService;

    @BeforeEach
    void setUp() {
        leadService = new LeadService(
                leadRepository,
                vehicleRepository,
                leadNotificationService
        );
    }

    @Test
    void deveRejeitarLeadSemConsentimentoLgpd() {

        CreateLeadRequest request = mock(CreateLeadRequest.class);

        when(request.lgpdConsent()).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> leadService.create(request)
        );

        assertEquals(400, exception.getStatusCode().value());

        verifyNoInteractions(
                leadRepository,
                vehicleRepository,
                leadNotificationService
        );
    }
}