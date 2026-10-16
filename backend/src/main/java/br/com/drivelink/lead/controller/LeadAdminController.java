package br.com.drivelink.lead.controller;

import br.com.drivelink.lead.dto.LeadAdminResponseDTO;
import br.com.drivelink.lead.dto.UpdateLeadAdminRequest;
import br.com.drivelink.lead.dto.UpdateLeadStatusRequest;
import br.com.drivelink.lead.service.LeadAdminService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/leads")
public class LeadAdminController {

    private final LeadAdminService leadAdminService;

    public LeadAdminController(LeadAdminService leadAdminService) {
        this.leadAdminService = leadAdminService;
    }

    @GetMapping
    public ResponseEntity<List<LeadAdminResponseDTO>> listarTodos() {

        return ResponseEntity.ok(
                leadAdminService.listarTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadAdminResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leadAdminService.buscarPorId(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadAdminResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeadAdminRequest request) {

        return ResponseEntity.ok(
                leadAdminService.atualizar(id, request)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LeadAdminResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeadStatusRequest request) {

        return ResponseEntity.ok(
                leadAdminService.atualizarStatus(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id) {

        leadAdminService.excluir(id);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}