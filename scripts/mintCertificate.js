const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

  // Load the CPECertificate contract
  const CPECertificate = await ethers.getContractFactory("CPECertificate");
  const cpeCertificate = await CPECertificate.attach(contractAddress);

  // Define the wallet address to mint to (replace with your actual address)
  const recipientAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

  // Define certificate metadata
  const tokenURI = "http://localhost:3000/images/certificate.png"; // Replace with your IPFS URI or other metadata URI
  const certificateData = {
    name: "John Doe",
    certificateId: "CERT-123",
    courseTitle: "Blockchain Fundamentals",
    issuer: "CPE Academy",
    dateIssued: Math.floor(Date.now() / 1000), // Current timestamp in seconds
    completionDate: Math.floor(Date.now() / 1000), // Replace with actual date in seconds
    cpeHours: 8,
  };

  // Call the mintCertificate function
  const tx = await cpeCertificate.mintCertificate(
    recipientAddress,
    tokenURI,
    certificateData.name,
    certificateData.certificateId,
    certificateData.courseTitle,
    certificateData.issuer,
    certificateData.dateIssued,
    certificateData.completionDate,
    certificateData.cpeHours
  );

  // Wait for the transaction to be confirmed
  await tx.wait();

  console.log(`Certificate minted to ${recipientAddress}. Transaction Hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });