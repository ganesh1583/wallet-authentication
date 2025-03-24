const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', async (req, res) => {
    const { walletAddress, signature } = req.body;
    const nonce = "1234";

    try {
        const recoveredAddress = ethers.verifyMessage(nonce, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            console.log("Invalid wallet address");
            return res.status(401).json({ error: "Invalid signature" });
        }

        console.log("Verification successful for:", recoveredAddress);

        const token = "this is token";

        res.json({ token });

    } catch (error) {
        console.error("Authentication failed:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
