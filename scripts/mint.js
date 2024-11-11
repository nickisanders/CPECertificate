const { ethers } = require("hardhat");

async function main(
  contractAddress,
  recipientAddress,
  tokenURI,
  name,
  certificateId,
  courseTitle,
  issuer,
  dateIssued,
  completionDate,
  cpeHours
) {
  // Load the CPECertificate contract
  const CPECertificate = await ethers.getContractFactory("CPECertificate");
  const cpeCertificate = await CPECertificate.attach(contractAddress);

  // Call the mintCertificate function
  const tx = await cpeCertificate.mintCertificate(
    recipientAddress,
    tokenURI,
    name,
    certificateId,
    courseTitle,
    issuer,
    dateIssued,
    completionDate,
    cpeHours
  );

  // Wait for the transaction to be confirmed
  await tx.wait();

  console.log(`Certificate minted to ${recipientAddress}. Transaction Hash: ${tx.hash}`);
}

// Export the function for other scripts to use
module.exports = { main };
