'use client';

import { ContactGlobeVisual } from '@/components/landing/ContactGlobeVisual';
import { ContactSupportForm } from '@/components/landing/ContactSupportForm';

type ContactSupportSectionProps = {
  className?: string;
};

export function ContactSupportSection({ className = '' }: ContactSupportSectionProps) {
  return (
    <section id="contact" className={`scroll-mt-[88px] w-full bg-[linear-gradient(100deg,#00051a_0%,#0d2260_40%,#3562c8_100%)] pt-10 pb-0 lg:pt-14 ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="flex min-h-[520px] flex-col-reverse overflow-hidden min-[900px]:flex-row">
          <div className="relative flex w-full items-center justify-center overflow-hidden px-4 py-3 min-[900px]:w-[45%] min-[900px]:px-6">
            <ContactGlobeVisual />
          </div>
          <ContactSupportForm />
        </div>
      </div>
    </section>
  );
}
