export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-dark-border bg-dark-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-2">Portfolio</h3>
            <p className="text-sm text-dark-muted">
              Building digital experiences that make a difference.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              {["hero", "skills", "experience", "projects", "contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  className="block text-sm text-dark-muted hover:text-primary transition-colors capitalize"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <p className="text-sm text-dark-muted">
              Have a project in mind? Let&apos;s work together.
            </p>
            <a
              href="#contact"
              className="inline-block mt-2 text-sm text-primary hover:underline"
            >
              Send a message →
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-muted">
            &copy; {year} Portfolio. All rights reserved.
          </p>
          <p className="text-xs text-dark-muted">
            Built with Next.js &middot; Designed with care
          </p>
        </div>
      </div>
    </footer>
  )
}
