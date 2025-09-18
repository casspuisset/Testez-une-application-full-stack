package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MessageResponseTest {

    @Test
    void testConstructorAndGetter() {
        MessageResponse response = new MessageResponse("message");
        assertEquals("message", response.getMessage());
    }

    @Test
    void testSetter() {
        MessageResponse response = new MessageResponse("message");
        response.setMessage("edit message");
        assertEquals("edit message", response.getMessage());
    }

    @Test
    void testNullMessage() {
        MessageResponse response = new MessageResponse(null);
        assertNull(response.getMessage());
        response.setMessage("message");
        assertEquals("message", response.getMessage());
    }
}