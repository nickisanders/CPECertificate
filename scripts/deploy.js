async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contract with the account:", deployer.address);
  
    const CPECertificate = await ethers.getContractFactory("CPECertificate");
    const cpeCertificate = await CPECertificate.deploy("CPE Certificate NFT", "CPE", deployer.address);
    await cpeCertificate.deployed();
  
    console.log("CPECertificate contract deployed to:", cpeCertificate.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });  