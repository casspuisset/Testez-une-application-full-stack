package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class AuthTokenFilterTest {

    @Mock
    AuthTokenFilter authTokenFilter;

    private JwtUtils jwtUtils;
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() throws Exception {
        authTokenFilter = new AuthTokenFilter();

        jwtUtils = mock(JwtUtils.class);
        userDetailsService = mock(UserDetailsServiceImpl.class);

        Field jwtUtilsField = AuthTokenFilter.class.getDeclaredField("jwtUtils");
        jwtUtilsField.setAccessible(true);
        jwtUtilsField.set(authTokenFilter, jwtUtils);

        Field userDetailsServiceField = AuthTokenFilter.class.getDeclaredField("userDetailsService");
        userDetailsServiceField.setAccessible(true);
        userDetailsServiceField.set(authTokenFilter, userDetailsService);
    }

    @Test
    void doFilterInternal_ShouldSetUserAuthentificationWhenTokenIsValid() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer valid.token");
        when(jwtUtils.validateJwtToken("valid.token")).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken("valid.token")).thenReturn("user");

        var userDetails = mock(org.springframework.security.core.userdetails.UserDetails.class);

        when(userDetailsService.loadUserByUsername("user")).thenReturn(userDetails);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_ShouldNotReturnAuthenticationIfTokenIsInvalid() throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer invalid.token");
        when(jwtUtils.validateJwtToken("invalid.token")).thenReturn(false);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_ShouldNotReturnAuthenticationIfHeaderDoesNotHaveAuthorization()
            throws ServletException, IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain filterChain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn(null);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

}