package com.iker.Lexly.Controller;
import com.iker.Lexly.Entity.Filter;
import com.iker.Lexly.request.FilterRequest;
import com.iker.Lexly.service.FilterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.NoSuchElementException;

@RestController
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequestMapping("/api/filter")
public class FilterController {
    private static final Logger logger = LoggerFactory.getLogger(FilterController.class);

    private final FilterService filterService;

    public FilterController(FilterService filterService) {
        this.filterService = filterService;
    }
    @PostMapping("/add/{questionId}")
    public ResponseEntity<Object> addFilter(@PathVariable Long questionId, @RequestBody FilterRequest filterRequest) {
        try {
            Filter filter = filterService.addFilter(questionId, filterRequest);
            return ResponseEntity.ok(filter);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error adding filter: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error occurred while adding filter.");
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

    @DeleteMapping("/delete/{id}")
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

    @PutMapping("/update/{id}")
    public ResponseEntity<Filter> updateFilter(@PathVariable Long id, @RequestBody FilterRequest filter) {
        try {
            Filter updatedFilter = filterService.updateFilter(id, filter);
            return new ResponseEntity<>(updatedFilter, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
