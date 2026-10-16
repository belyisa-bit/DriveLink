package br.com.drivelink.auth;

import br.com.drivelink.auth.domain.AdminUser;
import br.com.drivelink.auth.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements ApplicationRunner {

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;

    public AdminUserInitializer(
            AdminUserRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.password:}") String password) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {

        if (email.isBlank() && password.isBlank()) {
            return;
        }

        if (email.isBlank() || password.isBlank()) {
            throw new IllegalStateException(
                    "Configure o e-mail e a senha do administrador."
            );
        }

        if (password.length() < 12) {
            throw new IllegalStateException(
                    "A senha inicial do administrador deve ter pelo menos 12 caracteres."
            );
        }

        if (repository.existsByEmailIgnoreCase(email)) {
            return;
        }

        AdminUser admin = new AdminUser();
        admin.setEmail(email.trim());
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setActive(true);

        repository.save(admin);
    }
}