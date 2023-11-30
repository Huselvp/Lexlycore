package com.iker.Lexly.Notifications;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationService {
    private FCMService fcmService;
    public PushNotificationService(FCMService fcmService) {
        this.fcmService = fcmService;
    }

    public void sendPushNotificationToToken(PushNotificationRequest request) {
        try {
            fcmService.sendMessageToToken(request);
        } catch (Exception e) {
            System.out.println("Error sending push notification: " + e.getMessage());
        }
    }
}