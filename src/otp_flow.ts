import { z } from "zod";
import { infrai } from "./infrai.js";

export const requestCode = z.object({ to: z.string().regex(/^\+[1-9]\d{7,14}$/) });
export const verifyCode = requestCode.extend({ code: z.string().regex(/^\d{4,8}$/) });

export async function beginLogin(input: unknown) {
  const body = requestCode.parse(input);
  await infrai.sms.otp({ to: body.to });
  return { state: "code_sent" as const, to: body.to };
}

export async function finishLogin(input: unknown) {
  const body = verifyCode.parse(input);
  const result = await infrai.sms.verify({ to: body.to, code: body.code });
  return result.verified ? { state: "authenticated" as const } : { state: "rejected" as const };
}
