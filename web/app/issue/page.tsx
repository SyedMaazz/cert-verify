'use client';
import { useState } from 'react';
import { calculateFileHash } from '../../lib/hash';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract } from 'wagmi';
import { certificateABI } from '../../constants/abi';

export default function IssuePage() {
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('');
  const [generatedCertId, setGeneratedCertId] = useState('');
  const [ipfsCID, setIpfsCID] = useState('');

  const { writeContract, isPending } = useWriteContract();

  const handleIssue = async () => {
    if (!file || !studentId) return alert("Please provide both file and Student ID");

    try {
      // Step 1: Hash the file
      setStatus('Calculating fingerprint...');
      const fileHash = await calculateFileHash(file);

      // Step 2: Upload to IPFS via API route
      setStatus('Uploading to IPFS...');
      const formData = new FormData();
      formData.append('file', file);

      const ipfsRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!ipfsRes.ok) throw new Error('IPFS upload failed');

      const { cid } = await ipfsRes.json();
      setIpfsCID(cid);

      // Step 3: Generate cert ID and store on blockchain
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

  return (
    <div className="flex flex-col items-center p-12 min-h-screen text-black bg-gray-50">
      <nav className="w-full flex justify-end mb-12">
        <ConnectButton />
      </nav>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Issue Certificate</h1>

        <input
          type="text"
          placeholder="Student ID (e.g. 2024-001)"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-blue-500"
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          type="file"
          className="w-full mb-6 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleIssue}
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-lg shadow-blue-200"
        >
          {isPending ? 'Confirming...' : 'Issue on Blockchain'}
        </button>

        {status && (
          <p className="mt-4 text-center text-sm text-blue-600 font-medium">{status}</p>
        )}

        {generatedCertId && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 font-medium">Certificate ID (save this):</p>
            <p className="text-xs font-mono break-all text-gray-800">{generatedCertId}</p>
          </div>
        )}

        {ipfsCID && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 mb-1 font-medium">Stored on IPFS:</p>
            <a
              href={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${ipfsCID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono break-all text-green-700 hover:underline"
            >
              {ipfsCID}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}