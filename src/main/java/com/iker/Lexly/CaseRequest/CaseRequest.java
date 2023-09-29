package com.iker.Lexly.CaseRequest;

import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.Entity.enums.Casestatus;
import com.iker.Lexly.Entity.enums.Subtype;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
@Data
public class CaseRequest {
    private Casestatus casestatus;
    private CaseType type;
    private Subtype subtype;
    private String description;
    private User user;
    private LocalDateTime createdDate;
    private LocalDateTime deletedDate;
    private LocalDateTime modifiedDate;
    private String participantEmails;
}

