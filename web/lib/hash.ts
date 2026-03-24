export async function calculateFileHash(file: File): Promise<string> {
  // Convert the file into a buffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Use the browser's built-in SubtleCrypto API to generate a SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  
  // Convert the buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return the hash with '0x' prefix so Solidity recognizes it as bytes32
  return `0x${hashHex}`;
}