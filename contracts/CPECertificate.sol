// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CPECertificate is ERC721URIStorage, Ownable {

    uint256 private _tokenIdCounter;

    struct CertificateData {
        string name;
        string certificateId;
        string courseTitle;
        string issuer;
        uint256 dateIssued;
        uint256 completionDate;
        uint256 cpeHours;
    }

    mapping(uint256 => CertificateData) public certificateDetails;

    constructor(string memory tokenName, string memory tokenSymbol, address initialOwner) 
        ERC721(tokenName, tokenSymbol) 
        Ownable(initialOwner) 
    {
        _tokenIdCounter = 1; // Start token IDs at 1
    }

    /**
     * @dev Mints a new NFT with the given metadata URI and certificate data.
     * @param to The wallet address to which the NFT will be minted.
     * @param tokenURI The URI where the CPE certificate metadata (stored on IPFS or another off-chain storage) can be accessed.
     * @param name The name of the certificate holder.
     * @param certificateId The unique certificate ID assigned by the issuer.
     * @param courseTitle The title of the CPE course completed.
     * @param issuer The name of the organization that issued the certificate.
     * @param dateIssued The date the certificate was issued.
     * @param completionDate The date the course was completed.
     * @param cpeHours The number of CPE hours awarded for completing the course.
     */
    function mintCertificate(
        address to, 
        string memory tokenURI, 
        string memory name, 
        string memory certificateId,
        string memory courseTitle, 
        string memory issuer, 
        uint256 dateIssued, 
        uint256 completionDate,
        uint256 cpeHours
    ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Store certificate details on-chain in a mapping
        certificateDetails[tokenId] = CertificateData({
            name: name,
            certificateId: certificateId,
            courseTitle: courseTitle,
            issuer: issuer,
            dateIssued: dateIssued,
            completionDate: completionDate,
            cpeHours: cpeHours
        });

        _tokenIdCounter++;
    }

    /**
     * @dev Returns the certificate details for a given token ID.
     * @param tokenId The ID of the NFT (token).
     */
    function getCertificateDetails(uint256 tokenId) public view returns (CertificateData memory) {
        return certificateDetails[tokenId];
    }
}