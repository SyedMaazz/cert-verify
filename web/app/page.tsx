import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#0d0a14' }}>

      {/* Subtle grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(164,144,194,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(164,144,194,0.04) 1px, transparent 1px)`,
        backgroundSize: '72px 72px'
      }}/>

      {/* Top glow blob */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse, rgba(74,78,143,0.25) 0%, transparent 65%)'
      }}/>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-16 py-5" style={{ borderBottom: '1px solid rgba(164,144,194,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white" style={{ background: 'linear-gradient(135deg, #4a4e8f, #a490c2)' }}>
            CV
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: '#e6e6fa' }}>CertVerify</span>
        </div>
        <div className="flex items-center gap-10">
          <Link href="/verify" className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity" style={{ color: '#e6e6fa' }}>Verify</Link>
          <Link href="/issue" className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity" style={{ color: '#e6e6fa' }}>Issue</Link>
          <Link href="/admin" className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity" style={{ color: '#e6e6fa' }}>Admin</Link>
          <Link href="/verify" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #4a4e8f, #a490c2)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-10" style={{ border: '1px solid rgba(164,144,194,0.2)', background: 'rgba(74,78,143,0.12)', color: '#a490c2' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#a490c2' }}/>
          Live on Polygon Blockchain
        </div>

        <h1 className="font-black leading-none tracking-tighter mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#e6e6fa' }}>
          The End of
          <br />
          <span style={{ background: 'linear-gradient(135deg, #4a4e8f 0%, #a490c2 50%, #e6e6fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Fake Certificates.
          </span>
        </h1>

        <p className="text-lg max-w-lg leading-relaxed mb-12" style={{ color: 'rgba(230,230,250,0.45)' }}>
          Blockchain-anchored certificates that cannot be forged, altered, or disputed.
          Verify any credential in seconds — no phone calls, no paperwork.
        </p>

        <div className="flex gap-4">
          <Link href="/verify" className="px-8 py-4 rounded-2xl font-bold text-base text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #4a4e8f, #a490c2)' }}>
            Verify a Certificate
          </Link>
          <Link href="/issue" className="px-8 py-4 rounded-2xl font-bold text-base hover:opacity-80 transition-opacity" style={{ border: '1px solid rgba(164,144,194,0.2)', color: 'rgba(230,230,250,0.6)', background: 'rgba(74,78,143,0.08)' }}>
            Issue Certificate
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-16 mt-24 pt-10" style={{ borderTop: '1px solid rgba(164,144,194,0.08)' }}>
          {[['100%', 'Tamper-proof'], ['< 3s', 'Verification'], ['$0', 'Free to verify'], ['L2', 'Low gas fees']].map(([val, label], i, arr) => (
            <div key={label} className="flex items-center gap-16">
              <div className="text-center">
                <p className="text-3xl font-black mb-1" style={{ color: '#a490c2' }}>{val}</p>
                <p className="text-xs" style={{ color: 'rgba(230,230,250,0.35)' }}>{label}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8" style={{ background: 'rgba(164,144,194,0.1)' }}/>}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-16 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#a490c2' }}>Process</p>
          <h2 className="text-4xl font-black text-center mb-16" style={{ color: '#e6e6fa' }}>How it works</h2>

          <div className="grid grid-cols-3 gap-5">
            {[
              { n: '01', title: 'Upload Certificate', body: 'Institution uploads the certificate PDF. A SHA-256 cryptographic fingerprint is generated from the raw file bytes.' },
              { n: '02', title: 'Anchored On-Chain', body: 'The hash and metadata are written permanently to Polygon blockchain. The file is pinned to IPFS for decentralized access.' },
              { n: '03', title: 'Instant Verification', body: 'Anyone uploads the certificate. System rehashes it and compares against the blockchain record. Match means authentic.' },
            ].map(item => (
              <div key={item.n} className="relative p-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(43,30,62,0.5)', border: '1px solid rgba(164,144,194,0.08)' }}>
                <p className="text-7xl font-black absolute top-4 right-6 select-none" style={{ color: 'rgba(164,144,194,0.06)' }}>{item.n}</p>
                <p className="text-xs font-bold mb-5" style={{ color: '#a490c2' }}>{item.n}</p>
                <h3 className="font-bold text-base mb-3" style={{ color: '#e6e6fa' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,230,250,0.4)' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-16 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#a490c2' }}>Features</p>
          <h2 className="text-4xl font-black text-center mb-16" style={{ color: '#e6e6fa' }}>Everything you need</h2>

          <div className="grid grid-cols-3 gap-5">
            {[
              { title: 'Tamper-proof', body: 'Any change to a certificate instantly invalidates it. The blockchain record can never be altered.' },
              { title: 'Instant verification', body: 'No manual checks or phone calls. Verify any certificate in under 3 seconds from anywhere.' },
              { title: 'Role-based access', body: 'Only authorized issuers can create certificates. Full RBAC enforced by the smart contract.' },
              { title: 'IPFS storage', body: 'Certificate files stored on IPFS — decentralized, always accessible, no single point of failure.' },
              { title: 'Revocation system', body: 'Certificates issued in error can be revoked on-chain and immediately show as invalid.' },
              { title: 'Layer 2 speed', body: 'Deployed on Polygon for near-zero gas fees and fast finality without sacrificing security.' },
            ].map(f => (
              <div key={f.title} className="p-6 rounded-2xl" style={{ background: 'rgba(43,30,62,0.4)', border: '1px solid rgba(164,144,194,0.08)' }}>
                <div className="w-8 h-1 rounded-full mb-5" style={{ background: 'linear-gradient(90deg, #4a4e8f, #a490c2)' }}/>
                <h4 className="font-bold text-sm mb-2" style={{ color: '#e6e6fa' }}>{f.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,230,250,0.4)' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-16 py-24">
        <div className="max-w-3xl mx-auto text-center p-16 rounded-3xl relative overflow-hidden" style={{ background: 'rgba(43,30,62,0.6)', border: '1px solid rgba(164,144,194,0.12)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,78,143,0.3) 0%, transparent 60%)' }}/>
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#a490c2' }}>Get started</p>
            <h2 className="text-4xl font-black mb-4" style={{ color: '#e6e6fa' }}>Ready to verify?</h2>
            <p className="mb-10 text-lg" style={{ color: 'rgba(230,230,250,0.4)' }}>Upload any certificate and find out instantly if it is authentic.</p>
            <Link href="/verify" className="inline-block px-10 py-4 rounded-2xl font-bold text-base text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #4a4e8f, #a490c2)' }}>
              Verify Now — It is Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-16 py-8 flex justify-between items-center text-sm" style={{ borderTop: '1px solid rgba(164,144,194,0.08)', color: 'rgba(230,230,250,0.25)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, #4a4e8f, #a490c2)' }}>CV</div>
          <span style={{ color: 'rgba(230,230,250,0.5)' }}>CertVerify</span>
        </div>
        <p>Built on Polygon + IPFS</p>
        <div className="flex gap-6">
          <Link href="/verify" className="hover:text-white transition-colors">Verify</Link>
          <Link href="/issue" className="hover:text-white transition-colors">Issue</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
        </div>
      </footer>

    </div>
  );
}