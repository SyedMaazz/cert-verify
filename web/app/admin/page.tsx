'use client';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount } from 'wagmi';
import { certificateABI } from '../../constants/abi';

export default function AdminPage() {
  const [certIdToRevoke, setCertIdToRevoke] = useState('');
  const [revokeStatus, setRevokeStatus] = useState('');
  const { address, isConnected } = useAccount();

  const { writeContract, isPending } = useWriteContract();

  const handleRevoke = async () => {
    if (!certIdToRevoke) return alert('Please enter a Certificate ID to revoke');
    if (!certIdToRevoke.startsWith('0x')) return alert('Certificate ID must start with 0x');
    try {
      setRevokeStatus('Confirm in your wallet...');
      writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: certificateABI,
        functionName: 'revokeCertificate',
        args: [certIdToRevoke as `0x${string}`],
      });
      setRevokeStatus('Revocation submitted successfully!');
    } catch (err) {
      console.error(err);
      setRevokeStatus('Error revoking certificate.');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">Connect your wallet to access the admin panel</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-12 min-h-screen bg-gray-50 text-black">
      <nav className="w-full flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <ConnectButton />
      </nav>

      <div className="w-full max-w-2xl mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-600 font-medium">Connected as admin:</p>
        <p className="text-xs font-mono text-blue-800 mt-1">{address}</p>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-2">Revoke Certificate</h2>
        <p className="text-gray-500 text-sm mb-6">
          Revoking a certificate marks it as invalid permanently on the blockchain.
          This action cannot be undone.
        </p>

        <input
          type="text"
          placeholder="Certificate ID (0x...)"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-red-400 font-mono text-sm"
          onChange={(e) => setCertIdToRevoke(e.target.value)}
        />

        <button
          onClick={handleRevoke}
          disabled={isPending}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-lg shadow-red-200"
        >
          {isPending ? 'Confirming...' : 'Revoke Certificate'}
        </button>

        {revokeStatus && (
          <p className="mt-4 text-center text-sm font-medium text-red-600">
            {revokeStatus}
          </p>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm font-medium">Only the contract admin can revoke certificates.</p>
          <p className="text-yellow-600 text-xs mt-1">
            Make sure you are connected with the wallet that deployed the contract.
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-6 grid grid-cols-2 gap-4">
        <a
          href="/issue"
          className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-blue-300 transition-all"
        >
          <p className="font-bold text-gray-800">Issue Certificate</p>
          <p className="text-xs text-gray-500 mt-1">Go to issuer portal</p>
        </a>
        <a
          href="/verify"
          className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-green-300 transition-all"
        >
          <p className="font-bold text-gray-800">Verify Certificate</p>
          <p className="text-xs text-gray-500 mt-1">Go to verify portal</p>
        </a>
      </div>
    </div>
  );
}