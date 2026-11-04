import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#2D2523] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative h-11 w-44">
              <Image
                src="/images/logo.png"
                alt="KalaConnect"
                fill
                className="object-contain object-left invert brightness-200"
              />
            </div>
            <p className="font-sans text-sm text-white/60 max-w-sm leading-relaxed">
              Empowering India&apos;s traditional artists by building their digital
              identity and connecting them with global art patrons and cultural enthusiasts.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-[#C9A060] mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Explore Artists', href: '/artists' },
                { name: 'Virtual Exhibitions', href: '/exhibitions' },
                { name: 'Art Categories', href: '/#art-forms' },
                { name: 'How It Works', href: '/#how-it-works' },
                { name: 'Our Impact', href: '/#impact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-[#C9A060] mb-4">
              For Artisans
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Join KalaConnect', href: '/join' },
                { name: 'Artist Login', href: '/login' },
                { name: 'Digital Portfolio Guide', href: '/how-it-works' },
                { name: 'Heritage Verification', href: '/impact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-white/40">
          <p>
            &copy; {new Date().getFullYear()} KalaConnect. Preserving India&apos;s Living Cultural Heritage.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white/70 transition-colors">
              Terms of Opportunity
            </Link>
            <Link href="#" className="hover:text-white/70 transition-colors">
              Artisan Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
