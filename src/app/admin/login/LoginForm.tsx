"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Button, Field, Input, Notice } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Senha">
        <Input type="password" name="password" autoFocus required autoComplete="current-password" />
      </Field>
      {state?.error && <Notice kind="error">{state.error}</Notice>}
      <Button type="submit" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
