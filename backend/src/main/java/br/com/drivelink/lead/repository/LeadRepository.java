package br.com.drivelink.lead.repository;

import br.com.drivelink.lead.domain.Lead;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}