const express = require("express");
const snarkjs = require("snarkjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const SECRET_KEY = "super-secret-key-for-demo-only"; 

app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, Wasm, ZKey)
app.use(express.static("."));
app.use("/age_check_js", express.static(path.join(__dirname, "age_check_js")));

// Load Keys
let verificationKey;
try {
    verificationKey = JSON.parse(fs.readFileSync("verification_key.json", "utf-8"));
} catch (e) {
    console.error("❌ ERROR: verification_key.json missing. Run the setup commands in README!");
}

// --- DEBUGGING LOG ---
console.log("--------------------------------------");
console.log("✅ SERVER CODE RELOADED SUCCESSFULLY");
console.log("✅ Route POST /verify-age is active");
console.log("✅ Route GET /secret-content is active"); // <--- This confirms the VIP button will work
console.log("--------------------------------------");

// THE VITAL ROUTE (Verifies the ZK Proof)
app.post("/verify-age", async (req, res) => {
    console.log("📨 Received request at /verify-age"); 
    const { proof, publicSignals } = req.body;

    try {
        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        const isAdult = publicSignals[0];

        if (isValid && isAdult === "1") {
            const token = jwt.sign({ ageGroup: "18+" }, SECRET_KEY);
            return res.json({ success: true, message: "Verification Successful!", token });
        } else {
            return res.status(403).json({ success: false, message: "Verification Failed" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, message: "Internal Error" });
    }
});

// --- NEW PROTECTED ROUTE (The VIP Area) ---
app.get("/secret-content", (req, res) => {
    console.log("🔓 VIP Access Attempted...");
    const authHeader = req.headers.authorization;
    
    // 1. Check if token exists
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "❌ Access Denied: No Token Provided" });
    }

    // 2. Extract token (Format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verify the signature
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 4. If valid, send the secret data
        res.json({ 
            success: true, 
            message: "🎉 Welcome to the VIP Area! You are verified as 18+.", 
            data: "Here is the exclusive content..." 
        });
    } catch (e) {
        return res.status(403).json({ success: false, message: "❌ Access Denied: Invalid or Fake Token" });
    }
});
// -----------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});