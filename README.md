
# Aegis AI - Intrusion Detection System (Windows Setup Guide)

Aegis AI is a professional cybersecurity dashboard that uses the Gemini 3 Flash model to perform real-time behavioral analysis on network traffic.

## 🚀 Quick Start for Windows

### 1. Prerequisites
Ensure you have the following installed on your Windows system:
*   **Node.js**: [Download here](https://nodejs.org/) (This includes `npx`, which we will use to run a local server).
*   **Google AI API Key**: Get your key from the [Google AI Studio](https://aistudio.google.com/).

### 2. Project Setup
1.  Create a new folder on your Desktop (e.g., `Aegis-IDS`).
2.  Place all the project files (`index.html`, `index.tsx`, `App.tsx`, `types.ts`, `constants.ts`, `components/`, and `services/`) into that folder.

### 3. Running the Application
Open **PowerShell** or **Command Prompt** and navigate to your folder.

#### Option A: Using PowerShell (Recommended)
Run the following commands:

```powershell
# Set your Gemini API Key for the current session
$env:API_KEY="YOUR_ACTUAL_API_KEY_HERE"

# Start a local development server
npx serve .
```

#### Option B: Using Command Prompt (CMD)
Run the following commands:

```cmd
:: Set your Gemini API Key for the current session
set API_KEY=YOUR_ACTUAL_API_KEY_HERE

:: Start a local development server
npx serve .
```

### 4. Access the Dashboard
Once the server starts, it will provide a local URL (usually `http://localhost:3000`).
1.  Open **Google Chrome** or **Microsoft Edge**.
2.  Navigate to the URL provided.
3.  Click **"SCAN NETWORK"** to begin the AI-powered threat detection.

---

## 🛡️ Key Features
*   **Live Packet Simulation**: Generates synthetic network traffic matching the NSL-KDD dataset structure.
*   **AI Heuristics**: Uses Gemini 3 Flash to classify traffic as `normal`, `neptune`, `smurf`, etc.
*   **Forensic Investigation**: Click any log entry to view a detailed AI-generated breakdown of the threat vector.
*   **Data Export**: Export your captured sessions to a `data.csv` for further analysis in Python or Scikit-Learn.

## ⚠️ Troubleshooting on Windows
*   **Browser Security**: If the logs don't appear, ensure you are running via `http://` (local server) and not `file://`.
*   **API Key Errors**: If the "AI Analyzing" step fails, double-check that your API Key is valid and that the `$env:API_KEY` (PowerShell) or `set API_KEY` (CMD) command was executed in the **same window** you used to run the server.
*   **Port Conflicts**: If port 3000 is busy, `npx serve` will automatically suggest another port.

---
*Developed for Senior Cybersecurity Data Science Workflows.*
