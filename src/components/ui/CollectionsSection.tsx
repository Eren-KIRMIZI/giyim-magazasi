import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { collections } from "@/lib/data";

export default function CollectionsSection() {
  const [main, side] = collections;

  return (
    <section className="w-full px-margin-mobile md:px-margin-desktop mb-stack-lg">
      <Reveal>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface mb-stack-md border-b border-on-surface pb-stack-sm">
          Collections
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <Reveal className="col-span-1 md:col-span-8">
          <Link
            href="/koleksiyonlar"
            className="group relative block overflow-hidden border border-on-surface min-h-[400px] md:min-h-[600px]"
          >
            <Image
              src={main.image}
              alt={main.alt}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 p-stack-md w-full flex justify-between items-end gap-4">
              <h3 className="font-headline-md text-headline-lg-mobile md:text-headline-lg uppercase text-primary-fixed leading-none">
                {main.title}
              </h3>
              <div className="bg-surface text-on-surface font-label-mono text-label-mono px-4 py-2 uppercase border border-on-surface group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300">
                Explore
              </div>
            </div>
          </Link>
        </Reveal>
        <div className="col-span-1 md:col-span-4 flex flex-col gap-gutter">
          <Reveal className="flex-1">
            <Link
              href="/koleksiyonlar"
              className="group relative block overflow-hidden border border-on-surface h-full min-h-[250px]"
            >
              <Image
                src={side.image}
                alt={side.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute top-0 left-0 p-4 bg-surface text-on-surface border-r border-b border-on-surface font-label-mono text-label-mono uppercase group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                {side.title}
              </div>
            </Link>
          </Reveal>
          <Reveal className="flex-1" delay={0.1}>
            <div className="bg-on-surface dark:bg-surface-container text-surface dark:text-on-surface h-full p-stack-md flex flex-col justify-center border border-on-surface min-h-[250px]">
              <p className="font-label-mono text-label-mono uppercase tracking-widest text-primary-fixed-dim dark:text-primary mb-3">
                Private Access — Limited Drops
              </p>
              <h4 className="font-headline-md text-headline-md uppercase mb-4">
                Join the Syndicate
              </h4>
              <p className="font-label-mono text-label-mono text-surface-variant dark:text-on-surface-variant mb-6">
                Get on the list. Drops close the moment they open.
              </p>
              <NewsletterForm tone="on-dark" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
