package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.repository.DocumentQuestionValueRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PDFGenerationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private DocumentQuestionValueRepository documentQuestionValueRepository;

    public void generatePDFDocument(Long userId) {
    }
}