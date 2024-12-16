// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

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

    // Manual tracking for token ownership to simulate ERC721Enumerable
    mapping(address => uint256[]) private _ownedTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address initialOwner
    ) ERC721(tokenName, tokenSymbol) Ownable(initialOwner) {
        _tokenIdCounter = 1; // Start token IDs at 1
    }

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
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        certificateDetails[tokenId] = CertificateData({
            name: name,
            certificateId: certificateId,
            courseTitle: courseTitle,
            issuer: issuer,
            dateIssued: dateIssued,
            completionDate: completionDate,
            cpeHours: cpeHours
        });

        // Manually track ownership
        _addTokenToOwnerEnumeration(to, tokenId);

        _tokenIdCounter++;
    }

    function getCertificateDetails(
        uint256 tokenId
    ) public view returns (CertificateData memory) {
        return certificateDetails[tokenId];
    }

    function getAllNFTsByOwner(
        address owner
    ) public view returns (CertificateData[] memory) {
        uint256 ownedTokenCount = _ownedTokens[owner].length;
        CertificateData[] memory certificates = new CertificateData[](
            ownedTokenCount
        );

        for (uint256 i = 0; i < ownedTokenCount; i++) {
            uint256 tokenId = _ownedTokens[owner][i];
            certificates[i] = certificateDetails[tokenId];
        }

        return certificates;
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    }

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) public view returns (uint256) {
        require(
            index < _ownedTokens[owner].length,
            "Owner index out of bounds"
        );
        return _ownedTokens[owner][index];
    }
}
