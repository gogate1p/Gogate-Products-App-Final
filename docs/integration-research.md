# Integration research

## Razorpay

Source: https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/

Razorpay's Node.js integration requires a server-side Razorpay instance using `key_id` and `key_secret`. A server-created order should be created for each payment, and the returned `order_id` should be passed to Checkout. Amounts are sent in the smallest currency sub-unit, such as paise for INR.

Source: https://razorpay.com/docs/webhooks/validate-test/

Razorpay webhook requests include `X-Razorpay-Signature`, which must be verified with HMAC-SHA256 using the webhook secret and the raw request body. Webhook handling must be idempotent using the `x-razorpay-event-id` header because duplicate events may be delivered. Webhook event ordering is not guaranteed.

## Google Maps

Source: https://developers.google.com/maps/documentation/javascript/overview

The Maps JavaScript API supports interactive maps, custom markers, custom data, and Places functionality in the browser. Browser API keys should be restricted to the allowed web origins and APIs.

Source: https://developers.google.com/maps/documentation/routes

Google Routes API provides Compute Routes and Compute Route Matrix. It supports driving, two-wheeled motorized routes, traffic-aware polylines, and large-vehicle routing. Server-side route computation should keep server credentials out of browser code.
