package com.iker.Lexly.service;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.config.jwt.JwtService;
import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import jakarta.mail.internet.MimeMessage;
import org.hibernate.annotations.DialectOverride;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import javax.mail.MessagingException;
import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;


@Service
public class EmailService {
   private final  JavaMailSender javaMailSender;
   @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }
    public void sendResetPasswordEmail(User user, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("Click the following link to reset your password: " + generateResetLink(resetToken));
        javaMailSender.send(message);
    }
    private String generateResetLink(String resetToken) {
        // Generate and return the reset link URL based on your frontend and token
        // Example: "https://your-frontend-domain.com/reset-password?token=" + resetToken
        return "https://your-frontend-domain.com/reset-password?token=" + resetToken;
    }
}

