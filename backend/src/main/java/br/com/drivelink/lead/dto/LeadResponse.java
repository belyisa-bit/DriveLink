package br.com.drivelink.lead.dto;

import br.com.drivelink.lead.domain.Lead;
import br.com.drivelink.lead.domain.enums.ContactPreference;
import br.com.drivelink.lead.domain.enums.LeadSource;
import br.com.drivelink.lead.domain.enums.LeadStatus;

import java.time.LocalDateTime;

public record LeadResponse(
    Long id,
    String name,
    String phone,
    String email,
    Long vehicleId,
    ContactPreference contactPreference,
    String message,
    boolean lgpdConsent,
    LocalDateTime lgpdConsentAt,
    LeadSource source,
    LeadStatus status,
    LocalDateTime createdAt
) {

    public static LeadResponse from(Lead lead) {
        return new LeadResponse(
            lead.getId(),
            lead.getName(),
            lead.getPhone(),
            lead.getEmail(),
            lead.getVehicle() != null
                ? lead.getVehicle().getId()
                : null,
            lead.getContactPreference(),
            lead.getMessage(),
            Boolean.TRUE.equals(lead.getLgpdConsent()),
            lead.getLgpdConsentAt(),
            lead.getSource(),
            lead.getStatus(),
            lead.getCreatedAt()
        );
    }
}