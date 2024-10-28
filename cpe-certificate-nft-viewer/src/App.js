import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import abi from './CPECertificateABI.json'; // Import ABI JSON

function App() {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const contractAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Replace with your contract address

  useEffect(() => {
    const connectMetaMask = async () => {
      // const provider = await detectEthereumProvider();
      // if (provider) {
      //   await provider.request({ method: 'eth_requestAccounts' });
      //   const web3 = new Web3(provider); 
      //   const accounts = await web3.eth.getAccounts();
      //   setAccount(accounts[0]);
      // } else {
      //   alert('MetaMask not found. Please install it to use this site.');
      // }

      const web3 = new Web3('http://127.0.0.1:8545'); 
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    connectMetaMask();
  }, []);

  const fetchNFTs = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
      const balance = await contract.methods.balanceOf(account).call();
      const nftData = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
        const certificateDetails = await contract.methods.getCertificateDetails(tokenId).call();
        nftData.push({ tokenId, ...certificateDetails });
      }

      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  return (
    <div>
      <h1>CPECertificate NFT Viewer</h1>
      {account ? (
        <>
          <p>Connected Wallet: {account}</p>
          <button onClick={fetchNFTs}>Fetch My CPECertificate NFTs</button>
          <div>
            {nfts.length > 0 ? (
              nfts.map((nft) => (
                <div key={nft.tokenId}>
                  <h2>Certificate ID: {nft.certificateId}</h2>
                  <p>Name: {nft.name}</p>
                  <p>Course Title: {nft.courseTitle}</p>
                  <p>Issuer: {nft.issuer}</p>
                  <p>Date Issued: {new Date(nft.dateIssued * 1000).toLocaleDateString()}</p>
                  <p>Completion Date: {new Date(nft.completionDate * 1000).toLocaleDateString()}</p>
                  <p>CPE Hours: {nft.cpeHours}</p>
                </div>
              ))
            ) : (
              <p>No CPECertificate NFTs found in this wallet.</p>
            )}
          </div>
        </>
      ) : (
        <p>Please connect your MetaMask wallet.</p>
      )}
    </div>
  );
}

export default App;