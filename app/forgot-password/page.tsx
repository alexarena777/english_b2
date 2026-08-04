import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <main className="simple-auth">
      <Brand />
      <section>
        <span>ACCESSO B2 TRAINER</span>
        <h1>Nessuna password da recuperare.</h1>
        <p>
          B2 Trainer usa l’accesso sicuro di ChatGPT. Torna alla schermata di
          accesso e continua con il tuo account.
        </p>
        <Button asChild>
          <Link href="/login">Torna all’accesso</Link>
        </Button>
      </section>
    </main>
  );
}
