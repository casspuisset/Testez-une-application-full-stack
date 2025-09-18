package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @Test
    void dtoToSession() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user = new User();
        user.setId(1L);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setDescription("description");
        sessionDto.setTeacher_id(teacher.getId());
        sessionDto.setUsers(Arrays.asList(user.getId()));

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        assertEquals(sessionDto.getId(), session.getId());
    }

    @Test
    void sessionToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user = new User();
        user.setId(1L);

        Session session = new Session();
        session.setId(1L);
        session.setDescription("description");
        session.setTeacher(teacher);
        session.setUsers(Arrays.asList(user));

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNotNull(sessionDto);
        assertEquals(session.getId(), sessionDto.getId());
    }
}