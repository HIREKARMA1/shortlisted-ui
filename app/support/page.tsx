import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { ContactSupportContent } from '@/components/contact/ContactSupportContent';

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-secondary-50/80 via-white to-primary-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ContactSupportContent variant="public" />
      </main>
      <SiteFooter />
    </div>
  );
}
