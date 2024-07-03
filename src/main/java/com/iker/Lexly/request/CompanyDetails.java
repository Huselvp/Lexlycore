package com.iker.Lexly.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyDetails {
    private String cvrNumber;
    private String name;
    private String address;
    private String postalCode;
    private String city;
    private String startDate;
    private String companyForm;
    private String advertisingProtection;
    private String status;
}
