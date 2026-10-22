package br.com.drivelink.lead.service;

import br.com.drivelink.lead.domain.Lead;
import br.com.drivelink.lead.repository.LeadRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeadAdminServiceTest {

    @Mock
    private LeadRepository leadRepository;

    private LeadAdminService leadAdminService;

    @BeforeEach
    void setUp() {
        leadAdminService = new LeadAdminService(leadRepository);
    }

    @Test
    void deveRetornar404QuandoLeadNaoExiste() {

        when(leadRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> leadAdminService.buscarPorId(999L)
        );

        assertEquals(404, exception.getStatusCode().value());

        verify(leadRepository).findById(999L);
    }

    @Test
    void deveExcluirLeadExistente() {

        Lead lead = Lead.builder()
                .id(1L)
                .build();

        when(leadRepository.findById(1L))
                .thenReturn(Optional.of(lead));

        leadAdminService.excluir(1L);

        verify(leadRepository).delete(lead);
    }

    @Test
    void naoDeveExcluirLeadInexistente() {

        when(leadRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResponseStatusException.class,
                () -> leadAdminService.excluir(999L)
        );

        verify(leadRepository, never()).delete(any(Lead.class));
    }
}