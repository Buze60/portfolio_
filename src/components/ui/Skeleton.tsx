"use client"

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-dark-border rounded ${className}`} />
}

export function HeroSkeleton() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-9 w-48 mx-auto rounded-full" />
        <Skeleton className="h-16 w-96 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-20 w-full max-w-xl mx-auto" />
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-12 h-12 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function SkillsSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-40 mx-auto rounded-full" />
          <Skeleton className="h-10 w-48 mx-auto" />
        </div>
        {[1, 2].map((cat) => (
          <div key={cat} className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="p-4 rounded-xl bg-dark-card border border-dark-border space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProjectsSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-28 mx-auto rounded-full" />
          <Skeleton className="h-10 w-56 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-dark-card border border-dark-border overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((t) => (
                    <Skeleton key={t} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ExperienceSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-48 mx-auto" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-dark-card border border-dark-border space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function EducationSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-40 mx-auto" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="pl-20 relative space-y-4">
            <Skeleton className="absolute left-4 top-6 w-9 h-9 rounded-full" />
            <div className="p-6 rounded-xl bg-dark-card border border-dark-border space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AchievementsSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-40 mx-auto rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-dark-card border border-dark-border overflow-hidden">
              <Skeleton className="aspect-[3/1] w-full" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-40 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </section>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
