# 🛡️ CareSync UK - Security Audit (Modules Xi, Omicron, Pi)

## 1. Module Xi: "The Gatekeeper" (Video Privacy)
**Risk:** Unauthorized access to live video feeds creates a severe privacy violation and safety risk.

### 🔒 Protocols:
* **WebRTC Encryption:** All video streams (Doorbell -> App) must be encrypted End-to-End (DTLS/SRTP).
* **"No-Cloud" Policy:** Video footage is NOT stored on CareSync servers. Live streaming happens peer-to-peer.
* **The "Interceptor" Logic:** * Carer has "Override Authority." If Carer presses "Intercept", the audio path to the Patient is physically muted to prevent coercion by the visitor.
* **GDPR Compliance:** Visitors must be visually notified they are being streamed (Virtual Sticker Logic).

## 2. Module Omicron: "The Wealth Wizard" (Financial Isolation)
**Risk:** Storing asset data (House Value, Savings) makes the database a target for hackers.

### 🔒 Protocols:
* **Ephemeral Calculation:** Financial data entered into the "Care Funding Calculator" is processed in the browser's Random Access Memory (RAM) only.
* **Zero-Persistence:** Once the user closes the calculator, the data is wiped. We do NOT save "Total Savings" to Firestore.
* **Local Logic:** The logic for "Upper Capital Limit" (£23,250) runs entirely on the client side. No data is sent to a backend for processing.

## 3. Module Pi: "The Oxygen Mask" (Carer Anonymity)
**Risk:** Carers venting frustration ("I hate this situation") could be used against them legally or emotionally if leaked.

### 🔒 Protocols:
* **The Vent Room:** Messages are stored without User IDs (Aggregated Anonymity).
* **Auto-Destruct:** Vent messages are deleted after 24 hours (Snapchat-style retention).