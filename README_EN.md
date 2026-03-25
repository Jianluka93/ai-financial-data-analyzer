# Personal Finance Pro - User Guide

Welcome to **Personal Finance Pro**, the smart application for monitoring and analyzing your finances. This guide will help you prepare your files and make the most of the app's features.

---

## 🚀 How to Get Started

1. **Prepare the file**: Ensure your data is in a supported format (Excel or CSV).
2. **Upload data**: Click the **"Upload"** button at the top right and select your file.
3. **Analyze**: Once uploaded, the app will automatically generate charts, statistics, and a detailed transaction table.
4. **Chart Navigation**: You can view data by Day, Month, or Year. In the **Daily** view, use the arrows to navigate between months.
5. **AI Advice**: Click on **"Generate AI Advice"** to receive a personalized analysis based on your spending patterns.

---

## 📊 Supported File Formats

The application accepts the following formats:
- **Excel**: `.xlsx`, `.xls`
- **CSV**: `.csv` (comma or semicolon separated)

### Recommended File Structure
For optimal reading, your file should have a header row with clear column names. The app will try to automatically identify columns based on the following keywords:

| Data Type | Search Keywords (case-insensitive) |
| :--- | :--- |
| **Date** | `Data`, `Date`, `Giorno`, `Day` |
| **Description** | `Descrizione`, `Nome`, `Causale`, `Oggetto`, `Voce` |
| **Income** | `Entrata`, `Guadagno`, `Income`, `Profit`, `Credito`, `Incasso` |
| **Expense** | `Uscita`, `Spesa`, `Expense`, `Costo`, `Debito`, `Uscite` |

---

## 🌍 Multi-language Support
The app supports four languages:
- **Italian** (IT)
- **English** (EN)
- **German** (DE)
- **French** (FR)

You can change the language at any time from the dropdown menu at the top right.

---

## 🤖 AI Analysis (Local with Ollama)
The artificial intelligence integration analyzes your cash flows to:
- Identify excessive recurring expenses.
- Suggest saving strategies.
- Provide a professional summary of your financial performance.

The analysis is performed **locally** via **Ollama** to ensure maximum privacy for your financial data. No internet connection or external API key is required.

---

## 🚀 Ollama Configuration
To use the AI assistant, you must have Ollama installed on your computer:

1. **Install Ollama**: Download it from [ollama.com](https://ollama.com).
2. **Download a model**: Open your terminal and choose a model based on your PC's performance:
   - **Heavy Model (Recommended for powerful PCs)**: `ollama run llama3`
   - **Intermediate Model (Balanced)**: `ollama run phi3`
   - **Light Model (For less powerful PCs or laptops)**: `ollama run tinyllama`
3. **Configure Origins**: To allow the app to communicate with Ollama from the browser, you must set the `OLLAMA_ORIGINS` environment variable.
   - **Windows (PowerShell)**: `$env:OLLAMA_ORIGINS="*"; ollama serve`
   - **Mac/Linux**: `OLLAMA_ORIGINS="*" ollama serve`
4. **Usage in the App**:
   - In the **"AI Consultant"** section, type the name of the model you installed (e.g., `llama3`, `phi3`, or `tinyllama`) in the **"Ollama Model"** field.
   - **Advanced Parameters**: Customize the response by adjusting these values:
     - **Response Length (num_predict)**: Max tokens generated. Increase if the response is cut off (e.g., 500-1000).
     - **Temperature**: Model creativity (0.1 = precise, 0.8 = creative). 0.4-0.5 is recommended for financial advice.
     - **Context Size (num_ctx)**: Model memory. If you have a lot of data, increase it (e.g., 4096).
     - **Data Limit (slice)**: Number of characters of data sent to the AI. Increase this if you have thousands of rows.
   - Click **"Analyze with AI"**.

---
*Personal Finance Pro - Manage your future, one cent at a time.*
