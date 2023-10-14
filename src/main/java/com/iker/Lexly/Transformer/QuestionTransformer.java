package com.iker.Lexly.Transformer;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.Question;
import org.springframework.stereotype.Component;

@Component
public class QuestionTransformer extends Transformer<Question, QuestionDTO>{

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Question question = new Question();
           question.setId(dto.getId());
           question.setQuestionText(dto.getQuestionText());

           return question;
        }
    }

    @Override
    public QuestionDTO toDTO(Question entity) {
        if (entity == null) {
            return null;
        } else {
            return new QuestionDTO(entity.getId(), entity.getQuestionText());
        }
    }

}