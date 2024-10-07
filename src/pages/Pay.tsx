import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useChargePayment } from "../features/Payment/useChargePayment";

const Pay = () => {
  const [searchParams] = useSearchParams();
  const { chargePayment } = useChargePayment();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://test.checkout.dibspayment.eu/v1/checkout.js?v=1";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
    
      const checkoutKey = "test-checkout-key-b4efeb14e3114511a84e7be90cc43f1d";
      const checkoutOptions = {
        checkoutKey,
        paymentId: searchParams.get("p"),
        containerId: "checkout-container-div",
      };

      const checkout = new window.Dibs.Checkout(checkoutOptions);
      checkout.on("payment-completed", function () {
        chargePayment();
      });
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="checkout-container-div"></div>;
};

export default Pay;
