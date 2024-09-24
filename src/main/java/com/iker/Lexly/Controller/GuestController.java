package com.iker.Lexly.Controller;

import com.iker.Lexly.responses.GuestDocumentResponse;
import com.iker.Lexly.service.GuestService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;


@Controller
public class GuestController {
    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }


    @PostMapping("/createDocument/{templateId}")
    public GuestDocumentResponse createNewDocument(@PathVariable Long templateId) {
            GuestDocumentResponse response = guestService.createNewDocument(templateId);
            return response;
        }
    }

