package com.iker.Lexly.Controller;
import com.iker.Lexly.Entity.Filter;
import com.iker.Lexly.request.FilterRequest;
import com.iker.Lexly.service.FilterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequestMapping("/api/filter")
public class FilterController {

    private final FilterService filterService;

    public FilterController(FilterService filterService) {
        this.filterService = filterService;
    }
    @PostMapping("/add/{questionId}")
    public ResponseEntity<Filter> addFilter(@PathVariable Long questionId, @RequestBody FilterRequest filter) {
        try {

            Filter savedFilter = filterService.addFilter(questionId, filter);
            return new ResponseEntity<>(savedFilter, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filter> getFilter(@PathVariable Long id) {
        try {
            Filter filter = filterService.getFilter(id);
            return new ResponseEntity<>(filter, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteFilter(@PathVariable Long id) {
        try {
            filterService.deleteFilter(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<Filter> updateFilter(@PathVariable Long id, @RequestBody Filter filter) {
//        try {
//            Filter updatedFilter = filterService.updateFilter(id, filter);
//            return new ResponseEntity<>(updatedFilter, HttpStatus.OK);
//        } catch (NoSuchElementException e) {
//            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
//        } catch (IllegalArgumentException e) {
//            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

}
