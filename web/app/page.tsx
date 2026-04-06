'use client';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { certificateABI } from '@/constants/abi';

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

export default function AdminPage() {
  const [certIdToRevoke, setCertIdToRevoke] = useState('');
  const [addressToGrant, setAddressToGrant] = useState('');
  const [addressToRevoke, setAddressToRevoke] = useState('');
  const [checkAddress, setCheckAddress] = useState('');

  const { address, isConnected } = useAccount();
  const { writeContract, isPending, data: txHash } = useWriteContract();

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS;

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const { data: ISSUER_ROLE } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: 'ISSUER_ROLE',
  });

  const { data: hasIssuerRole, refetch: recheckRole } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: 'hasRole',
    args: ISSUER_ROLE && checkAddress
      ? [ISSUER_ROLE, checkAddress as `0x${string}`]
      : undefined,
    query: { enabled: !!ISSUER_ROLE && !!checkAddress },
  });

  const handleRevokeCert = () => {
    if (!certIdToRevoke) return alert('Please enter a Certificate ID');
    if (!certIdToRevoke.startsWith('0x')) return alert('Certificate ID must start with 0x');
    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: certificateABI,
      functionName: 'revokeCertificate',
      args: [certIdToRevoke as `0x${string}`],
    });
  };

  const handleGrantIssuer = () => {
    if (!addressToGrant || !addressToGrant.startsWith('0x')) return alert('Please enter a valid wallet address');
    if (!ISSUER_ROLE) return alert('Could not read ISSUER_ROLE from contract');
    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: certificateABI,
      functionName: 'grantRole',
      args: [ISSUER_ROLE, addressToGrant as `0x${string}`],
    });
  };

  const handleRevokeIssuer = () => {
    if (!addressToRevoke || !addressToRevoke.startsWith('0x')) return alert('Please enter a valid wallet address');
    if (!ISSUER_ROLE) return alert('Could not read ISSUER_ROLE from contract');
    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: certificateABI,
      functionName: 'revokeRole',
      args: [ISSUER_ROLE, addressToRevoke as `0x${string}`],
    });
  };

  const getTxStatus = () => {
    if (isPending) return { msg: 'Confirm in your wallet...', color: 'text-blue-600' };
    if (isConfirming) return { msg: 'Waiting for confirmation...', color: 'text-blue-600' };
    if (isConfirmed) return { msg: 'Transaction confirmed!', color: 'text-green-600' };
    return null;
  };

  const txStatus = getTxStatus();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">Connect your wallet to continue</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h1 className="text-xl font-bold mb-2 text-red-700">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-4">
            This dashboard is restricted to the contract admin only.
          </p>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg mb-6">
            <p className="text-xs text-gray-400 mb-1">Connected as:</p>
            <p className="text-xs font-mono text-gray-700 break-all">{address}</p>
          </div>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-12 min-h-screen bg-gray-50 text-black">
      <nav className="w-full flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-xs text-green-600 font-medium mt-1">Admin access granted</p>
        </div>
        <ConnectButton />
      </nav>

      {/* Admin wallet info */}
      <div className="w-full max-w-2xl mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-sm text-green-700 font-medium">Connected as admin:</p>
        <p className="text-xs font-mono text-green-800 mt-1">{address}</p>
      </div>

      {/* Transaction status banner */}
      {txStatus && (
        <div className="w-full max-w-2xl mb-4 p-3 bg-white border border-gray-200 rounded-xl text-center">
          <p className={`text-sm font-medium ${txStatus.color}`}>{txStatus.msg}</p>
        </div>
      )}

      {/* ISSUER ROLE MANAGEMENT */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-2">Manage Issuers</h2>
        <p className="text-gray-500 text-sm mb-6">
          Grant or revoke the Issuer role for any wallet address.
        </p>

        {/* Grant */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Grant Issuer Role</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Wallet address (0x...)"
              className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-400 font-mono text-sm"
              onChange={(e) => setAddressToGrant(e.target.value)}
            />
            <button
              onClick={handleGrantIssuer}
              disabled={isPending || isConfirming}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all text-sm"
            >
              Grant
            </button>
          </div>
        </div>

        {/* Revoke role */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Revoke Issuer Role</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Wallet address (0x...)"
              className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-red-400 font-mono text-sm"
              onChange={(e) => setAddressToRevoke(e.target.value)}
            />
            <button
              onClick={handleRevokeIssuer}
              disabled={isPending || isConfirming}
              className="px-5 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 disabled:bg-gray-400 transition-all text-sm"
            >
              Revoke
            </button>
          </div>
        </div>

        {/* Check role */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Check Issuer Status</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Wallet address (0x...)"
              className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:border-gray-400 font-mono text-sm"
              onChange={(e) => setCheckAddress(e.target.value)}
            />
            <button
              onClick={() => recheckRole()}
              className="px-5 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-800 transition-all text-sm"
            >
              Check
            </button>
          </div>
          {checkAddress && hasIssuerRole !== undefined && (
            <div className={`mt-2 p-3 rounded-lg text-sm font-medium ${hasIssuerRole ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {hasIssuerRole ? 'This address has the Issuer role' : 'This address does NOT have the Issuer role'}
            </div>
          )}
        </div>
      </div>

      {/* REVOKE CERTIFICATE */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-2">Revoke Certificate</h2>
        <p className="text-gray-500 text-sm mb-6">
          Permanently mark a certificate as revoked on the blockchain. Cannot be undone.
        </p>
        <input
          type="text"
          placeholder="Certificate ID (0x...)"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-red-400 font-mono text-sm"
          onChange={(e) => setCertIdToRevoke(e.target.value)}
        />
        <button
          onClick={handleRevokeCert}
          disabled={isPending || isConfirming}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 transition-all"
        >
          {isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : 'Revoke Certificate'}
        </button>
      </div>

      {/* Quick links */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
        <a href="/issue" className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-blue-300 transition-all">
          <p className="font-bold text-gray-800">Issue Certificate</p>
          <p className="text-xs text-gray-500 mt-1">Go to issuer portal</p>
        </a>
        <a href="/verify" className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-green-300 transition-all">
          <p className="font-bold text-gray-800">Verify Certificate</p>
          <p className="text-xs text-gray-500 mt-1">Go to verify portal</p>
        </a>
      </div>
    </div>
  );
}