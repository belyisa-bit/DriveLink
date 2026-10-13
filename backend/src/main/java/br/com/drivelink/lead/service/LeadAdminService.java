package br.com.drivelink.lead.service;

import br.com.drivelink.lead.domain.Lead;
import br.com.drivelink.lead.domain.enums.LeadStatus;
import br.com.drivelink.lead.dto.LeadAdminResponseDTO;
import br.com.drivelink.lead.dto.UpdateLeadAdminRequest;
import br.com.drivelink.lead.dto.UpdateLeadStatusRequest;
import br.com.drivelink.lead.repository.LeadRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LeadAdminService {

    private final LeadRepository leadRepository;

    public LeadAdminService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @Transactional(readOnly = true)
    public List<LeadAdminResponseDTO> listarTodos() {

        return leadRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(LeadAdminResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeadAdminResponseDTO buscarPorId(Long id) {

        Lead lead = buscarLead(id);

        return LeadAdminResponseDTO.from(lead);
    }

    @Transactional
    public LeadAdminResponseDTO atualizar(
            Long id,
            UpdateLeadAdminRequest request) {

        Lead lead = buscarLead(id);

        lead.setName(request.name().trim());
        lead.setPhone(request.phone().trim());
        lead.setEmail(request.email().trim());
        lead.setContactPreference(request.contactPreference());
        lead.setMessage(request.message());

        Lead leadAtualizado = leadRepository.save(lead);

        return LeadAdminResponseDTO.from(leadAtualizado);
    }

    @Transactional
    public LeadAdminResponseDTO atualizarStatus(
            Long id,
            UpdateLeadStatusRequest request) {

        Lead lead = buscarLead(id);

        lead.setStatus(request.status());

        Lead leadAtualizado = leadRepository.save(lead);

        return LeadAdminResponseDTO.from(leadAtualizado);
    }

    @Transactional
    public void excluir(Long id) {

        Lead lead = buscarLead(id);

        leadRepository.delete(lead);
    }

    private Lead buscarLead(Long id) {

        return leadRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lead não encontrado."
                ));
    }
}