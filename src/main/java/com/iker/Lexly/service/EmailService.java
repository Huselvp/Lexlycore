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

      Configuration configuration;
       JavaMailSender javaMailSender;
       JwtService jwtService;
    @Value("${frontend}")
    private String frontendUrl;
    public void sendEmail(User user) throws MessagingException, IOException, TemplateException, jakarta.mail.MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        helper.setSubject("Reset your password - LEXLY");
        helper.setTo(user.getEmail());

        String token = jwtService.generateToken(user);
        StringWriter stringWriter = new StringWriter();
        Map<String, Object> model = new HashMap<>();
        model.put("fullname", user.getFirstname() + " " + user.getLastname());
        model.put("email", user.getEmail());
        model.put("url", frontendUrl + "reset-password/" +  token);
       configuration.getTemplate("reset-password.ftl").process(model, stringWriter);
        String emailContent = stringWriter.getBuffer().toString();
        helper.setText(emailContent, true);
        javaMailSender.send(mimeMessage);
    }
    public void sendResetPasswordEmail(User user, String resetToken) {
        // Create a SimpleMailMessage for the email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail()); // Set the recipient's email address
        message.setSubject("Password Reset Request"); // Set the email subject
        message.setText("Click the following link to reset your password: " + generateResetLink(resetToken)); // Set the email content

        // Send the email
        javaMailSender.send(message);
    }
    private String generateResetLink(String resetToken) {
        // Generate and return the reset link URL based on your frontend and token
        // Example: "https://your-frontend-domain.com/reset-password?token=" + resetToken
        return "https://your-frontend-domain.com/reset-password?token=" + resetToken;
    }
}

