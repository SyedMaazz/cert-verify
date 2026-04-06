"use client";
import { useState } from "react";
import { calculateFileHash } from "@/lib/hash";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import { certificateABI } from "@/constants/abi";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<"valid" | "invalid" | "revoked" | null>(
    null,
  );
  const [studentId, setStudentId] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const { refetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: certificateABI,
    functionName: "verifyCertificate",
    args: [certId as `0x${string}`],
    query: { enabled: false },
  });

  const handleVerify = async () => {
    if (!file || !certId)
      return alert(
        "Please provide both the certificate file and Certificate ID",
      );
    try {
      setIsChecking(true);
      setResult(null);
      const uploadedHash = await calculateFileHash(file);
      const { data } = await refetch();
      if (!data) {
        setResult("invalid");
        setIsChecking(false);
        return;
      }
      const [exists, isRevoked, storedHash, storedStudentId] = data;
      if (!exists) setResult("invalid");
      else if (isRevoked) setResult("revoked");
      else if (storedHash === uploadedHash) {
        setResult("valid");
        setStudentId(storedStudentId);
      } else setResult("invalid");
    } catch (err) {
      console.error(err);
      setResult("invalid");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-12 min-h-screen bg-gray-50 text-black">
      <nav className="w-full flex justify-end mb-12">
        <ConnectButton />
      </nav>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-2xl font-bold mb-2">Verify Certificate</h1>
        <p className="text-gray-500 text-sm mb-6">
          Upload the certificate and enter its ID to check authenticity
        </p>
        <input
          type="text"
          placeholder="Certificate ID (0x...)"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:border-blue-500 font-mono text-sm"
          onChange={(e) => setCertId(e.target.value)}
        />
        <input
          type="file"
          className="w-full mb-6 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleVerify}
          disabled={isChecking}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-lg shadow-blue-200"
        >
          {isChecking ? "Verifying..." : "Verify Certificate"}
        </button>
        {result === "valid" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-700 font-bold text-lg">
              Valid Certificate
            </p>
            <p className="text-green-600 text-sm mt-1">
              Student ID: {studentId}
            </p>
            <p className="text-green-500 text-xs mt-1">
              This certificate is authentic and unmodified
            </p>
          </div>
        )}
        {result === "invalid" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-700 font-bold text-lg">
              Invalid Certificate
            </p>
            <p className="text-red-500 text-xs mt-1">
              This certificate was not found or has been tampered with
            </p>
          </div>
        )}
        {result === "revoked" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
            <p className="text-yellow-700 font-bold text-lg">
              Certificate Revoked
            </p>
            <p className="text-yellow-500 text-xs mt-1">
              This certificate has been revoked by the issuing authority
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
