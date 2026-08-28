import { strict as assert } from "node:assert";
import { requestCode } from "./otp_flow.js";

assert.deepEqual(requestCode.safeParse({ to: "+14155550123" }).success, true);
assert.deepEqual(requestCode.safeParse({ to: "4155550123" }).success, false);
console.log("OTP request boundary checks passed");
