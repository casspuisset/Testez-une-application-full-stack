package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SessionMapperTest {

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private UserService userService;

    @Autowired
    private SessionMapper sessionMapper;

    @Test
    void toEntity_ShouldReturnEntityWhenDtoIsValid() {
        SessionDto sessionDto = new SessionDto();
        User user = new User();
        User user2 = new User();
        Teacher teacher = new Teacher();
        sessionDto.setDescription("Description");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(1L, 2L));
        user.setId(1L);
        user2.setId(2L);
        teacher.setId(1L);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(1L)).thenReturn(user);
        when(userService.findById(2L)).thenReturn(user2);

        Session session = sessionMapper.toEntity(sessionDto);

        assertEquals("Description", session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(2, session.getUsers().size());
        assertTrue(session.getUsers().contains(user));
        assertTrue(session.getUsers().contains(user2));
    }

    @Test
    void toDto_ShouldReturnDtoWhenEntityIsValid() {
        Session session = new Session();
        session.setDescription("Description");
        session.setId(1L);
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User(), new User()));

        SessionDto dto = sessionMapper.toDto(session);

        assertEquals("Description", dto.getDescription());
        assertEquals(1L, dto.getId());
        assertEquals(2, dto.getUsers().size());
    }

    @Test
    void toEntity_ShouldReturnEntityListWhenDtoIsAValidList() {
        SessionDto dto = new SessionDto();
        SessionDto dto2 = new SessionDto();
        Teacher teacher = new Teacher();
        Teacher teacher2 = new Teacher();
        User user = new User();
        User user2 = new User();

        dto.setDescription("Description");
        dto.setTeacher_id(1L);
        dto.setUsers(Arrays.asList(1L, 2L));
        dto2.setDescription("Description 2");
        dto2.setTeacher_id(2L);
        dto2.setUsers(Arrays.asList(1L, 2L));
        teacher.setId(1L);
        teacher2.setId(2L);
        user.setId(1L);
        user2.setId(2L);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherService.findById(2L)).thenReturn(teacher2);
        when(userService.findById(1L)).thenReturn(user);
        when(userService.findById(2L)).thenReturn(user2);

        List<SessionDto> dtoList = Arrays.asList(dto, dto2);
        List<Session> entityList = sessionMapper.toEntity(dtoList);

        assertNotNull(entityList);
        assertEquals(2, entityList.size());
        assertEquals("Description", entityList.get(0).getDescription());
        assertEquals("Description 2", entityList.get(1).getDescription());
        assertEquals(teacher, entityList.get(0).getTeacher());
        assertEquals(teacher2, entityList.get(1).getTeacher());
        assertEquals(2, entityList.get(0).getUsers().size());
        assertEquals(2, entityList.get(1).getUsers().size());
    }

    @Test
    void toDto_ShouldReturnDtoListWhenEntityIsAValidList() {
        Session session = new Session();
        Session session2 = new Session();

        session.setId(1L);
        session.setDescription("Description");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User(), new User()));
        session2.setId(2L);
        session2.setDescription("Description 2");
        session2.setTeacher(new Teacher());
        session2.setUsers(Arrays.asList(new User(), new User()));

        List<Session> entityList = Arrays.asList(session, session2);
        List<SessionDto> dtoList = sessionMapper.toDto(entityList);

        assertNotNull(dtoList);
        assertEquals(2, dtoList.size());
        assertEquals("Description", dtoList.get(0).getDescription());
        assertEquals("Description 2", dtoList.get(1).getDescription());
        assertEquals(2, dtoList.get(0).getUsers().size());
        assertEquals(2, dtoList.get(1).getUsers().size());
    }

    @Test
    void toEntity_ShouldReturnNullWhenSessionDtoIsNull() {
        Session session = sessionMapper.toEntity((SessionDto) null);

        assertNull(session);
    }

    @Test
    void toDto_ShouldReturnNullWhenSessionIsNull() {
        SessionDto sessionDto = sessionMapper.toDto((Session) null);

        assertNull(sessionDto);
    }

    @Test
    void toEntity_ShouldReturnNullWhenListIsNull() {
        List<Session> entityList = sessionMapper.toEntity((List<SessionDto>) null);

        assertNull(entityList);
    }

    @Test
    void toDto_ShouldReturnNullWhenListIsEmpty() {
        List<SessionDto> dtoList = sessionMapper.toDto((List<Session>) null);

        assertNull(dtoList);
    }
}