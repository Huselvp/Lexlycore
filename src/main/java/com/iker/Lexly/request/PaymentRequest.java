package com.iker.Lexly.request;

import com.iker.Lexly.Entity.Checkout;
import com.iker.Lexly.Entity.Order;


public class PaymentRequest {
    private Checkout checkout;
    private Order order;

    public Checkout getCheckout() {
        return checkout;
    }

    public void setCheckout(Checkout checkout) {
        this.checkout = checkout;
    }
    public Order getOrder() {
        return order;
    }
    public void setOrder(Order order) {
        this.order = order;
    }
}

