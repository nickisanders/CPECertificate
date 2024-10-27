const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CPECertificate", function () {
  let CPECertificate, cpeCertificate, owner, addr1;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"; // Define zero address explicitly

  beforeEach(async function () {
    // Deploy the contract
    [owner, addr1] = await ethers.getSigners();
    const tokenName = "CPE Certificate NFT";
    const tokenSymbol = "CPE";
    CPECertificate = await ethers.getContractFactory("CPECertificate");
    cpeCertificate = await CPECertificate.deploy(tokenName, tokenSymbol, owner.address);
  });

  it("should have the correct name and symbol", async function () {
    expect(await cpeCertificate.name()).to.equal("CPE Certificate NFT");
    expect(await cpeCertificate.symbol()).to.equal("CPE");
  });

  it("should allow the owner to mint a certificate", async function () {
    const tokenURI = "ipfs://QmExampleTokenURI";
    const certificateData = {
      name: "John Doe",
      certificateId: "CERT-123",
      courseTitle: "Blockchain Fundamentals",
      issuer: "CPE Academy",
      dateIssued: 1672531200, // Example timestamp
      completionDate: 1672534800, // Example timestamp
      cpeHours: 8
    };

    await expect(
      cpeCertificate.mintCertificate(
        addr1.address,
        tokenURI,
        certificateData.name,
        certificateData.certificateId,
        certificateData.courseTitle,
        certificateData.issuer,
        certificateData.dateIssued,
        certificateData.completionDate,
        certificateData.cpeHours
      )
    ).to.emit(cpeCertificate, "Transfer").withArgs(ZERO_ADDRESS, addr1.address, 1);

    // Check that the token URI is set correctly
    expect(await cpeCertificate.tokenURI(1)).to.equal(tokenURI);

    // Check that the certificate data is stored correctly
    const certificateDetails = await cpeCertificate.getCertificateDetails(1);
    expect(certificateDetails.name).to.equal(certificateData.name);
    expect(certificateDetails.certificateId).to.equal(certificateData.certificateId);
    expect(certificateDetails.courseTitle).to.equal(certificateData.courseTitle);
    expect(certificateDetails.issuer).to.equal(certificateData.issuer);
    expect(certificateDetails.dateIssued).to.equal(certificateData.dateIssued);
    expect(certificateDetails.completionDate).to.equal(certificateData.completionDate);
    expect(certificateDetails.cpeHours).to.equal(certificateData.cpeHours);
  });

  it("should not allow non-owner to mint a certificate", async function () {
    const tokenURI = "ipfs://QmExampleTokenURI";
    const certificateData = {
      name: "Jane Doe",
      certificateId: "CERT-456",
      courseTitle: "Advanced Blockchain",
      issuer: "CPE Academy",
      dateIssued: 1672531200,
      completionDate: 1672534800,
      cpeHours: 10
    };

    // Expect the transaction to revert for a non-owner, regardless of the revert reason
    await expect(
      cpeCertificate.connect(addr1).mintCertificate(
        addr1.address,
        tokenURI,
        certificateData.name,
        certificateData.certificateId,
        certificateData.courseTitle,
        certificateData.issuer,
        certificateData.dateIssued,
        certificateData.completionDate,
        certificateData.cpeHours
      )
    ).to.be.reverted; // Generic revert check
  });

  it("should return the correct certificate details", async function () {
    const tokenURI = "ipfs://QmExampleTokenURI";
    const certificateData = {
      name: "Alice",
      certificateId: "CERT-789",
      courseTitle: "Solidity Development",
      issuer: "CPE Academy",
      dateIssued: 1672531200,
      completionDate: 1672534800,
      cpeHours: 12
    };

    // Mint a certificate
    await cpeCertificate.mintCertificate(
      addr1.address,
      tokenURI,
      certificateData.name,
      certificateData.certificateId,
      certificateData.courseTitle,
      certificateData.issuer,
      certificateData.dateIssued,
      certificateData.completionDate,
      certificateData.cpeHours
    );

    // Retrieve and check certificate details
    const certificateDetails = await cpeCertificate.getCertificateDetails(1);
    expect(certificateDetails.name).to.equal(certificateData.name);
    expect(certificateDetails.certificateId).to.equal(certificateData.certificateId);
    expect(certificateDetails.courseTitle).to.equal(certificateData.courseTitle);
    expect(certificateDetails.issuer).to.equal(certificateData.issuer);
    expect(certificateDetails.dateIssued).to.equal(certificateData.dateIssued);
    expect(certificateDetails.completionDate).to.equal(certificateData.completionDate);
    expect(certificateDetails.cpeHours).to.equal(certificateData.cpeHours);
  });
});