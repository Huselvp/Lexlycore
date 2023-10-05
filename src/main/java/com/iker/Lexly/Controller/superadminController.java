package com.iker.Lexly.Controller;

import freemarker.template.Template;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/docs")
public class superadminController {
    @GetMapping("/templates")
    public List<Template> getAllTemplates() {
      return null;
    }


}