package com.iker.Lexly.Entity;

public class Item {
    private String reference;
    //name of template
    private String name;
    private int quantity=1;
    private String unit="pcs";
    private int unitPrice;// cost of template
    private int grossTotalAmount;//cost template
    private int netTotalAmount; // cost template

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

    public int getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(int unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getGrossTotalAmount() {
        return grossTotalAmount;
    }

    public void setGrossTotalAmount(int grossTotalAmount) {
        this.grossTotalAmount = grossTotalAmount;
    }

    public int getNetTotalAmount() {
        return netTotalAmount;
    }

    public void setNetTotalAmount(int netTotalAmount) {
        this.netTotalAmount = netTotalAmount;
    }
}

