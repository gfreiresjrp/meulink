"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Icon } from "./admin/Icons";

export function CopyButton({ value, label = "Copiar link" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant={done ? "primary" : "outline"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          window.prompt("Copie o link:", value);
        }
      }}
    >
      {done ? <Icon.Check className="size-3.5" /> : <Icon.Copy className="size-3.5" />}
      {done ? "Copiado!" : label}
    </Button>
  );
}
