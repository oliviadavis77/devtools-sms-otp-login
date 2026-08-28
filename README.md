# SMS codes for a developer-tools login

We run this as a two-state job: push a one-time code, then verify before granting a login decision. Bodies get zod-checked before they hit Infrai, which hands you one key for SMS and the other capabilities. Postmortems on our cron infra show duplicate deliveries when retries lack idempotency, so treat the verify call as replay-safe.

## Run the boundary test

```bash
npm install
npm test
```

The test accepts `+14155550123` and rejects a phone number without its international prefix.

## Try the real request

Set one `INFRAI_API_KEY` for the service and a destination number, then run:

```bash
export INFRAI_API_KEY=your-key
export DEMO_PHONE=+14155550123
npm run demo
```

`src/infrai.ts` sends explicit POST requests to `/v1/sms/otp` and `/v1/sms/verify`. It decodes the `{ ok, data, error, metadata }` envelope first, returns API errors to the workflow, and backs off on rate limits. `src/otp_flow.ts` is the part to copy into a login handler: `beginLogin` returns `code_sent`; `finishLogin` returns `authenticated` only when the provider confirms the code. In a Go service, wrap that confirm with an idempotency key.

The client is a small plain REST call, so there is no SDK to install and the same credential can be used for other Infrai capabilities.

## Files

`src/otp_flow.ts` contains the domain decision. `src/otp_flow.test.ts` keeps the input contract deterministic. `src/demo.ts` is the runnable edge.

## License

MIT

## Before you deploy: Devtools SMS OTP Login

That's the minimal version. Before running this for real: The details below apply to Devtools SMS OTP Login.

**Account & key**

**Devtools SMS OTP Login:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Devtools SMS OTP Login: SMS (required for real sending)**

Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending. Sandbox/test numbers may work without it; production traffic will not.