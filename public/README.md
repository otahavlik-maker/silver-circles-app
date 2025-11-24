# CareSync UK (formerly SilverCircles) - Version 9.0

## 🌍 The Mission
To address the "Invisible Burdens" of elderly care: paperwork, financial friction between siblings, and civic risks. We are moving beyond simple health tracking to a complete Family Care Operating System.

## 🏗 Architecture: "The Singularity"
We use a verified tech stack designed for security and ease of use on touchscreens.

- **Frontend:** React v18 + Vite (Fast, Modern)
- **Styling:** Tailwind CSS (Mobile-First, Large Touch Targets)
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **Security:** "Zero-Knowledge" Client-Side Encryption (AES-256) via Web Crypto API.
- **Integrations (Planned):**
  - Stripe Connect (Family Treasury)
  - Lob/Click2Mail (Hybrid Mail)
  - UK Power Networks (Civic Radar)

## 🔐 Security Protocol
Data is encrypted **before** it leaves the user's device.
- **Vault Key:** Derived from User Password (PBKDF2).
- **Storage:** Firestore only sees encrypted strings (`enc::...`).
- **Privacy:** Even the database administrators cannot read the notes or vitals.

## 🧩 The 5-Layer Stack
1. **Layer 1 (Body):** Vitals, Meds, Nutrition.
2. **Layer 2 (Mind):** Reminiscence, Entertainment.
3. **Layer 3 (Home):** IoT Safety, Smart Labels.
4. **Layer 4 (Society):** Community connection.
5. **Layer 5 (Admin - CURRENT FOCUS):** Legal, Financial, Civic Risk.

## 🚀 Final Modules (In Development)
- **Module Gamma (Digital Postman):** Send physical letters via API.
- **Module Delta (Family Treasury):** Shared expense ledger with OCR.
- **Module Epsilon (Civic Radar):** Real-time power cuts & flu tracking.
- **Module Zeta (Sunset Mode):** End-of-life administration & memorial.

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Firebase Account

### Quick Start
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install