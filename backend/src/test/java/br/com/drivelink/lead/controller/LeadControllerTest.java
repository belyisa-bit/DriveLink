
package br.com.drivelink.lead.controller;

import br.com.drivelink.lead.dto.CreateLeadRequest;
import br.com.drivelink.lead.dto.LeadResponse;
import br.com.drivelink.lead.domain.enums.ContactPreference;
import br.com.drivelink.lead.service.LeadService;
import br.com.drivelink.lead.ratelimit.LeadRateLimiter;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeadControllerTest {

    @Mock
    private LeadService leadService;

    @Mock
    private LeadRateLimiter rateLimiter;

    @Mock
    private HttpServletRequest httpRequest;

    @InjectMocks
    private LeadController leadController;

    private CreateLeadRequest request;

    @BeforeEach
    void setUp() {
        request = new CreateLeadRequest(
                "Maria Silva",
                "81999999999",
                "maria@email.com",
                null,
                ContactPreference.EMAIL,
                "Tenho interesse no veículo",
                true,
                null
        );

        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
    }

    @Test
    void deveCriarLeadQuandoIPForPermitido() {
        LeadResponse resposta = mock(LeadResponse.class);

        when(rateLimiter.isAllowed("127.0.0.1")).thenReturn(true);
        when(leadService.create(request)).thenReturn(resposta);

        ResponseEntity<LeadResponse> resultado =
                leadController.create(request, httpRequest);

        assertEquals(HttpStatus.CREATED, resultado.getStatusCode());
        assertEquals(resposta, resultado.getBody());

        verify(leadService).create(request);
        verify(rateLimiter).isAllowed("127.0.0.1");
    }

    @Test
    void deveRetornar429QuandoLimiteForExcedido() {
        when(rateLimiter.isAllowed("127.0.0.1")).thenReturn(false);

        ResponseEntity<LeadResponse> resultado =
                leadController.create(request, httpRequest);

        assertEquals(
                HttpStatus.TOO_MANY_REQUESTS,
                resultado.getStatusCode()
        );
        assertNull(resultado.getBody());

        verify(leadService, never()).create(any());
    }
}
