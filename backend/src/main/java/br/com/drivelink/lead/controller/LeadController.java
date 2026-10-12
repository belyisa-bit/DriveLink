package br.com.drivelink.lead.controller;

import br.com.drivelink.lead.dto.CreateLeadRequest;
import br.com.drivelink.lead.dto.LeadResponse;
import br.com.drivelink.lead.ratelimit.LeadRateLimiter;
import br.com.drivelink.lead.service.LeadService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leads")
public class LeadController {

    private final LeadService leadService;
    private final LeadRateLimiter rateLimiter;

    public LeadController(
            LeadService leadService,
            LeadRateLimiter rateLimiter) {
        this.leadService = leadService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping
    public ResponseEntity<LeadResponse> create(
            @Valid @RequestBody CreateLeadRequest request,
            HttpServletRequest httpRequest) {

        String ip = httpRequest.getRemoteAddr();

        if (!rateLimiter.isAllowed(ip)) {
            return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        }

        LeadResponse response = leadService.create(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }
}