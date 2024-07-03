package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Filter;
import com.iker.Lexly.Entity.Question;

import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.Entity.enums.FilterType;
import com.iker.Lexly.repository.FilterRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.SubQuestionRepository;
import com.iker.Lexly.request.FilterRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@Transactional
public class FilterService {

    Logger logger = LoggerFactory.getLogger(FilterService.class);
    private final FilterRepository filterRepository;
    private final QuestionRepository questionRepository;
    private final SubQuestionRepository subQuestionRepository;
    public FilterService(FilterRepository filterRepository, QuestionRepository questionRepository, SubQuestionRepository subQuestionRepository) {
        this.filterRepository = filterRepository;
        this.questionRepository = questionRepository;
        this.subQuestionRepository = subQuestionRepository;
    }

    public Filter addFilterToQuestion(Long questionId, FilterRequest filterDTO) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isEmpty()) {
            logger.error("Question not found with id:{}", questionId);
            return null; // or throw an exception
        }
        return createAndSaveFilter(optionalQuestion.get(), null, filterDTO);
    }

    public Filter addFilterToSubQuestion(Long subQuestionId, FilterRequest filterDTO) {
        Optional<SubQuestion> optionalSubQuestion = subQuestionRepository.findById(subQuestionId);
        if (optionalSubQuestion.isEmpty()) {
            logger.error("SubQuestion not found with id:{}", subQuestionId);
            return null; // or throw an exception
        }
        return createAndSaveFilter(null, optionalSubQuestion.get(), filterDTO);
    }

//    private Filter createAndSaveFilter(Question question, SubQuestion subQuestion, FilterRequest filterDTO) {
//        Filter filter = new Filter();
//        if (question != null) {
//            filter.setQuestion(question);
//        } else if (subQuestion != null) {
//            filter.setSubQuestion(subQuestion);
//        }
//
//        filter.setFilterType(filterDTO.getFilterType());
//
//        switch (filterDTO.getFilterType()) {
//            case INTEGER:
//                filter.setFilterStartInt(Integer.parseInt(filterDTO.getFilterStart()));
//                filter.setFilterEndInt(Integer.parseInt(filterDTO.getFilterEnd()));
//                break;
//            case DOUBLE:
//                filter.setFilterStartDouble(Double.parseDouble(filterDTO.getFilterStart()));
//                filter.setFilterEndDouble(Double.parseDouble(filterDTO.getFilterEnd()));
//                break;
//            default:
//                throw new IllegalArgumentException("Invalid filter type: " + filterDTO.getFilterType());
//        }
//
//        Filter savedFilter = filterRepository.save(filter);
//        logger.info("Created Filter: {}", savedFilter);
//        return savedFilter;
//    }

    private Filter createAndSaveFilter(Question question, SubQuestion subQuestion, FilterRequest filterDTO) {
        Filter filter = new Filter();
        if (question != null) {
            filter.setQuestion(question);
        } else if (subQuestion != null) {
            filter.setSubQuestion(subQuestion);
        }

        String filterStart = filterDTO.getFilterStart();
        String filterEnd = filterDTO.getFilterEnd();

        if (isInteger(filterStart) && isInteger(filterEnd)) {
            filter.setFilterStartInt(Integer.parseInt(filterStart));
            filter.setFilterEndInt(Integer.parseInt(filterEnd));
        } else if (isDouble(filterStart) || isDouble(filterEnd)) {
            filter.setFilterStartDouble(Double.parseDouble(filterStart));
            filter.setFilterEndDouble(Double.parseDouble(filterEnd));
        } else {
            throw new IllegalArgumentException("Invalid filter type: Cannot determine filter type from values.");
        }

        Filter savedFilter = filterRepository.save(filter);
        logger.info("Created Filter: {}", savedFilter);
        return savedFilter;
    }

    private boolean isInteger(String str) {
        Pattern pattern = Pattern.compile("^-?\\d+$");
        Matcher matcher = pattern.matcher(str);
        return matcher.matches();
    }

    private boolean isDouble(String str) {
        Pattern pattern = Pattern.compile("^-?\\d+(\\.\\d+)?$");
        Matcher matcher = pattern.matcher(str);
        return matcher.matches();
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
                .orElseThrow(() -> {
                    String errorMessage = "Filter not found with id: " + filterId;
                    logger.error(errorMessage);
                    return new NoSuchElementException(errorMessage);
                });

        String filterStart = updatedFilter.getFilterStart();
        String filterEnd = updatedFilter.getFilterEnd();

        // Clear previous values
        existingFilter.setFilterStartInt(null);
        existingFilter.setFilterEndInt(null);
        existingFilter.setFilterStartDouble(null);
        existingFilter.setFilterEndDouble(null);

        if (isInteger(filterStart) && isInteger(filterEnd)) {
            setIntegerFilterValues(existingFilter, updatedFilter);
        } else if (isDouble(filterStart)|| isDouble(filterEnd)) {
            setDoubleFilterValues(existingFilter, updatedFilter);
        } else {
            throw new IllegalArgumentException("Invalid filter type: Cannot determine filter type from values.");
        }

        Filter savedFilter = filterRepository.save(existingFilter);
        logger.info("Updated Filter: {}", savedFilter);
        return savedFilter;
    }

    private void setIntegerFilterValues(Filter filter, FilterRequest filterDTO) {
        filter.setFilterStartInt(Integer.parseInt(filterDTO.getFilterStart()));
        filter.setFilterEndInt(Integer.parseInt(filterDTO.getFilterEnd()));
    }

    private void setDoubleFilterValues(Filter filter, FilterRequest filterDTO) {
        filter.setFilterStartDouble(Double.parseDouble(filterDTO.getFilterStart()));
        filter.setFilterEndDouble(Double.parseDouble(filterDTO.getFilterEnd()));
    }

//    @Transactional
//    public Filter updateFilter(Long filterId, FilterRequest updatedFilter) {
//        Filter existingFilter = filterRepository.findById(filterId)
//                .orElseThrow(() -> {String errorMessage = "Filter not found with id: " + filterId;
//                    logger.error(errorMessage);
//                    return new NoSuchElementException(errorMessage);
//                });
//        FilterType newFilterType = updatedFilter.getFilterType();
//        existingFilter.setFilterType(newFilterType != null ? newFilterType : existingFilter.getFilterType());
//        // Clear previous values if the filter type changes
//        if (newFilterType != null && newFilterType != existingFilter.getFilterType()) {
//            existingFilter.setFilterStartInt(null);
//            existingFilter.setFilterEndInt(null);
//            existingFilter.setFilterStartDouble(null);
//            existingFilter.setFilterEndDouble(null);
//        }
//        // Set filter values based on the filter type
//            switch (existingFilter.getFilterType()) {
//                case INTEGER:
//                    setIntegerFilterValues(existingFilter, updatedFilter);
//                    break;
//                case DOUBLE:
//                    setDoubleFilterValues(existingFilter, updatedFilter);
//                    break;
//                default:
//                    throw new IllegalArgumentException("Invalid filter type: " + updatedFilter.getFilterType());
//            }
//        Filter savedFilter = filterRepository.save(existingFilter);
//        logger.info("update filter successfully : {}" , savedFilter);
//        return savedFilter;
//    }
//
//    private void setIntegerFilterValues(Filter existingFilter, FilterRequest updatedFilter) {
//        if (updatedFilter.getFilterStart() != null) {
//            existingFilter.setFilterStartInt(Integer.parseInt(updatedFilter.getFilterStart()));
//        }
//        if (updatedFilter.getFilterEnd() != null) {
//            existingFilter.setFilterEndInt(Integer.parseInt(updatedFilter.getFilterEnd()));
//        }
//
//    }
//
//    private void setDoubleFilterValues(Filter existingFilter, FilterRequest updatedFilter) {
//        if (updatedFilter.getFilterStart() != null) {
//            existingFilter.setFilterStartDouble(Double.parseDouble(updatedFilter.getFilterStart()));
//        }
//        if (updatedFilter.getFilterEnd() != null) {
//            existingFilter.setFilterEndDouble(Double.parseDouble(updatedFilter.getFilterEnd()));
//        }
//
//    }

}


