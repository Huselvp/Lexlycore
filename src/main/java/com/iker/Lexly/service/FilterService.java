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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@Transactional
public class FilterService {

    Logger logger = LoggerFactory.getLogger(FilterService.class);
    private final FilterRepository filterRepository;
    private final QuestionRepository questionRepository;

    public FilterService(FilterRepository filterRepository, QuestionRepository questionRepository) {
        this.filterRepository = filterRepository;
        this.questionRepository = questionRepository;
    }

    public Filter addFilter(Long questionId, FilterRequest filterDTO) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isEmpty()) {
            logger.error("Question not found with id:{}" , questionId);
        }
        Filter filter = new Filter();
        filter.setQuestion(optionalQuestion.get());
        filter.setFilterType(filterDTO.getFilterType());
            switch (filterDTO.getFilterType()) {
                case INTEGER:
                    filter.setFilterStartInt(Integer.parseInt(filterDTO.getFilterStart()));
                    filter.setFilterEndInt(Integer.parseInt(filterDTO.getFilterEnd()));
                    break;
                case DOUBLE:
                    filter.setFilterStartDouble(Double.parseDouble(filterDTO.getFilterStart()));
                    filter.setFilterEndDouble(Double.parseDouble(filterDTO.getFilterEnd()));
                    break;
                default:
                    throw new IllegalArgumentException("Invalid filter type: " + filterDTO.getFilterType());
            }
        Filter savedFilter = filterRepository.save(filter);
        logger.info("Created Block: {}" , savedFilter);
        return savedFilter;
    }


    public Filter getFilter(Long filterId) {
        return filterRepository.findById(filterId)
                .orElseThrow(() -> new IllegalArgumentException("Filter not found with id: " + filterId));
    }
    public Filter getFilterByQuestionId(Long questionId) {
         return filterRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new IllegalArgumentException("question not found with id: " + questionId));
    }
    public void deleteFiltersByQuestionId(Long questionId) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isEmpty()) {
            String errorMessage = "Question not found with id: " + questionId;
            logger.error(errorMessage);
            throw new IllegalArgumentException("Question not found with id: " + questionId);
        }
        filterRepository.deleteByQuestionId(questionId);
    }


    public void deleteFilter(Long filterId) {
        if (filterRepository.existsById(filterId)) {
            filterRepository.deleteById(filterId);
        } else {
            throw new IllegalArgumentException("Filter not found with id: " + filterId);
        }
    }
@Transactional
public Filter updateFilter(Long filterId, FilterRequest updatedFilter) {
    Filter existingFilter = filterRepository.findById(filterId)
            .orElseThrow(() -> {String errorMessage = "Filter not found with id: " + filterId;
                logger.error(errorMessage);
                return new NoSuchElementException(errorMessage);
            });
    FilterType newFilterType = updatedFilter.getFilterType();
    existingFilter.setFilterType(newFilterType != null ? newFilterType : existingFilter.getFilterType());
    // Clear previous values if the filter type changes
    if (newFilterType != null && newFilterType != existingFilter.getFilterType()) {
        existingFilter.setFilterStartInt(null);
        existingFilter.setFilterEndInt(null);
        existingFilter.setFilterStartDouble(null);
        existingFilter.setFilterEndDouble(null);
    }
    // Set filter values based on the filter type
        switch (existingFilter.getFilterType()) {
            case INTEGER:
                setIntegerFilterValues(existingFilter, updatedFilter);
                break;
            case DOUBLE:
                setDoubleFilterValues(existingFilter, updatedFilter);
                break;
            default:
                throw new IllegalArgumentException("Invalid filter type: " + updatedFilter.getFilterType());
        }
    Filter savedFilter = filterRepository.save(existingFilter);
    logger.info("update filter successfully : {}" , savedFilter);
    return savedFilter;
}

    private void setIntegerFilterValues(Filter existingFilter, FilterRequest updatedFilter) {
        if (updatedFilter.getFilterStart() != null) {
            existingFilter.setFilterStartInt(Integer.parseInt(updatedFilter.getFilterStart()));
        }
        if (updatedFilter.getFilterEnd() != null) {
            existingFilter.setFilterEndInt(Integer.parseInt(updatedFilter.getFilterEnd()));
        }

    }

    private void setDoubleFilterValues(Filter existingFilter, FilterRequest updatedFilter) {
        if (updatedFilter.getFilterStart() != null) {
            existingFilter.setFilterStartDouble(Double.parseDouble(updatedFilter.getFilterStart()));
        }
        if (updatedFilter.getFilterEnd() != null) {
            existingFilter.setFilterEndDouble(Double.parseDouble(updatedFilter.getFilterEnd()));
        }

    }

}


