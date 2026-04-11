import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Navbar */}
      <nav className="border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs" style={{ fontFamily: 'sans-serif' }}>CV</span>
          </div>
          <span className="font-bold text-lg text-blue-900 tracking-tight" style={{ fontFamily: 'sans-serif' }}>CertVerify</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/verify" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" style={{ fontFamily: 'sans-serif' }}>Verify</Link>
          <Link href="/issue" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" style={{ fontFamily: 'sans-serif' }}>Issue</Link>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" style={{ fontFamily: 'sans-serif' }}>Admin</Link>
          <Link href="/verify" className="text-sm bg-blue-900 text-white px-5 py-2 rounded font-medium hover:bg-blue-800 transition-colors" style={{ fontFamily: 'sans-serif' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20">
        <div className="inline-block border border-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mb-8" style={{ fontFamily: 'sans-serif', background: '#eff6ff' }}>
          Live on Polygon Amoy Testnet
        </div>
        <h1 className="text-6xl font-bold leading-tight text-gray-900 mb-6 max-w-3xl" style={{ letterSpacing: '-0.02em' }}>
          Academic certificates
          <br />
          <span className="text-blue-900">that cannot be forged.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-xl mb-10 leading-relaxed" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
          CertVerify anchors every certificate on the blockchain. Verification is instant, tamper-proof, and requires no manual intervention.
        </p>
        <div className="flex gap-4">
          <Link href="/verify" className="bg-blue-900 text-white px-8 py-3.5 rounded font-medium hover:bg-blue-800 transition-colors text-sm" style={{ fontFamily: 'sans-serif' }}>
            Verify a Certificate
          </Link>
          <Link href="/issue" className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded font-medium hover:bg-gray-50 transition-colors text-sm" style={{ fontFamily: 'sans-serif' }}>
            Issue Certificate
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-4 gap-8">
          {[
            { val: '100%', label: 'Tamper-proof' },
            { val: '< 3s', label: 'Verification time' },
            { val: '$0', label: 'Free to verify' },
            { val: 'L2', label: 'Low gas on Polygon' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-900 mb-1">{s.val}</p>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'sans-serif' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-t border-gray-100 py-24">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-xs font-semibold text-blue-800 tracking-widest uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>Process</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-16" style={{ letterSpacing: '-0.01em' }}>How it works</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Upload certificate', body: 'The issuing institution uploads the certificate file. The system generates a SHA-256 cryptographic fingerprint of the raw bytes.' },
              { n: '02', title: 'Anchored on-chain', body: 'The hash and metadata are written permanently to Polygon blockchain. The file is pinned to IPFS for decentralized storage.' },
              { n: '03', title: 'Instant verification', body: 'Anyone uploads the certificate. The system rehashes it and compares against the blockchain record. Match means authentic.' },
            ].map(s => (
              <div key={s.n} className="bg-white border border-gray-200 rounded-xl p-8">
                <p className="text-xs font-bold text-blue-800 mb-4" style={{ fontFamily: 'sans-serif' }}>{s.n}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-xs font-semibold text-blue-800 tracking-widest uppercase mb-3" style={{ fontFamily: 'sans-serif' }}>Features</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-16" style={{ letterSpacing: '-0.01em' }}>Built for institutions</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Tamper-proof records', body: 'Any change to a certificate instantly invalidates it. The blockchain record is immutable.' },
              { title: 'Instant verification', body: 'No manual checks or phone calls. Verify any certificate in under 3 seconds.' },
              { title: 'Role-based access', body: 'Only authorized issuers can create certificates. Enforced by the smart contract.' },
              { title: 'IPFS storage', body: 'Certificate files stored on IPFS — decentralized and always accessible.' },
              { title: 'Revocation system', body: 'Certificates issued in error can be revoked on-chain immediately.' },
              { title: 'Layer 2 speed', body: 'Deployed on Polygon for near-zero gas fees and fast finality.' },
            ].map(f => (
              <div key={f.title} className="border border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:bg-blue-50 transition-all">
                <div className="w-1.5 h-6 bg-blue-900 rounded-full mb-4" />
                <h4 className="font-bold text-gray-900 text-sm mb-2" style={{ fontFamily: 'sans-serif' }}>{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-24 bg-blue-900">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to verify?</h2>
          <p className="text-blue-200 mb-10 text-lg" style={{ fontFamily: 'sans-serif' }}>
            Upload any certificate and find out instantly if it is authentic.
          </p>
          <Link href="/verify" className="inline-block bg-white text-blue-900 px-10 py-4 rounded font-bold text-sm hover:bg-blue-50 transition-colors" style={{ fontFamily: 'sans-serif' }}>
            Verify Now — It is Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs" style={{ fontFamily: 'sans-serif' }}>CV</span>
          </div>
          <span className="font-bold text-sm text-gray-700" style={{ fontFamily: 'sans-serif' }}>CertVerify</span>
        </div>
        <p className="text-sm text-gray-400" style={{ fontFamily: 'sans-serif' }}>Built on Polygon + IPFS</p>
        <div className="flex gap-6">
          {['Verify', 'Issue', 'Admin'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm text-gray-400 hover:text-gray-700 transition-colors" style={{ fontFamily: 'sans-serif' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}