'use client';
import { useState } from 'react';
import { calculateFileHash } from '../../lib/hash';
import { useReadContract } from 'wagmi';
import { certificateABI } from '../../constants/abi';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [certId, setCertId] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // We read from the blockchain to see if this ID exists
  const { data, refetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: 'verifyCertificate',
    args: [certId as `0x${string}`],
    query: { enabled: false } // Only run when we click the button
  });

  const handleVerify = async () => {
    if (!file || !certId) return alert("Upload file and enter Certificate ID");
    
    // 1. Calculate the hash of the file the user just uploaded
    const localHash = await calculateFileHash(file);
    
    // 2. Fetch the data from the blockchain
    const result = await refetch();
    
    if (result.data) {
      const [exists, isRevoked, onChainHash] = result.data as [boolean, boolean, string];
      
      // 3. Compare the local file fingerprint with the blockchain fingerprint
      if (exists && !isRevoked && localHash === onChainHash) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-12 min-h-screen text-black bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Verify Certificate</h1>
      
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <input 
          type="text" 
          placeholder="Enter Certificate ID (from the issuer)" 
          className="w-full p-3 border rounded-lg mb-4 outline-none"
          onChange={(e) => setCertId(e.target.value)}
        />
        <input 
          type="file" 
          className="w-full mb-6 text-sm"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button 
          onClick={handleVerify}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
        >
          Check Authenticity
        </button>

        {isVerified === true && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 font-bold text-center">
            ✅ This certificate is AUTHENTIC and matches the blockchain record.
          </div>
        )}
        {isVerified === false && (
          <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800 font-bold text-center">
            ❌ Verification FAILED. The file or ID is incorrect or revoked.
          </div>
        )}
      </div>
    </div>
  );
}