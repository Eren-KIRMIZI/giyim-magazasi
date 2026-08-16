import type { Metadata } from "next";
import LoginForm from "@/components/ui/LoginForm";

export const metadata: Metadata = {
  title: "Giriş",
  description:
    "LAST DANCE arşivine giriş yap veya yeni bir hesap oluştur.",
  robots: { index: false, follow: false },
};

export default function GirisPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col items-center gap-stack-md">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface text-center">
        {`Members Area`}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant text-center max-w-xl">
        Arşive erişmek ve siparişlerini takip etmek için giriş yap.
      </p>
      <LoginForm />
    </div>
  );
}
