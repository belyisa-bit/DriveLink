package br.com.drivelink.lead.dto;

import br.com.drivelink.lead.domain.enums.ContactPreference;
import br.com.drivelink.lead.domain.enums.LeadSource;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateLeadRequest(

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    String name,

    @NotBlank(message = "O telefone é obrigatório.")
    @Size(max = 30, message = "O telefone deve ter no máximo 30 caracteres.")
    @Pattern(
        regexp = "^[0-9+() .-]{8,30}$",
        message = "Informe um telefone válido."
    )
    String phone,

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres.")
    String email,

    Long vehicleId,

    @NotNull(message = "A preferência de contato é obrigatória.")
    ContactPreference contactPreference,

    @Size(max = 5000, message = "A mensagem deve ter no máximo 5000 caracteres.")
    String message,

    @NotNull(message = "O consentimento LGPD é obrigatório.")
    Boolean lgpdConsent,

    LeadSource source

) {
}