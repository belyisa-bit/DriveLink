package br.com.drivelink.lead.domain;

import br.com.drivelink.lead.domain.enums.ContactPreference;
import br.com.drivelink.lead.domain.enums.LeadSource;
import br.com.drivelink.lead.domain.enums.LeadStatus;
import br.com.drivelink.vehicle.domain.Vehicle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(nullable = false, length = 150)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "contact_preference", nullable = false, length = 20)
    private ContactPreference contactPreference;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "lgpd_consent", nullable = false)
    private Boolean lgpdConsent;

    @Column(name = "lgpd_consent_at")
    private LocalDateTime lgpdConsentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LeadSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeadStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = LeadStatus.NOVO;
        }

        if (this.source == null) {
            this.source = LeadSource.FORMULARIO;
        }

        if (Boolean.TRUE.equals(this.lgpdConsent)
                && this.lgpdConsentAt == null) {
            this.lgpdConsentAt = LocalDateTime.now();
        }
    }
}