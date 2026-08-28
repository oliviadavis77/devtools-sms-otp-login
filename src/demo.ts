import { beginLogin } from "./otp_flow.js";

const to = process.env.DEMO_PHONE;
if (!to) throw new Error("DEMO_PHONE is required");
console.log(await beginLogin({ to }));
