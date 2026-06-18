import { cn } from '@/lib/utils';

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative">
      <div className="absolute -left-2 -top-2 h-12 w-12 rounded-2xl bg-brand-yellow/90 sm:h-14 sm:w-14" aria-hidden />
      <div className="absolute -bottom-2 -right-2 h-14 w-14 rounded-2xl bg-brand-orange/90 sm:h-16 sm:w-16" aria-hidden />
      <div
        className={cn(
          'relative rounded-2xl border border-line-default/80 bg-white/95 p-5 shadow-xl shadow-brand-blue/[0.06] backdrop-blur-sm sm:p-6',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
