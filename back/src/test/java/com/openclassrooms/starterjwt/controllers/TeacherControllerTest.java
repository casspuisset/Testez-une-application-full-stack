package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    @Test
    void findById_ShouldReturnTeacherWhenTeacherExists() {
        Long teacherId = 1L;
        Teacher teacher = new Teacher();
        TeacherDto teacherDto = new TeacherDto();
        teacher.setId(teacherId);
        teacherDto.setId(teacherId);

        when(teacherService.findById(teacherId)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(teacherDto, response.getBody());
        verify(teacherService).findById(teacherId);
        verify(teacherMapper).toDto(teacher);
    }

    @Test
    void findById_ShouldReturnEmptyRequestWhenNoTeacherIsFound() {
        Long teacherId = 1L;

        when(teacherService.findById(teacherId)).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(teacherService).findById(teacherId);
    }

    @Test
    void findById_ShouldReturnBadRequestWhenIdIsNotValid() {
        ResponseEntity<?> response = teacherController.findById(" ");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void findAll_ShouldReturnAllTeachers() {
        Teacher teacher = new Teacher();
        Teacher teacher2 = new Teacher();
        TeacherDto tdo = new TeacherDto();
        TeacherDto tdo2 = new TeacherDto();
        teacher.setId(1L);
        teacher2.setId(2L);
        tdo.setId(1L);
        tdo2.setId(2L);

        List<Teacher> allTeachers = Arrays.asList(teacher, teacher2);
        List<TeacherDto> allTeacherDtos = Arrays.asList(tdo, tdo2);

        when(teacherService.findAll()).thenReturn(allTeachers);
        when(teacherMapper.toDto(allTeachers)).thenReturn(allTeacherDtos);

        ResponseEntity<?> response = teacherController.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(allTeacherDtos, response.getBody());
    }

}