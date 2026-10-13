package br.com.drivelink.lead.dto;

import br.com.drivelink.lead.domain.enums.LeadStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateLeadStatusRequest(

        @NotNull(message = "O status é obrigatório.")
        LeadStatus status

) {
}