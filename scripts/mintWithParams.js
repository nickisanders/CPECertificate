const { main } = require("./mint");

(async () => {
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with your deployed contract address
  const recipientAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // Replace with the recipient wallet address
  const tokenURI = "http://localhost:3000/images/certificate.png"; // Replace with your metadata URI
  const name = "John Doe"; // Certificate holder's name
  const certificateId = "CERT-123"; // Certificate ID
  const courseTitle = "Blockchain Fundamentals"; // Course title
  const issuer = "CPE Academy"; // Issuer name
  const dateIssued = Math.floor(Date.now() / 1000); // Current timestamp (seconds)
  const completionDate = Math.floor(Date.now() / 1000); // Replace with actual date in seconds
  const cpeHours = 8; // Number of CPE hours

  try {
    await main(
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
    );
  } catch (error) {
    console.error("Error minting certificate:", error);
  }
})();
