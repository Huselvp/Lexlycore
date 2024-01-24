package com.iker.Lexly.Entity;

public class Item {
    private String reference;

    private String name;
    private int quantity=1;
    private String unit="pcs";
    private  float unitPrice;
    private float grossTotalAmount;
    private float netTotalAmount;

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public float getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(float unitPrice) {
        this.unitPrice = unitPrice;
    }

    public float getGrossTotalAmount() {
        return grossTotalAmount;
    }

    public void setGrossTotalAmount(float grossTotalAmount) {
        this.grossTotalAmount = grossTotalAmount;
    }

    public float getNetTotalAmount() {
        return netTotalAmount;
    }

    public void setNetTotalAmount(float netTotalAmount) {
        this.netTotalAmount = netTotalAmount;
    }
}

