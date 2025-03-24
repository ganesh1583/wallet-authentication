import './App.css'
import { useState } from "react";
import { ethers } from "ethers";

function App() {
  return (
    <>
      <Login />
    </>
  );
}

const Login = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleLogin = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const nonce = "1234";

      // Ask user to sign the message
      const signature = await signer.signMessage(nonce);

      // Send signed message to backend for verification
      const verifyResponse = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, signature }),
      });

      const data = await verifyResponse.json();

      if (verifyResponse.ok) {
        localStorage.setItem("authToken", data.token);
        alert("Login successful!");
      } else {
        alert("Login failed: " + data.error);
      }
      
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with MetaMask</button>
      {walletAddress && <p>Connected: {walletAddress}</p>}
    </div>
  );
};

export default App;
