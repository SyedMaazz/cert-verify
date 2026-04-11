'use client';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { certificateABI } from '@/constants/abi';
import Link from 'next/link';

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

export default function AdminPage() {
  const [certIdToRevoke, setCertIdToRevoke] = useState('');
  const [addressToGrant, setAddressToGrant] = useState('');
  const [addressToRevoke, setAddressToRevoke] = useState('');
  const [checkAddress, setCheckAddress] = useState('');

  const { address, isConnected } = useAccount();
  const { writeContract, isPending, data: txHash } = useWriteContract();
  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS;

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: ISSUER_ROLE } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: 'ISSUER_ROLE',
  });

  const { data: hasIssuerRole, refetch: recheckRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: 'hasRole',
    args: ISSUER_ROLE && checkAddress ? [ISSUER_ROLE, checkAddress as `0x${string}`] : undefined,
    query: { enabled: !!ISSUER_ROLE && !!checkAddress },
  });

  const handleRevokeCert = () => {
    if (!certIdToRevoke) return alert('Please enter a Certificate ID');
    if (!certIdToRevoke.startsWith('0x')) return alert('Certificate ID must start with 0x');
    writeContract({ address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`, abi: certificateABI, functionName: 'revokeCertificate', args: [certIdToRevoke as `0x${string}`] });
  };

  const handleGrantIssuer = () => {
    if (!addressToGrant?.startsWith('0x')) return alert('Please enter a valid wallet address');
    if (!ISSUER_ROLE) return;
    writeContract({ address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`, abi: certificateABI, functionName: 'grantRole', args: [ISSUER_ROLE, addressToGrant as `0x${string}`] });
  };

  const handleRevokeIssuer = () => {
    if (!addressToRevoke?.startsWith('0x')) return alert('Please enter a valid wallet address');
    if (!ISSUER_ROLE) return;
    writeContract({ address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`, abi: certificateABI, functionName: 'revokeRole', args: [ISSUER_ROLE, addressToRevoke as `0x${string}`] });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-900 text-xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mb-6">Connect your wallet to continue</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
        <div className="bg-white border border-red-200 rounded-xl p-10 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-bold text-xl">✕</span>
          </div>
          <h1 className="text-xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-4">This dashboard is restricted to the contract admin only.</p>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg mb-6 text-left">
            <p className="text-xs text-gray-400 mb-1">Connected as:</p>
            <p className="text-xs font-mono text-gray-600 break-all">{address}</p>
          </div>
          <ConnectButton />
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-4">
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">Admin access</span>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ letterSpacing: '-0.01em' }}>Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage issuers and revoke certificates on the blockchain.</p>
        </div>

        {/* Admin wallet */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
          <p className="text-xs text-green-600 font-medium mb-1">Connected as admin</p>
          <p className="text-xs font-mono text-green-800">{address}</p>
        </div>

        {/* Transaction status */}
        {(isPending || isConfirming || isConfirmed) && (
          <div className={`p-4 rounded-xl border mb-6 text-sm font-medium ${isConfirmed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            {isPending ? 'Confirm in your wallet...' : isConfirming ? 'Waiting for confirmation...' : '✓ Transaction confirmed!'}
          </div>
        )}

        {/* Manage Issuers */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Manage Issuers</h2>
          <p className="text-sm text-gray-400 mb-6">Grant or revoke the Issuer role for any wallet address.</p>

          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Grant Issuer Role</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Wallet address (0x...)" className="flex-1 p-3 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-blue-500" onChange={(e) => setAddressToGrant(e.target.value)} />
              <button onClick={handleGrantIssuer} disabled={isPending || isConfirming} className="px-5 py-3 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:bg-gray-300 transition-all">Grant</button>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Revoke Issuer Role</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Wallet address (0x...)" className="flex-1 p-3 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-red-400" onChange={(e) => setAddressToRevoke(e.target.value)} />
              <button onClick={handleRevokeIssuer} disabled={isPending || isConfirming} className="px-5 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 transition-all">Revoke</button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Check Issuer Status</label>
            <div className="flex gap-3">
              <input type="text" placeholder="Wallet address (0x...)" className="flex-1 p-3 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-gray-400" onChange={(e) => setCheckAddress(e.target.value)} />
              <button onClick={() => recheckRole()} className="px-5 py-3 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all">Check</button>
            </div>
            {checkAddress && hasIssuerRole !== undefined && (
              <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${hasIssuerRole ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {hasIssuerRole ? '✓ This address has the Issuer role' : '✕ This address does NOT have the Issuer role'}
              </div>
            )}
          </div>
        </div>

        {/* Revoke Certificate */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Revoke Certificate</h2>
          <p className="text-sm text-gray-400 mb-6">Permanently mark a certificate as revoked. This action cannot be undone.</p>
          <input type="text" placeholder="Certificate ID (0x...)" className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-sm font-mono outline-none focus:border-red-400" onChange={(e) => setCertIdToRevoke(e.target.value)} />
          <button onClick={handleRevokeCert} disabled={isPending || isConfirming} className="w-full py-3 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:bg-gray-300 transition-all">
            {isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : 'Revoke Certificate'}
          </button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/issue" className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all">
            <p className="font-bold text-gray-900 text-sm">Issue Certificate</p>
            <p className="text-xs text-gray-400 mt-1">Go to issuer portal</p>
          </Link>
          <Link href="/verify" className="p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
            <p className="font-bold text-gray-900 text-sm">Verify Certificate</p>
            <p className="text-xs text-gray-400 mt-1">Go to verify portal</p>
          </Link>
        </div>
      </div>
    </div>
  );
}