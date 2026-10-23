package br.com.drivelink.lead.service;

import br.com.drivelink.lead.domain.Lead;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
public class LeadNotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String from;

    @Value("${app.mail.to:}")
    private String to;

    public LeadNotificationService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    @Async
    public void enviarNovoLead(Lead lead) {
        if (to == null || to.isBlank()) {
            System.err.println(
                "Notificação de lead não enviada: destinatário não configurado."
            );
            return;
        }

        if (mailSender == null) {
            System.err.println(
                "NotificaÃ§Ã£o de lead nÃ£o enviada: SMTP nÃ£o configurado."
            );
            return;
        }

        try {
            MimeMessage mensagem = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                mensagem,
                true,
                StandardCharsets.UTF_8.name()
            );

            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }

            helper.setTo(to);
            helper.setSubject("DriveLink - Novo interessado cadastrado");
            helper.setText(montarHtml(lead), true);

            mailSender.send(mensagem);

        } catch (MailException | MessagingException | IOException e) {
            // Não registrar nome, telefone, e-mail ou mensagem do interessado.
            System.err.println(
                "Não foi possível enviar a notificação de novo lead: "
                    + e.getClass().getSimpleName()
            );
        }
    }

    private String montarHtml(Lead lead) throws IOException {
        ClassPathResource resource = new ClassPathResource(
            "templates/email/novo-lead.html"
        );

        String html;

        try (InputStream input = resource.getInputStream()) {
            html = new String(
                input.readAllBytes(),
                StandardCharsets.UTF_8
            );
        }

        String nome = escaparHtml(lead.getName());
        String telefone = escaparHtml(lead.getPhone());
        String email = escaparHtml(lead.getEmail());
        String preferencia = escaparHtml(
            lead.getContactPreference() != null
                ? lead.getContactPreference().toString()
                : "Não informada"
        );
        String mensagem = escaparHtml(
            lead.getMessage() != null && !lead.getMessage().isBlank()
                ? lead.getMessage()
                : "Nenhuma mensagem informada."
        );

        String veiculo = "Não informado";

        if (lead.getVehicle() != null) {
            veiculo = escaparHtml(
                lead.getVehicle().getBrand()
                    + " "
                    + lead.getVehicle().getModel()
            );
        }

        String data = lead.getCreatedAt() != null
            ? lead.getCreatedAt().format(
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            )
            : "Não disponível";

        html = html.replace("{{nome}}", nome);
        html = html.replace("{{telefone}}", telefone);
        html = html.replace("{{email}}", email);
        html = html.replace("{{veiculo}}", veiculo);
        html = html.replace("{{preferencia}}", preferencia);
        html = html.replace("{{mensagem}}", mensagem);
        html = html.replace("{{data}}", escaparHtml(data));

        return html;
    }

    private String escaparHtml(String valor) {
        if (valor == null) {
            return "";
        }

        return valor
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}
