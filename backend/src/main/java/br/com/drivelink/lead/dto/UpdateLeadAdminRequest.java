package br.com.drivelink.lead.dto;

import br.com.drivelink.lead.domain.enums.ContactPreference;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateLeadAdminRequest(

        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
        String name,

        @NotBlank(message = "O telefone é obrigatório.")
        @Size(max = 30, message = "O telefone deve ter no máximo 30 caracteres.")
        String phone,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Informe um e-mail válido.")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres.")
        String email,

        @NotNull(message = "A preferência de contato é obrigatória.")
        ContactPreference contactPreference,

        String message
) {
}