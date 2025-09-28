package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    SessionController sessionController;

    @Test
    void findById_shouldReturnSessionWhenIdIsFound() {
        Long sessionId = 1L;
        Session session = new Session();
        SessionDto dto = new SessionDto();
        session.setId(sessionId);
        dto.setId(sessionId);

        when(sessionService.getById(anyLong())).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        var response = sessionController.findById("1");
        var expectedSessionDto = (SessionDto) response.getBody();

        assertNotNull(expectedSessionDto);
        assertEquals(expectedSessionDto.getId(), dto.getId());

    }

    @Test
    public void findById_ShouldReturnBadRequestIfSessionNotFound() {
        ResponseEntity<?> response = sessionController.findById(" ");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void findById_shouldReturnNullSessionIfSessionNotFound() {
        Long sessionId = 1L;
        when(sessionService.getById(sessionId)).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(sessionService).getById(sessionId);
    }

    @Test
    void findAll_shouldReturnAllSessionsIfSessionExists() {
        Session session = new Session();
        Session session2 = new Session();
        session.setId(1L);
        session2.setId(2L);

        List<Session> allSessions = Arrays.asList(session, session2);
        List<SessionDto> allSessionsDto = Arrays.asList(new SessionDto(), new SessionDto());

        when(sessionService.findAll()).thenReturn(allSessions);
        when(sessionMapper.toDto(allSessions)).thenReturn(allSessionsDto);

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(allSessionsDto, response.getBody());
        verify(sessionService).findAll();
    }

    @Test
    void findAll_shouldReturnEmptyListIfSessionDoesNotExist() {
        List<Session> emptyList = Arrays.asList();
        when(sessionService.findAll()).thenReturn(emptyList);

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(((List<?>) response.getBody()).isEmpty());
        verify(sessionService).findAll();
    }

    @Test
    public void create_shouldReturnSessionWhenSessionIsCreated() {
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();
        session.setId(1L);
        sessionDto.setId(1L);

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.create(sessionDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sessionDto, response.getBody());
        verify(sessionService).create(session);
        verify(sessionMapper).toEntity(sessionDto);
        verify(sessionMapper).toDto(session);
    }

    @Test
    void update_shouldReturnUpdatedSessionWhenSessionIsUpdated() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(sessionId);

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(sessionId, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(sessionDto, response.getBody());
        verify(sessionMapper).toEntity(sessionDto);
        verify(sessionService).update(sessionId, session);
        verify(sessionMapper).toDto(session);
    }

    @Test
    public void update_shouldReturnBadRequestWhenSessionIdIsInvalid() {
        SessionDto sessionDto = new SessionDto();

        ResponseEntity<?> response = sessionController.update("", sessionDto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    public void save_shouldDeleteSessionThenReturnOkWhenSessionFound() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);

        when(sessionService.getById(sessionId)).thenReturn(session);

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService).getById(sessionId);
        verify(sessionService).delete(sessionId);
    }

    @Test
    public void save_shouldReturnBadRequestWhenIdIsInvalid() {

        ResponseEntity<?> response = sessionController.save("");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    public void save_shouldReturnBadRequestWhenSessionDoesNotExist() {
        Long sessionId = 1L;

        when(sessionService.getById(sessionId)).thenReturn(null);

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(sessionService).getById(sessionId);
    }

    @Test
    public void participate_shouldReturnOkWhenIdIsValid() {
        Long sessionId = 1L;
        Long userId = 2L;

        ResponseEntity<?> response = sessionController.participate("1", "2");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService).participate(sessionId, userId);
    }

    @Test
    public void participate_shouldReturnBadRequestWhenIdIsValid() {

        ResponseEntity<?> response = sessionController.participate("1", " ");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void noLongerParticipate_shouldReturnOkWhenIdIsValid() {
        Long sessionId = 1L;
        Long userId = 2L;

        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "2");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService).noLongerParticipate(sessionId, userId);
    }

    @Test
    public void noLongerParticipate_shouldReturnBadRequestWhenIdIsValid() {

        ResponseEntity<?> response = sessionController.noLongerParticipate("1", " ");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
