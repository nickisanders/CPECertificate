import React, { useState, useEffect } from 'react';
import { ethers, JsonRpcProvider, Contract } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import abi from './CPECertificateABI.json'; // Import the ABI of CPECertificate

function App() {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Replace with your locally deployed contract address

  useEffect(() => {
    const connectWallet = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);
        fetchNFTs(userAddress); // Fetch NFTs after connecting
      } else {
        alert('MetaMask not found. Please install it to use this site.');
      }
    };

    connectWallet();
  }, []);

  // Function to fetch NFTs owned by the connected wallet
  const fetchNFTs = async (walletAddress) => {
    const localProvider = new JsonRpcProvider("http://localhost:8545"); // Connect to Hardhat node
    const contract = new Contract(contractAddress, abi, localProvider);
  
    try {
      const nftData = [];
  
      // Get all Transfer events where the "to" address is the user's address
      const transferEvents = await contract.queryFilter(
        contract.filters.Transfer(null, walletAddress)
      );
  
      // Extract token IDs from Transfer events
      for (let event of transferEvents) {
        const tokenId = event.args.tokenId;
  
        // Fetch NFT details for each tokenId
        const certificateDetailsArray = await contract.getCertificateDetails(tokenId);
        const tokenURI = await contract.tokenURI(tokenId); // Fetch token URI for the image
  
        // Map the array to meaningful property names
        const certificateDetails = {
          name: certificateDetailsArray[0],
          certificateId: certificateDetailsArray[1],
          courseTitle: certificateDetailsArray[2],
          issuer: certificateDetailsArray[3],
          dateIssued: Number(certificateDetailsArray[4]), // Convert BigInt to a regular number
          completionDate: Number(certificateDetailsArray[5]), // Convert BigInt to a regular number
          cpeHours: Number(certificateDetailsArray[6]),
        };
  
        nftData.push({
          tokenId: tokenId.toString(),
          ...certificateDetails,
          tokenURI,
        });
      }
  
      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };
  
  
  

  // Refresh NFTs by re-calling fetchNFTs
  const refreshNFTs = () => {
    if (account) {
      fetchNFTs(account);
    }
  };

  return (
    <div>
      <h1>CPECertificate NFT Viewer</h1>
      {account ? (
        <>
          <p>Connected Wallet: {account}</p>
          <button onClick={refreshNFTs}>Refresh NFTs</button>
          {nfts.length > 0 ? (
            <div>
              <h2>Your NFTs</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {nfts.map((nft, index) => (
                  <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px' }}>
                    <img src={nft.tokenURI} alt="NFT" style={{ width: '100%', height: 'auto' }} />
                    <h3>Certificate ID: {nft.certificateId}</h3>
                    <p><strong>Name:</strong> {nft.name}</p>
                    <p><strong>Course Title:</strong> {nft.courseTitle}</p>
                    <p><strong>Issuer:</strong> {nft.issuer}</p>
                    <p><strong>Date Issued:</strong> {new Date(nft.dateIssued * 1000).toLocaleDateString()}</p>
                    <p><strong>Completion Date:</strong> {new Date(nft.completionDate * 1000).toLocaleDateString()}</p>
                    <p><strong>CPE Hours:</strong> {nft.cpeHours}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No NFTs found in this wallet.</p>
          )}
        </>
      ) : (
        <p>Please connect your MetaMask wallet.</p>
      )}
    </div>
  );
}

export default App;
