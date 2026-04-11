'use client';
import { useState } from 'react';
import { calculateFileHash } from '@/lib/hash';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { certificateABI } from '@/constants/abi';
import Link from 'next/link';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<'valid' | 'invalid' | 'revoked' | null>(null);
  const [studentId, setStudentId] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const { refetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: 'verifyCertificate',
    args: [certId as `0x${string}`],
    query: { enabled: false },
  });

  const handleVerify = async () => {
    if (!file || !certId) return alert('Please provide both the certificate file and Certificate ID');
    try {
      setIsChecking(true);
      setResult(null);
      const uploadedHash = await calculateFileHash(file);
      const { data } = await refetch();
      if (!data) { setResult('invalid'); setIsChecking(false); return; }
      const [exists, isRevoked, storedHash, storedStudentId] = data;
      if (!exists) setResult('invalid');
      else if (isRevoked) setResult('revoked');
      else if (storedHash === uploadedHash) { setResult('valid'); setStudentId(storedStudentId); }
      else setResult('invalid');
    } catch (err) {
      console.error(err);
      setResult('invalid');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">CV</span>
          </div>
          <span className="font-bold text-blue-900">CertVerify</span>
        </Link>
        <ConnectButton />
      </nav>

      <div className="max-w-xl mx-auto px-8 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ letterSpacing: '-0.01em' }}>Verify Certificate</h1>
          <p className="text-gray-500 text-sm">Upload the certificate and enter its ID to check authenticity on the blockchain.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate ID</label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onChange={(e) => setCertId(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate File</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
              <input
                type="file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && <p className="mt-2 text-xs text-gray-400">{file.name}</p>}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isChecking}
            className="w-full py-3 rounded-lg font-medium text-sm bg-blue-900 text-white hover:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500 transition-all"
          >
            {isChecking ? 'Verifying...' : 'Verify Certificate'}
          </button>

          {/* Result */}
          {result === 'valid' && (
            <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <p className="text-green-800 font-bold">Valid Certificate</p>
              </div>
              <p className="text-green-700 text-sm">Student ID: <span className="font-mono font-medium">{studentId}</span></p>
              <p className="text-green-600 text-xs mt-1">This certificate is authentic and has not been tampered with.</p>
            </div>
          )}

          {result === 'invalid' && (
            <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">✕</span>
                </div>
                <p className="text-red-800 font-bold">Invalid Certificate</p>
              </div>
              <p className="text-red-600 text-xs">This certificate was not found on the blockchain or has been tampered with.</p>
            </div>
          )}

          {result === 'revoked' && (
            <div className="mt-6 p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">!</span>
                </div>
                <p className="text-yellow-800 font-bold">Certificate Revoked</p>
              </div>
              <p className="text-yellow-600 text-xs">This certificate has been revoked by the issuing authority.</p>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 font-medium mb-1">How verification works</p>
          <p className="text-xs text-blue-600">The file is hashed using SHA-256 and compared against the record stored on the Polygon blockchain. Any modification to the file — even a single byte — will result in a mismatch.</p>
        </div>
      </div>
    </div>
  );
}