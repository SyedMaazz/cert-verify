'use client';
import { useState, useEffect } from 'react';
import { calculateFileHash } from '@/lib/hash';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, usePublicClient, useAccount } from 'wagmi';
import { certificateABI } from '@/constants/abi';
import Link from 'next/link';

export default function IssuePage() {
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('');
  const [generatedCertId, setGeneratedCertId] = useState('');
  const [ipfsCID, setIpfsCID] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const { isConnected } = useAccount();
  const { writeContract, isPending, data: txHash } = useWriteContract();
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!txHash || !publicClient || isConfirmed) return;
    setIsPolling(true);
    setStatus('Transaction submitted, waiting for confirmation...');
    const poll = async () => {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 120_000 });
        if (receipt.status === 'success') {
          setIsConfirmed(true);
          setIsPolling(false);
          setStatus('Certificate successfully issued on blockchain!');
        } else {
          setIsPolling(false);
          setStatus('Transaction failed. Please try again.');
        }
      } catch (err) {
        console.error(err);
        setIsPolling(false);
        setStatus('Could not confirm. Check Polygonscan for status.');
      }
    };
    poll();
  }, [txHash, publicClient, isConfirmed]);

  const handleIssue = async () => {
    if (!file || !studentId) return alert('Please provide both file and Student ID');
    try {
      setStatus('Calculating fingerprint...');
      const fileHash = await calculateFileHash(file);
      setStatus('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', file);
      const ipfsRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!ipfsRes.ok) throw new Error('IPFS upload failed');
      const { cid } = await ipfsRes.json();
      setIpfsCID(cid);
      const certId = `0x${Buffer.from(studentId + Date.now()).toString('hex').slice(0, 64).padEnd(64, '0')}` as `0x${string}`;
      setGeneratedCertId(certId);
      setStatus('Confirm in your wallet...');
      writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: certificateABI,
        functionName: 'issueCertificate',
        args: [certId, fileHash as `0x${string}`, cid, studentId],
      });
    } catch (err) {
      console.error(err);
      setStatus('Error during issuance. Please try again.');
    }
  };

  const handleReset = () => {
    setFile(null); setStudentId(''); setStatus('');
    setGeneratedCertId(''); setIpfsCID('');
    setIsConfirmed(false); setIsPolling(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ letterSpacing: '-0.01em' }}>Issue Certificate</h1>
          <p className="text-gray-500 text-sm">Upload a certificate file to anchor it permanently on the blockchain.</p>
        </div>

        {!isConnected ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm mb-6">Connect your wallet to issue certificates</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                placeholder="e.g. STU-2024-001"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isConfirmed || isPolling}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate File</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                <input
                  type="file"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isConfirmed || isPolling}
                />
                {file && <p className="mt-2 text-xs text-gray-400">{file.name}</p>}
              </div>
            </div>

            <button
              onClick={handleIssue}
              disabled={isPending || isPolling || isConfirmed}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                isConfirmed
                  ? 'bg-green-600 text-white cursor-default'
                  : isPending || isPolling
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {isPending ? 'Waiting for wallet...' : isPolling ? 'Confirming on blockchain...' : isConfirmed ? '✓ Certificate Issued' : 'Issue on Blockchain'}
            </button>

            {status && (
              <p className={`mt-4 text-sm text-center ${isConfirmed ? 'text-green-600' : 'text-blue-600'}`}>
                {status}
              </p>
            )}

            {txHash && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Transaction</p>
                <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-600 hover:underline break-all">{txHash}</a>
              </div>
            )}

            {generatedCertId && (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Certificate ID — save this</p>
                <p className="text-xs font-mono text-gray-800 break-all">{generatedCertId}</p>
              </div>
            )}

            {ipfsCID && (
              <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-xs text-green-600 mb-1">Stored on IPFS</p>
                <a href={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${ipfsCID}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-green-700 hover:underline break-all">{ipfsCID}</a>
              </div>
            )}

            {isConfirmed && (
              <button onClick={handleReset} className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                Issue Another Certificate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}