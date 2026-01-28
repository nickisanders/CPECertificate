const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CPECertificate Contract", function () {
  let CPECertificate, cpeCertificate, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract
    [owner, addr1, addr2] = await ethers.getSigners();
    const CPECertificateFactory = await ethers.getContractFactory("CPECertificate");
    cpeCertificate = await CPECertificateFactory.deploy("CPE Certificate", "CPE", owner.address);
    await cpeCertificate.waitForDeployment();
  });

  it("should deploy with the correct name and symbol", async function () {
    expect(await cpeCertificate.name()).to.equal("CPE Certificate");
    expect(await cpeCertificate.symbol()).to.equal("CPE");
  });

  it("should mint a new certificate and store its details", async function () {
    const certData = {
      sponsorName: "CPE Academy",
      participantName: "John Doe",
      courseTitle: "Blockchain Fundamentals",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "New York, NY",
      deliveryMethod: "Online",
      cpeCredit: 8,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-001",
      stateRegistrationNumber: "REG-12345"
    };

    const tx = await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/1",
      certData
    );
    await tx.wait();

    const certificateDetails = await cpeCertificate.getCertificateDetails(1);
    expect(certificateDetails.sponsorName).to.equal("CPE Academy");
    expect(certificateDetails.participantName).to.equal("John Doe");
    expect(certificateDetails.courseTitle).to.equal("Blockchain Fundamentals");
    expect(certificateDetails.fieldOfStudy).to.equal("Technology");
    expect(certificateDetails.cpeCredit).to.equal(8);
    expect(certificateDetails.deliveryMethod).to.equal("Online");
    expect(certificateDetails.sponsorID).to.equal("SPONSOR-001");
  });

  it("should not allow non-owners to mint a certificate", async function () {
    const certData = {
      sponsorName: "CPE Academy",
      participantName: "John Doe",
      courseTitle: "Blockchain Fundamentals",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "New York, NY",
      deliveryMethod: "Online",
      cpeCredit: 8,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-001",
      stateRegistrationNumber: "REG-12345"
    };

    await expect(
      cpeCertificate.connect(addr1).mintCertificate(
        addr1.address,
        "https://example.com/nft/1",
        certData
      )
    ).to.be.reverted;
  });

  it("should track all NFTs owned by a specific owner", async function () {
    const certData1 = {
      sponsorName: "CPE Academy",
      participantName: "John Doe",
      courseTitle: "Blockchain Fundamentals",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "New York, NY",
      deliveryMethod: "Online",
      cpeCredit: 8,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-001",
      stateRegistrationNumber: "REG-12345"
    };

    await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/1",
      certData1
    );

    const certData2 = {
      sponsorName: "Blockchain Institute",
      participantName: "Jane Smith",
      courseTitle: "DeFi 101",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "San Francisco, CA",
      deliveryMethod: "In-Person",
      cpeCredit: 12,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-002",
      stateRegistrationNumber: "REG-67890"
    };

    await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/2",
      certData2
    );

    const nfts = await cpeCertificate.getAllNFTsByOwner(addr1.address);
    expect(nfts.length).to.equal(2);
    expect(nfts[0].participantName).to.equal("John Doe");
    expect(nfts[1].participantName).to.equal("Jane Smith");
  });

  it("should allow users to retrieve token IDs they own", async function () {
    const certData1 = {
      sponsorName: "CPE Academy",
      participantName: "John Doe",
      courseTitle: "Blockchain Fundamentals",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "New York, NY",
      deliveryMethod: "Online",
      cpeCredit: 8,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-001",
      stateRegistrationNumber: "REG-12345"
    };

    await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/1",
      certData1
    );

    const certData2 = {
      sponsorName: "Blockchain Institute",
      participantName: "Jane Smith",
      courseTitle: "DeFi 101",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "San Francisco, CA",
      deliveryMethod: "In-Person",
      cpeCredit: 12,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-002",
      stateRegistrationNumber: "REG-67890"
    };

    await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/2",
      certData2
    );

    const tokenId1 = await cpeCertificate.tokenOfOwnerByIndex(addr1.address, 0);
    const tokenId2 = await cpeCertificate.tokenOfOwnerByIndex(addr1.address, 1);

    expect(tokenId1).to.equal(1);
    expect(tokenId2).to.equal(2);
  });

  it("should correctly track ownership when multiple NFTs are minted", async function () {
    const certData1 = {
      sponsorName: "CPE Academy",
      participantName: "John Doe",
      courseTitle: "Blockchain Fundamentals",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "New York, NY",
      deliveryMethod: "Online",
      cpeCredit: 8,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-001",
      stateRegistrationNumber: "REG-12345"
    };

    await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/1",
      certData1
    );

    const certData2 = {
      sponsorName: "Blockchain Institute",
      participantName: "Jane Smith",
      courseTitle: "DeFi 101",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "San Francisco, CA",
      deliveryMethod: "In-Person",
      cpeCredit: 12,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-002",
      stateRegistrationNumber: "REG-67890"
    };

    await cpeCertificate.mintCertificate(
      addr2.address,
      "https://example.com/nft/2",
      certData2
    );

    const balance1 = await cpeCertificate.balanceOf(addr1.address);
    const balance2 = await cpeCertificate.balanceOf(addr2.address);

    expect(balance1).to.equal(1);
    expect(balance2).to.equal(1);
  });

  it("should revert if an out-of-bound index is used for tokenOfOwnerByIndex", async function () {
    const certData = {
      sponsorName: "CPE Academy",
      participantName: "John Doe",
      courseTitle: "Blockchain Fundamentals",
      dateCompleted: Math.floor(Date.now() / 1000),
      location: "New York, NY",
      deliveryMethod: "Online",
      cpeCredit: 8,
      fieldOfStudy: "Technology",
      sponsorID: "SPONSOR-001",
      stateRegistrationNumber: "REG-12345"
    };

    await cpeCertificate.mintCertificate(
      addr1.address,
      "https://example.com/nft/1",
      certData
    );

    await expect(
      cpeCertificate.tokenOfOwnerByIndex(addr1.address, 5)
    ).to.be.revertedWith("Owner index out of bounds");
  });
});
