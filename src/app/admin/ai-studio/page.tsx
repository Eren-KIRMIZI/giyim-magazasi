import type { Metadata } from "next";
import { getAIStudioProducts } from "@/modules/ai-fashion";
import AIStudioClient from "./AIStudioClient";

export const metadata: Metadata = {
  title: "AI Fashion Studio",
  description: "Yapay zekâ ile model çekimi üret.",
};

export default async function AIStudioPage() {
  const products = await getAIStudioProducts();
  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          AI Fashion Studio
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Kıyafet + model referansından 4 açılı katalog görseli üret (Gemini 2.5
          Flash Image).
        </p>
      </div>
      <AIStudioClient products={products} />
    </div>
  );
}
