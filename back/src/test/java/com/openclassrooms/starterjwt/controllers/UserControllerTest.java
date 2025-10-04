package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

public class UserControllerTest {
    @Mock
    private UserService userService;
    @Mock
    private UserMapper userMapper;
    @Mock
    private UserDetails userDetails;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void findById_shouldReturnUserWithCorrectId() {
        User user = new User();
        UserDto userDto = new UserDto();
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(response.getStatusCodeValue(), 200);
        assertEquals(userDto, response.getBody());
    }

    @Test
    void findById_ShouldReturnNotFoundIfUserDoesNotExist() {
        when(userService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(response.getStatusCodeValue(), 404);
    }

    @Test
    void findById_shouldReturnBadRequestWhenIdIsNotCorrect() {
        ResponseEntity<?> response = userController.findById(" ");
        assertEquals(response.getStatusCodeValue(), 400);
    }

    @Test
    void save_ShouldDeleteUserIfIdIsCorrect() {
        User user = new User();
        user.setEmail("test@test.com");

        when(userService.findById(1L)).thenReturn(user);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        ResponseEntity<?> response = userController.save("1");

        assertEquals(response.getStatusCodeValue(), 200);
        verify(userService).delete(1L);
    }

    @Test
    void save_ShouldReturnNotFoundWhenUserIsNull() {
        when(userService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(response.getStatusCodeValue(), 404);
    }

    @Test
    void save_shouldReturnUnauthorized() {
        User user = new User();
        user.setEmail("test@test.com");

        when(userService.findById(1L)).thenReturn(user);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test2@test.com");

        ResponseEntity<?> response = userController.save("1");

        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatusCodeValue());
        verify(userService, never()).delete(anyLong());
    }

    @Test
    void save_ShouldReturnBadRequestIfIdIsNotCorrect() {
        ResponseEntity<?> response = userController.save(" ");

        assertEquals(response.getStatusCodeValue(), 400);
    }

}
