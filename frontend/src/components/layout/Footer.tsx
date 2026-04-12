const footerLinks = {
  'Fundraise for': ['Medical', 'Education', 'Community', 'Emergency', 'Memorial', 'Nonprofits'],
  'Learn More': ['How It Works', 'About', 'Pricing', 'Success Stories'],
  'Resources': ['Help Center', 'Contact Us', 'FAQs'],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Fund<span className="text-brand">Raise</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Helping individuals and organizations create fundraising campaigns,
              share their stories, and connect with supporters.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FundRaise &mdash; CSIT314 Software Development Project</p>
        </div>
      </div>
    </footer>
  );
}
