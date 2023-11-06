package com.iker.Lexly.service;

import com.stripe.Stripe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {
    @Value("${stripe.apiKey}")
    private String stripeKey;
    public void init(){
        Stripe.apiKey = stripeKey;
    }
}
