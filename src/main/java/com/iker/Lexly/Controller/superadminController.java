package com.iker.Lexly.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/superadmin")
public class superadminController {

    @GetMapping
    public String get(){
        return "GET :: superadmin controller";
    }
    @PostMapping
    public String post(){
        return "GET :: superadmin controller";
    }
    @PutMapping
    public String put(){
        return "GET :: superadmin controller";
    }
    @DeleteMapping
    public String Delete(){
        return "GET :: superadmin controller";
    }
}
