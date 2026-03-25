// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {
    // Define the Issuer role fingerprint
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        string ipfsCID;     // IPFS link to the PDF
        bytes32 fileHash;   // SHA-256 fingerprint
        string studentId;   // Student identifier
        uint256 issuedAt;   // Unix timestamp
        bool revoked;       // Boolean to check if valid
    }

    // Mapping of Certificate ID to Certificate data
    mapping(bytes32 => Certificate) public certificates;

    event CertificateIssued(bytes32 indexed certId, string studentId, uint256 timestamp);
    event CertificateRevoked(bytes32 indexed certId, uint256 timestamp);

    constructor() {
        // The person who deploys the contract is the Super Admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // By default, let's also make the admin an issuer for testing
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @dev Allows an authorized issuer to anchor a certificate hash on-chain.
     */
    function issueCertificate(
        bytes32 _certId,
        bytes32 _fileHash,
        string calldata _ipfsCID,
        string calldata _studentId
    ) external onlyRole(ISSUER_ROLE) {
        require(certificates[_certId].issuedAt == 0, "Error: Cert ID already exists");
        require(_fileHash != bytes32(0), "Error: Invalid file hash");

        certificates[_certId] = Certificate({
            ipfsCID: _ipfsCID,
            fileHash: _fileHash,
            studentId: _studentId,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CertificateIssued(_certId, _studentId, block.timestamp);
    }

    /**
     * @dev Allows an Admin to revoke a certificate (e.g., if issued in error).
     */
    function revokeCertificate(bytes32 _certId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(certificates[_certId].issuedAt != 0, "Error: Certificate does not exist");
        require(!certificates[_certId].revoked, "Error: Already revoked");

        certificates[_certId].revoked = true;
        emit CertificateRevoked(_certId, block.timestamp);
    }

    /**
     * @dev Public function to verify if a certificate is valid and matches the hash.
     */
    function verifyCertificate(bytes32 _certId) 
        external view returns (bool exists, bool isRevoked, bytes32 fileHash, string memory studentId) 
    {
        Certificate memory cert = certificates[_certId];
        return (cert.issuedAt != 0, cert.revoked, cert.fileHash, cert.studentId);
    }
}