package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Filter;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.enums.FilterType;
import com.iker.Lexly.repository.FilterRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.request.FilterRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.NoSuchElementException;
import java.util.Optional;
@Service
@Transactional
public class FilterService {

    private final FilterRepository filterRepository;
    private final QuestionRepository questionRepository;

    public FilterService(FilterRepository filterRepository, QuestionRepository questionRepository) {
        this.filterRepository = filterRepository;
        this.questionRepository = questionRepository;
    }

    public Filter addFilter(Long questionId , FilterRequest filterDTO) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (!optionalQuestion.isPresent()) {
            throw new IllegalArgumentException("Question not found with id: " + questionId);
        }

        Filter filter = new Filter();
        filter.setQuestion(optionalQuestion.get());
        filter.setFilterType(filterDTO.getFilterType());

        switch (filterDTO.getFilterType()) {
            case INTEGER:
                filter.setFilterStartInt(Integer.parseInt(filterDTO.getFilterStart()));
                filter.setFilterEndInt(Integer.parseInt(filterDTO.getFilterEnd()));
                filter.setFilterStartDouble(null); // Clear double values
                filter.setFilterEndDouble(null);
                break;
            case DOUBLE:
                filter.setFilterStartDouble(Double.parseDouble(filterDTO.getFilterStart()));
                filter.setFilterEndDouble(Double.parseDouble(filterDTO.getFilterEnd()));
                filter.setFilterStartInt(null); // Clear int values
                filter.setFilterEndInt(null);
                break;
            default:
                throw new IllegalArgumentException("Invalid filter type: " + filterDTO.getFilterType());
        }
        return filterRepository.save(filter);
    }


    public Filter getFilter(Long filterId) {
        return filterRepository.findById(filterId)
                .orElseThrow(() -> new IllegalArgumentException("Filter not found with id: " + filterId));
    }
    public void deleteFiltersByQuestionId(Long questionId) {
        filterRepository.deleteByQuestionId(questionId);
    }


    public void deleteFilter(Long filterId) {
        if (filterRepository.existsById(filterId)) {
            filterRepository.deleteById(filterId);
        } else {
            throw new IllegalArgumentException("Filter not found with id: " + filterId);
        }
    }

//    @Transactional
//    public Filter updateFilter(Long filterId, Filter updatedFilter) {
//        Filter existingFilter = filterRepository.findById(filterId)
//                .orElseThrow(() -> new NoSuchElementException("Filter not found with id: " + filterId));
//
//        existingFilter.setFilterType(updatedFilter.getFilterType());
//        if (updatedFilter.getFilterType() == FilterType.INTEGER) {
//            existingFilter.setFilterStart(updatedFilter.getFilterStartInt());
//            existingFilter.setFilterEnd(updatedFilter.getFilterEndInt());
//        } else if (updatedFilter.getFilterType() == FilterType.DOUBLE) {
//            existingFilter.setFilterStart(updatedFilter.getFilterStartDouble());
//            existingFilter.setFilterEnd(updatedFilter.getFilterEndDouble());
//        }
//
//        return filterRepository.save(existingFilter);
//    }
}


