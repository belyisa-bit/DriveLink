
package br.com.drivelink.lead.controller;

import br.com.drivelink.lead.dto.LeadAdminResponseDTO;
import br.com.drivelink.lead.dto.UpdateLeadAdminRequest;
import br.com.drivelink.lead.dto.UpdateLeadStatusRequest;
import br.com.drivelink.lead.domain.enums.ContactPreference;
import br.com.drivelink.lead.domain.enums.LeadStatus;
import br.com.drivelink.lead.service.LeadAdminService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeadAdminControllerTest {

    @Mock
    private LeadAdminService service;

    @InjectMocks
    private LeadAdminController controller;

    @Test
    void deveListarLeads() {
        when(service.listarTodos()).thenReturn(List.of());

        ResponseEntity<List<LeadAdminResponseDTO>> resultado =
                controller.listarTodos();

        assertEquals(HttpStatus.OK, resultado.getStatusCode());
        assertEquals(0, resultado.getBody().size());
    }

    @Test
    void deveExcluirLeadERetornar204() {
        ResponseEntity<Void> resultado = controller.excluir(1L);

        assertEquals(HttpStatus.NO_CONTENT, resultado.getStatusCode());
        verify(service).excluir(1L);
    }

    @Test
    void deveAtualizarStatusDoLead() {
        UpdateLeadStatusRequest request =
                new UpdateLeadStatusRequest(LeadStatus.NOVO);

        LeadAdminResponseDTO resposta =
                mock(LeadAdminResponseDTO.class);

        when(service.atualizarStatus(1L, request))
                .thenReturn(resposta);

        ResponseEntity<LeadAdminResponseDTO> resultado =
                controller.atualizarStatus(1L, request);

        assertEquals(HttpStatus.OK, resultado.getStatusCode());
        assertEquals(resposta, resultado.getBody());
    }

    @Test
    void deveAtualizarDadosDoLead() {
        UpdateLeadAdminRequest request =
                new UpdateLeadAdminRequest(
                        "Maria Silva",
                        "81999999999",
                        "maria@email.com",
                        ContactPreference.EMAIL,
                        "Tenho interesse"
                );

        LeadAdminResponseDTO resposta =
                mock(LeadAdminResponseDTO.class);

        when(service.atualizar(1L, request)).thenReturn(resposta);

        ResponseEntity<LeadAdminResponseDTO> resultado =
                controller.atualizar(1L, request);

        assertEquals(HttpStatus.OK, resultado.getStatusCode());
        assertEquals(resposta, resultado.getBody());
    }
}
