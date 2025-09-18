package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.validation.*;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LoginRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void testGettersAndSetters() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("password");

        assertEquals("test@test.com", req.getEmail());
        assertEquals("password", req.getPassword());
    }

    @Test
    void testNotBlankValidation() {
        LoginRequest req = new LoginRequest();
        req.setEmail("");
        req.setPassword("   ");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(req);
        assertEquals(2, violations.size());
    }

    @Test
    void testValidLoginRequest() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("password");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(req);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testNullFields() {
        LoginRequest req = new LoginRequest();
        req.setEmail(null);
        req.setPassword(null);

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(req);
        assertEquals(2, violations.size());
    }
}