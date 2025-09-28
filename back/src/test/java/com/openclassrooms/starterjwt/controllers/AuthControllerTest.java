package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.mockito.ArgumentMatchers.any;
import java.util.Optional;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    JwtUtils jwtUtils;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    UserRepository userRepository;

    @Mock
    Authentication authentication;

    @InjectMocks
    AuthController authController;

    private LoginRequest loginRequest;
    private SignupRequest signupRequest;
    private User user;
    private UserDetailsImpl userDetails;

    @BeforeEach
    void setup() {
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password");

        signupRequest = new SignupRequest();
        signupRequest.setEmail("newTest@test.com");
        signupRequest.setPassword("password");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("TEST");

        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastName("TEST");
        user.setPassword("password");
        user.setAdmin(false);

        userDetails = UserDetailsImpl.builder()
                .id(user.getId())
                .username(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .password(user.getPassword())
                .admin(user.isAdmin())
                .build();
    }

    @Test
    void authenticateUser_ShouldReturnJwtResponseWhenLoginRequestIsValidAndAdminIsFalse() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt");
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);
        JwtResponse jwtResponse = (JwtResponse) response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("jwt", jwtResponse.getToken());
        assertEquals(1L, jwtResponse.getId());
        assertEquals("test@test.com", jwtResponse.getUsername());
        assertEquals("Test", jwtResponse.getFirstName());
        assertEquals("TEST", jwtResponse.getLastName());
        assertEquals(false, jwtResponse.getAdmin());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(authentication);
        verify(userRepository).findByEmail(userDetails.getUsername());
    }

    @Test
    void authenticateUser_ShouldReturnJwtResponseWhenLoginRequestIsValidAndAdminIsTrue() {
        user.setAdmin(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt");
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertEquals(true, jwtResponse.getAdmin());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(authentication);
        verify(userRepository).findByEmail(userDetails.getUsername());
    }

    @Test
    void registerUser_ShouldReturnOkWithMessageWhenRegisterRequestIsValid() {
        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("password");
        when(userRepository.save(any(User.class))).thenReturn(user);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully!", ((MessageResponse) response.getBody()).getMessage());
        verify(userRepository).existsByEmail(signupRequest.getEmail());
        verify(passwordEncoder).encode(signupRequest.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_ShouldReturnBadRequestWhenEmailIsAlreadyUsed() {
        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error: Email is already taken!", ((MessageResponse) response.getBody()).getMessage());
        verify(userRepository).existsByEmail(signupRequest.getEmail());
    }
}