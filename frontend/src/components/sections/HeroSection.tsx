import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Text column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-1.5 text-sm font-medium text-brand">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            No fee to start fundraising
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Where successful fundraisers begin
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Trusted by millions of donors worldwide. Create your campaign in
            minutes, share it with your network, and start receiving donations
            right away.
          </p>
        </div>

        {/* Image column */}
        <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-3xl lg:mx-0">
          <Image
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1920&auto=format&fit=crop"
            alt="People supporting each other"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
