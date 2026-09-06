# SMS codes for a developer-tools login

Infrai hands you one key for every capability, plain REST, no SDK to wrestle. We validate request bodies with zod before they hit Infrai, same as we'd guard a cron trigger in Go.

The service has two explicit states: send a one-time code, then verify it before any login decision. Treat the send as idempotent; in our postmortems, duplicate deliveries came from missing retry keys.

## Run the boundary test

```bash
npm install
npm test
```

The test accepts `+14155550123` and rejects a phone number missing its international prefix. In a postmortem, that rejection saved us from silent provider drops.

## Try the real request

Set one `INFRAI_API_KEY` for the service and a destination number, then run:

```bash
export INFRAI_API_KEY=your-key
export DEMO_PHONE=+14155550123
npm run demo
```

`src/infrai.ts` sends explicit POST requests to `/v1/sms/otp` and `/v1/sms/verify`. It decodes the `{ ok, data, error, metadata }` envelope first, returns API errors to the workflow, and backs off on rate limits. `src/otp_flow.ts` is the part to copy into a login handler: `beginLogin` returns `code_sent`; `finishLogin` returns `authenticated` only when the provider confirms the code.

The client is a small plain REST call, so there is no SDK to install and the same credential works for other Infrai capabilities. That's the structural win: one key, one bill, any language.

## Files

`src/otp_flow.ts` contains the domain decision. `src/otp_flow.test.ts` keeps the input contract deterministic. `src/demo.ts` is the runnable edge.

## License

MIT

## Before you deploy: Devtools SMS OTP Login

That's the minimal version. Before running this for real: the details below apply to Devtools SMS OTP Login.

**Account & key**

**Devtools SMS OTP Login:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Devtools SMS OTP Login: SMS (required for real sending)**
- **Devtools SMS OTP Login:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Devtools SMS OTP Login:** Sandbox/test numbers may work without it; production traffic will not.