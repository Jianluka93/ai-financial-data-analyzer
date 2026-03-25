# Finanza Personale Pro - Guida all'Utilizzo

Benvenuto in **Finanza Personale Pro**, l'applicazione intelligente per il monitoraggio e l'analisi delle tue finanze. Questa guida ti aiuterà a preparare i tuoi file e a utilizzare al meglio le funzionalità dell'app.

---

## 🚀 Come Iniziare

1. **Prepara il file**: Assicurati che i tuoi dati siano in un formato supportato (Excel o CSV).
2. **Carica i dati**: Clicca sul pulsante **"Carica"** in alto a destra e seleziona il tuo file.
3. **Analizza**: Una volta caricato, l'app genererà automaticamente grafici, statistiche e una tabella dettagliata delle transazioni.
4. **Navigazione Grafici**: Puoi visualizzare i dati per Giorno, Mese o Anno. Nella vista **Giornaliera**, usa le frecce per navigare tra i mesi.
5. **Consigli AI**: Clicca su **"Genera Consigli AI"** per ricevere un'analisi personalizzata basata sui tuoi pattern di spesa.

---

## 📊 Formato dei File Supportati

L'applicazione accetta i seguenti formati:
- **Excel**: `.xlsx`, `.xls`
- **CSV**: `.csv` (separati da virgola o punto e virgola)

### Struttura Consigliata del File
Per una lettura ottimale, il tuo file dovrebbe avere una riga di intestazione (header) con nomi chiari per le colonne. L'app cercherà di identificare automaticamente le colonne basandosi sulle seguenti parole chiave:

| Tipo di Dato | Parole Chiave Cercate (non case-sensitive) |
| :--- | :--- |
| **Data** | `Data`, `Date`, `Giorno`, `Day` |
| **Descrizione** | `Descrizione`, `Nome`, `Causale`, `Oggetto`, `Voce` |
| **Entrate** | `Entrata`, `Guadagno`, `Income`, `Profit`, `Credito`, `Incasso` |
| **Uscite** | `Uscita`, `Spesa`, `Expense`, `Costo`, `Debito`, `Uscite` |

---

## 🌍 Supporto Multilingua
L'app supporta quattro lingue:
- **Italiano** (IT)
- **Inglese** (EN)
- **Tedesco** (DE)
- **Francese** (FR)

Puoi cambiare la lingua in qualsiasi momento dal menu a discesa in alto a destra.

---

## 🤖 Analisi AI (Locale con Ollama)
L'integrazione con l'intelligenza artificiale analizza i tuoi flussi di cassa per:
- Identificare spese ricorrenti eccessive.
- Suggerire strategie di risparmio.
- Fornire un riepilogo professionale del tuo andamento finanziario.

L'analisi viene eseguita **localmente** tramite **Ollama** per garantire la massima privacy dei tuoi dati finanziari. Non è richiesta alcuna connessione internet o chiave API esterna.

---

## 🚀 Configurazione Ollama
Per utilizzare l'assistente AI, devi avere Ollama installato sul tuo computer:

1. **Installa Ollama**: Scaricalo da [ollama.com](https://ollama.com).
2. **Scarica un modello**: Apri il terminale e scegli il modello in base alle prestazioni del tuo PC:
   - **Modello Pesante (Consigliato per PC potenti)**: `ollama run llama3`
   - **Modello Intermedio (Bilanciato)**: `ollama run phi3`
   - **Modello Leggero (Per PC meno potenti o portatili)**: `ollama run tinyllama`
3. **Configura le Origini**: Per permettere all'app di comunicare con Ollama dal browser, devi impostare la variabile d'ambiente `OLLAMA_ORIGINS`.
   - **Windows (PowerShell)**: `$env:OLLAMA_ORIGINS="*"; ollama serve`
   - **Mac/Linux**: `OLLAMA_ORIGINS="*" ollama serve`
4. **Utilizzo nell'App**:
   - Nella sezione **"Consulente AI"**, scrivi il nome del modello che hai installato (es. `llama3`, `phi3` o `tinyllama`) nel campo **"Modello Ollama"**.
   - **Parametri Avanzati**: Puoi personalizzare la risposta modificando i seguenti valori:
     - **Lunghezza Risposta (num_predict)**: Numero massimo di token generati. Aumentalo se la risposta si interrompe (es. 500-1000).
     - **Temperatura (temperature)**: Creatività del modello (0.1 = preciso, 0.8 = creativo). Per consigli finanziari si consiglia 0.4-0.5.
     - **Dimensione Contesto (num_ctx)**: Memoria del modello. Se hai molti dati, aumentalo (es. 4096).
     - **Limite Dati (slice)**: Numero di caratteri dei dati inviati all'IA. Se hai migliaia di righe, aumenta questo valore per non perdere informazioni.
   - Clicca su **"Analizza con AI"**.

---
*Finanza Personale Pro - Gestisci il tuo futuro, un centesimo alla volta.*
