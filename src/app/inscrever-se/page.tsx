import type { Metadata } from "next";

import { Suspense } from "react";

import { InscricaoExperience } from "@/components/enrollment/InscricaoExperience";



export const metadata: Metadata = {

  title: "Matrícula — Escola THCProce",

  description:

    "Crie sua conta de aluno no campus digital: escolha o período de acesso, preencha o formulário e siga para o próximo passo."

};



function EnrollmentFallback() {

  return (

    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-ink-900 px-6 text-center">

      <div

        aria-hidden

        className="h-8 w-8 animate-spin rounded-full border-2 border-canna-400/35 border-t-canna-400"

      />

      <p className="mt-4 text-sm text-white/55">Carregando matrícula…</p>

    </div>

  );

}



export default function InscreverSePage() {

  return (

    <Suspense fallback={<EnrollmentFallback />}>

      <InscricaoExperience />

    </Suspense>

  );

}

