// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {
    // Define the Issuer role
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Certificate {
        string ipfsCID;     // Link to the file on IPFS
        bytes32 fileHash;   // SHA-256 fingerprint of the file
        string studentId;   // Unique ID of the student
        uint256 issuedAt;   // Timestamp
        bool revoked;       // Status for cancellation
    }

    // Mapping of Certificate ID to Certificate data
    mapping(bytes32 => Certificate) public certificates;

    event CertificateIssued(bytes32 indexed certId, string studentId);
    event CertificateRevoked(bytes32 indexed certId);

    constructor() {
        // Grant the deployer the Admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function issueCertificate(
        bytes32 _certId,
        bytes32 _fileHash,
        string calldata _ipfsCID,
        string calldata _studentId
    ) external onlyRole(ISSUER_ROLE) {
        require(certificates[_certId].issuedAt == 0, "Certificate already exists");

        certificates[_certId] = Certificate({
            ipfsCID: _ipfsCID,
            fileHash: _fileHash,
            studentId: _studentId,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CertificateIssued(_certId, _studentId);
    }

    function verifyCertificate(bytes32 _certId) 
        external view returns (bool exists, bool isRevoked, bytes32 fileHash) 
    {
        Certificate memory cert = certificates[_certId];
        return (cert.issuedAt != 0, cert.revoked, cert.fileHash);
    }
}