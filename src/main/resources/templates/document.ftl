<!DOCTYPE html>
<html>
<head>
    <title>Legal Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            text-align: center;
            text-decoration: underline;
        }
        .section {
            margin-top: 20px;
        }
        .section-title {
            font-weight: bold;
        }
    </style>
</head>
<body>
<h1>Legal Document</h1>

<div class="section">
    <p class="section-title">Client Information:</p>
    <p><strong>Client Name:</strong> ${user.firstName} ${user.lastName}</p>
    <p><strong>Phone Number:</strong> ${user.phoneNumber}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Address:</strong> ${user.address}</p>
    <p><strong>Zip Code:</strong> ${user.zipCode}</p>
    <p><strong>Country:</strong> ${user.country}</p>
</div>

<div class="section">
    <p class="section-title">Legal Agreement:</p>
    <p>This document serves as a legal agreement between the client and the law firm.</p>

</div>
<p>Signature</p>
</body>
</html>
