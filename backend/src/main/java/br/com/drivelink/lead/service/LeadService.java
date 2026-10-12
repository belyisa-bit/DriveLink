package br.com.drivelink.lead.service;

import br.com.drivelink.lead.domain.Lead;
import br.com.drivelink.lead.domain.enums.LeadSource;
import br.com.drivelink.lead.domain.enums.LeadStatus;
import br.com.drivelink.lead.dto.CreateLeadRequest;
import br.com.drivelink.lead.dto.LeadResponse;
import br.com.drivelink.lead.repository.LeadRepository;
import br.com.drivelink.vehicle.domain.Vehicle;
import br.com.drivelink.vehicle.repository.VehicleRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final VehicleRepository vehicleRepository;

    public LeadService(
            LeadRepository leadRepository,
            VehicleRepository vehicleRepository) {
        this.leadRepository = leadRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public LeadResponse create(CreateLeadRequest request) {

        if (!Boolean.TRUE.equals(request.lgpdConsent())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "O consentimento LGPD é obrigatório."
            );
        }

        Vehicle vehicle = null;

        if (request.vehicleId() != null) {
            vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Veículo não encontrado."
                ));
        }

        Lead lead = Lead.builder()
            .name(request.name().trim())
            .phone(request.phone().trim())
            .email(request.email().trim())
            .vehicle(vehicle)
            .contactPreference(request.contactPreference())
            .message(request.message())
            .lgpdConsent(true)
            .lgpdConsentAt(LocalDateTime.now())
            .source(request.source() != null
                ? request.source()
                : LeadSource.FORMULARIO)
            .status(LeadStatus.NOVO)
            .build();

        Lead savedLead = leadRepository.save(lead);

        return LeadResponse.from(savedLead);
    }
}