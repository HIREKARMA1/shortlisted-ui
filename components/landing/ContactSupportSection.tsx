'use client';

import { ContactGlobeVisual } from '@/components/landing/ContactGlobeVisual';
import { ContactSupportForm } from '@/components/landing/ContactSupportForm';

type ContactSupportSectionProps = {
  className?: string;
};

export function ContactSupportSection({ className = '' }: ContactSupportSectionProps) {
  return (
    <section id="contact" className={`w-full bg-white pt-10 pb-0 lg:pt-16 ${className}`}>
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-5 lg:px-8">
        <div className="flex flex-col-reverse overflow-hidden rounded-3xl rounded-b-none bg-gradient-to-r from-[#010C39] to-[#3766CB] lg:flex-row">
          <div className="relative flex flex-1 items-end justify-center overflow-hidden px-2 pb-0 pt-6 sm:px-4 lg:px-6 lg:pt-8">
            <ContactGlobeVisual />
          </div>
          <ContactSupportForm />
        </div>
      </div>
    </section>
  );
}
