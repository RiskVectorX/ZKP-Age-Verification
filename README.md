# 🔐 Zero-Knowledge Age Verification App

## 📝 Overview
This is a full-stack Cybersecurity application designed to facilitate age verification without the disclosure of Personally Identifiable Information (PII). By leveraging **Zero-Knowledge Proofs (zk-SNARKs)**, the system allows a user to prove they meet a specific age threshold (e.g., $\ge 18$) to a server without ever transmitting their actual birth year.

Instead of sending sensitive data to a backend database, the app generates a cryptographic proof locally within the browser, ensuring that sensitive user data never leaves the client-side environment.

---

## ✨ Features

* **🛡️ Client-Side Proving:** Uses WebAssembly (WASM) to generate Groth16 proofs directly in the user's browser, ensuring data privacy at the source.
* **🧮 Cryptographic Verification:** A Node.js backend mathematically verifies the proof against a pre-generated Verification Key without ever seeing the original input.
* **🎟️ Stateless Authorization:** Issues a JSON Web Token (JWT) upon successful verification to grant access to restricted application routes ("VIP Area").
* **🚫 State Leakage Protection:** Implements active event listeners that instantly destroy active JWTs and revoke UI access if the user attempts to modify inputs after verification.

---

## 🚀 How It Works

1.  **Input:** The user enters their birth year (e.g., $2000$) locally.
2.  **Local Circuit:** A pre-compiled `.wasm` circuit calculates the logic: 
    $$\text{Current Year} - \text{Birth Year} \ge 18$$
3.  **Proof Generation:** SnarkJS generates a proof payload. The raw birth year is discarded immediately and never leaves the client.
4.  **Verification:** The payload is sent via POST to `/verify-age`. The server checks the proof against `verification_key.json`.
5.  **Access:** If valid, the server returns a JWT. The client uses this as a Bearer token to access the protected `GET /secret-content` endpoint.



---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Circuit Logic** | Circom 2.0 |
| **Cryptography** | SnarkJS (Groth16 Protocol) |
| **Backend** | Node.js, Express.js |
| **Authentication** | JSON Web Tokens (jsonwebtoken) |
| **Frontend** | Vanilla HTML / JS / CSS |

---

## 📦 Getting Started

### Prerequisites
* **Node.js** (v16 or higher recommended)
* **Modern Web Browser** with WASM support (Chrome, Firefox, Edge, etc.)

### Quick Start
To launch the application using the pre-compiled circuits:

```bash
# Install dependencies
npm install

# Start the server
node server.js

The application will be available at: http://localhost:3000

🧠 Circuit Compilation (Optional)
If you wish to modify the ZK logic, you will need to recompile the Circom circuit and generate new keys. You must have circom installed globally on your system.

1. Compile the circuit:

Bash
circom age_check.circom --r1cs --wasm --sym
2. Setup Groth16 & Powers of Tau (Demo purposes only):

Bash
# Start ceremony
npx snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
npx snarkjs powersoftau prepare phase2 pot12_0000.ptau pot12_final.ptau -v

# Generate ZKey
npx snarkjs groth16 setup age_check.r1cs pot12_final.ptau age_check_0000.zkey
npx snarkjs zkey contribute age_check_0000.zkey age_check_final.zkey --name="1st Contributor" -v
3. Export Verification Key:

Bash
npx snarkjs zkey export verificationkey age_check_final.zkey verification_key.json
⚠️ Limitations & Future Work
The Oracle Problem: Currently, the user manually types their birth year. In a production environment, this would be replaced by a Verifiable Credential (VC) or a digitally signed ID to prevent manual falsification of inputs.

Trusted Setup: This project uses a basic local setup. Production-grade applications require a Multi-Party Computation (MPC) ceremony to ensure the cryptographic "toxic waste" (randomness) is securely destroyed.

📄 License
This project is open-source and available under the MIT License.

Developed by Sarthak Suman
This project is open-source and available under the MIT License.

Developed by Sarthak Suman
