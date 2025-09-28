package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void findById_ExistingTeacher_ReturnsTeacher() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher returnedTeacher = teacherService.findById(1L);

        assertEquals(teacher, returnedTeacher);
        verify(teacherRepository).findById(1L);
    }

    @Test
    void findById_ShouldReturnNullIfTeacherDoesNotExist() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        Teacher teacher = teacherService.findById(1L);

        assertNull(teacher);
    }

    @Test
    void findAll_ShouldReturnAllTeachers() {
        Teacher teacher = new Teacher();
        Teacher teacher2 = new Teacher();

        teacher.setId(1L);
        teacher2.setId(2L);

        List<Teacher> teachers = Arrays.asList(teacher, teacher2);

        when(teacherRepository.findAll()).thenReturn(teachers);

        List<Teacher> returnedList = teacherService.findAll();

        assertEquals(teachers, returnedList);
        verify(teacherRepository).findAll();
    }

}