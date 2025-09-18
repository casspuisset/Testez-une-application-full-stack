package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.validation.*;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SignupRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void testValidSignupRequest() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@test.com");
        req.setFirstName("test");
        req.setLastName("Test");
        req.setPassword("password");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(req);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testBlankFields() {
        SignupRequest req = new SignupRequest();
        req.setEmail("");
        req.setFirstName("");
        req.setLastName("");
        req.setPassword("");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(req);
        assertEquals(7, violations.size());
    }

    @Test
    void testInvalidEmail() {
        SignupRequest req = new SignupRequest();
        req.setEmail("invalidEmail");
        req.setFirstName("test");
        req.setLastName("Test");
        req.setPassword("password");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(req);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void testInvalidLength() {
        SignupRequest req = new SignupRequest();
        req.setEmail("a@a.a");
        req.setFirstName("a");
        req.setLastName("a");
        req.setPassword("123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(req);
        assertEquals(3, violations.size());
    }

    @Test
    void testTooLongEmail() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@test.com");
        req.setFirstName("teeeeeeeeeeeeeeeeeeeest");
        req.setLastName("Test");
        req.setPassword("password");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(req);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")));
    }

    @Test
    void testEqualsAndHashCode() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@test.com");
        req.setFirstName("test");
        req.setLastName("Test");
        req.setPassword("password");

        SignupRequest req2 = new SignupRequest();
        req2.setEmail("test@test.com");
        req2.setFirstName("test");
        req2.setLastName("Test");
        req2.setPassword("password");

        assertEquals(req, req2);
        assertEquals(req.hashCode(), req2.hashCode());

        req2.setEmail("test2@test.com");
        assertNotEquals(req, req2);
        assertNotEquals(req.hashCode(), req2.hashCode());
    }

    @Test
    void testToString() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@test.com");
        req.setFirstName("test");
        req.setLastName("Test");
        req.setPassword("password");

        String str = req.toString();
        assertTrue(str.contains("test@test.com"));
        assertTrue(str.contains("test"));
        assertTrue(str.contains("Test"));
        assertTrue(str.contains("password"));
    }

    @Test
    void testEqualsWithNull() {
        SignupRequest req = new SignupRequest();
        assertNotEquals(req, null);
    }

    @Test
    void testEqualsWithDifferentType() {
        SignupRequest req = new SignupRequest();
        assertNotEquals(req, "string");
    }

    @Test
    void testEqualsWithItself() {
        SignupRequest req = new SignupRequest();
        assertEquals(req, req);
    }

    @Test
    void testEqualsWithNullFields() {
        SignupRequest req = new SignupRequest();
        SignupRequest req2 = new SignupRequest();
        assertEquals(req, req2);
        assertEquals(req.hashCode(), req2.hashCode());
    }

    @Test
    void testToStringWithNullFields() {
        SignupRequest req = new SignupRequest();
        String str = req.toString();
        assertTrue(str.contains("null"));
    }

    @Test
    void testEqualsWithANullField() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@test.com");
        req.setFirstName(null);
        req.setLastName("Test");
        req.setPassword("password");

        SignupRequest req2 = new SignupRequest();
        req2.setEmail("test@test.com");
        req2.setFirstName("test");
        req2.setLastName("Test");
        req2.setPassword("password");

        assertNotEquals(req, req2);
    }

    @Test
    void testHashCodeWithNullFields() {
        SignupRequest req1 = new SignupRequest();
        SignupRequest req2 = new SignupRequest();
        assertEquals(req1.hashCode(), req2.hashCode());
    }

    @Test
    void testEqualsWithDifferentPassword() {
        SignupRequest req1 = new SignupRequest();
        req1.setEmail("user@mail.com");
        req1.setFirstName("Jean");
        req1.setLastName("Dupont");
        req1.setPassword("password");

        SignupRequest req2 = new SignupRequest();
        req2.setEmail("test@test.com");
        req2.setFirstName("test");
        req2.setLastName("Test");
        req2.setPassword("falsePassword");

        assertNotEquals(req1, req2);
    }
}