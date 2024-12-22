import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import abi from './CPECertificateABI.json'; // Import the ABI of CPECertificate
import './App.css'; // Import the CSS file for DApp styles

function App() {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [expandedNFT, setExpandedNFT] = useState(null); // To keep track of the expanded NFT
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not found. Please install it to use this site.');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);
      fetchNFTs(userAddress, provider);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNfts([]);
    setError(null);
    console.log('Wallet disconnected');
  };

  const fetchNFTs = async (walletAddress, provider) => {
    setLoading(true);
    setError(null);
    try {
      const contract = new Contract(contractAddress, abi, provider);
      const nftData = [];

      const transferEvents = await contract.queryFilter(
        contract.filters.Transfer(null, walletAddress)
      );

      for (let event of transferEvents) {
        const tokenId = event.args.tokenId;
        const certificateDetailsArray = await contract.getCertificateDetails(tokenId);
        const tokenURI = await contract.tokenURI(tokenId);

        const certificateDetails = {
          name: certificateDetailsArray[0],
          certificateId: certificateDetailsArray[1],
          courseTitle: certificateDetailsArray[2],
          issuer: certificateDetailsArray[3],
          dateIssued: Number(certificateDetailsArray[4]),
          completionDate: Number(certificateDetailsArray[5]),
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
      console.error('Error fetching NFTs:', error);
      setError('Failed to load NFTs. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const refreshNFTs = async () => {
    if (account) {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      await fetchNFTs(account, provider);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
  };

  const handleSwitchChange = (event) => {
    setViewMode(event.target.checked ? 'list' : 'card');
  };

  const toggleNFTExpansion = (index) => {
    setExpandedNFT(expandedNFT === index ? null : index);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="logo">CPE Certificate Dashboard</h1>

        <div className="wallet-container">
          {account && (
            <p className="wallet-status">🦊 Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          )}
          {account ? (
            <button className="btn btn-disconnect" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          ) : (
            <button className="btn btn-connect" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main>
        {account ? (
          <>
            <div className="nft-header-container">
              <h2>Your CPE Certificates</h2>
              <button className="btn btn-refresh" onClick={refreshNFTs} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh NFTs'}
              </button>

              <div className="view-toggle">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={viewMode === 'list'}
                    onChange={handleSwitchChange}
                  />
                  <span className="slider"></span>
                </label>
                <p>{viewMode === 'card' ? 'Card View' : 'List View'}</p>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
              <p className="loading">Loading NFTs...</p>
            ) : nfts.length > 0 ? (
              viewMode === 'card' ? (
                <div className="nft-container">
                  {nfts.map((nft, index) => (
                    <div key={index} className="nft-card">
                      <img src={nft.tokenURI} alt="NFT" className="nft-image" />
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
              ) : (
                <ul className="nft-list">
                  {nfts.map((nft, index) => (
                    <li key={index} className="nft-list-item" onClick={() => toggleNFTExpansion(index)}>
                      <img src={nft.tokenURI} alt="NFT" className="nft-image-left" />
                      <div className="nft-card-content">
                        <h3>Certificate ID: {nft.certificateId}</h3>
                        <p><strong>Course Title:</strong> {nft.courseTitle}</p>
                      </div>
                      {expandedNFT === index && (
                        <div className="nft-card-centered">
                          <div className="nft-card">
                            <img src={nft.tokenURI} alt="NFT" className="nft-image" />
                            <h3>Certificate ID: {nft.certificateId}</h3>
                            <p><strong>Name:</strong> {nft.name}</p>
                            <p><strong>Course Title:</strong> {nft.courseTitle}</p>
                            <p><strong>Issuer:</strong> {nft.issuer}</p>
                            <p><strong>Date Issued:</strong> {new Date(nft.dateIssued * 1000).toLocaleDateString()}</p>
                            <p><strong>Completion Date:</strong> {new Date(nft.completionDate * 1000).toLocaleDateString()}</p>
                            <p><strong>CPE Hours:</strong> {nft.cpeHours}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p>No NFTs found in this wallet.</p>
            )}
          </>
        ) : (
          <p>Please connect your MetaMask wallet.</p>
        )}
      </main>
    </div>
  );
}

export default App;
