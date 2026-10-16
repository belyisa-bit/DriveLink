
package br.com.drivelink.auth;

import br.com.drivelink.auth.dto.LoginRequest;
import br.com.drivelink.auth.dto.LoginResponse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController controller;

    @Test
    void deveEncaminharLoginAoServico() {
        LoginRequest request =
                new LoginRequest("admin@example.com", "senha-teste");

        LoginResponse resposta =
                new LoginResponse("token-teste", "Bearer", 3600);

        when(authService.login(request)).thenReturn(resposta);

        LoginResponse resultado = controller.login(request);

        assertEquals("token-teste", resultado.token());
        assertEquals("Bearer", resultado.tokenType());
        assertEquals(3600, resultado.expiresIn());

        verify(authService).login(request);
    }
}
