import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./StripeForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

export default function StripeComponent({res}) {
    const [clientSecret, setClientSecret] = React.useState("");
    const stripePromise = loadStripe(res?.publishKey);

    React.useEffect(() => {
        if (res === '') return;
        setClientSecret(res.paymentIntentClientSecret);
    }, [res]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm clientIntentSecret={clientSecret}/>
                </Elements>
            )}
        </div>
    );
}
