# Personal Finance Pro - Benutzerhandbuch

Willkommen bei **Personal Finance Pro**, der intelligenten Anwendung zur Überwachung und Analyse Ihrer Finanzen. Dieses Handbuch hilft Ihnen bei der Vorbereitung Ihrer Dateien und der optimalen Nutzung der Funktionen der App.

---

## 🚀 Erste Schritte

1. **Datei vorbereiten**: Stellen Sie sicher, dass Ihre Daten in einem unterstützten Format vorliegen (Excel oder CSV).
2. **Daten hochladen**: Klicken Sie oben rechts auf die Schaltfläche **"Hochladen"** und wählen Sie Ihre Datei aus.
3. **Analysieren**: Nach dem Hochladen generiert die App automatisch Diagramme, Statistiken und eine detaillierte Transaktionstabelle.
4. **Diagramm-Navigation**: Sie können Daten nach Tag, Monat oder Jahr anzeigen. Verwenden Sie in der **Tagesansicht** die Pfeile, um zwischen den Monaten zu navigieren.
5. **KI-Beratung**: Klicken Sie auf **"KI-Beratung generieren"**, um eine personalisierte Analyse basierend auf Ihren Ausgabemustern zu erhalten.

---

## 📊 Unterstützte Dateiformate

Die Anwendung akzeptiert die folgenden Formate:
- **Excel**: `.xlsx`, `.xls`
- **CSV**: `.csv` (durch Komma oder Semikolon getrennt)

### Empfohlene Dateistruktur
Für ein optimales Einlesen sollte Ihre Datei eine Kopfzeile mit klaren Spaltennamen haben. Die App versucht, Spalten automatisch anhand der folgenden Schlüsselwörter zu identifizieren:

| Datentyp | Suchbegriffe (Groß-/Kleinschreibung egal) |
| :--- | :--- |
| **Datum** | `Data`, `Date`, `Giorno`, `Day` |
| **Beschreibung** | `Descrizione`, `Nome`, `Causale`, `Oggetto`, `Voce` |
| **Einnahmen** | `Entrata`, `Guadagno`, `Income`, `Profit`, `Credito`, `Incasso` |
| **Ausgaben** | `Uscita`, `Spesa`, `Expense`, `Costo`, `Debito`, `Uscite` |

---

## 🌍 Mehrsprachige Unterstützung
Die App unterstützt vier Sprachen:
- **Italienisch** (IT)
- **Englisch** (EN)
- **Deutsch** (DE)
- **Französisch** (FR)

Sie können die Sprache jederzeit über das Dropdown-Menü oben rechts ändern.

---

## 🤖 KI-Analyse (Lokal mit Ollama)
Die Integration mit künstlicher Intelligenz analysiert Ihre Cashflows, um:
- Übermäßige wiederkehrende Ausgaben zu identifizieren.
- Sparstrategien vorzuschlagen.
- Eine professionelle Zusammenfassung Ihrer finanziellen Leistung zu erstellen.

Die Analyse wird **lokal** über **Ollama** durchgeführt, um maximale Privatsphäre für Ihre Finanzdaten zu gewährleisten. Es ist keine Internetverbindung oder ein externer API-Schlüssel erforderlich.

---

## 🚀 Ollama-Konfiguration
Um den KI-Assistenten zu nutzen, müssen Sie Ollama auf Ihrem Computer installiert haben:

1. **Ollama installieren**: Laden Sie es von [ollama.com](https://ollama.com) herunter.
2. **Modell herunterladen**: Öffnen Sie Ihr Terminal und wählen Sie ein Modell basierend auf der Leistung Ihres PCs:
   - **Schweres Modell (Empfohlen für leistungsstarke PCs)**: `ollama run llama3`
   - **Mittleres Modell (Ausgewogen)**: `ollama run phi3`
   - **Leichtes Modell (Für weniger leistungsstarke PCs oder Laptops)**: `ollama run tinyllama`
3. **Ursprünge konfigurieren**: Damit die App über den Browser mit Ollama kommunizieren kann, müssen Sie die Umgebungsvariable `OLLAMA_ORIGINS` setzen.
   - **Windows (PowerShell)**: `$env:OLLAMA_ORIGINS="*"; ollama serve`
   - **Mac/Linux**: `OLLAMA_ORIGINS="*" ollama serve`
4. **Verwendung in der App**:
   - Geben Sie im Bereich **"KI-Berater"** den Namen des Modells ein, das Sie installiert haben (z. B. `llama3`, `phi3` oder `tinyllama`), in das Feld **"Ollama-Modell"**.
   - **Erweiterte Parameter**: Passen Sie die Antwort durch Ändern dieser Werte an:
     - **Antwortlänge (num_predict)**: Maximale Anzahl generierter Token. Erhöhen Sie diesen Wert, wenn die Antwort abgebrochen wird (z. B. 500-1000).
     - **Temperatur**: Modellkreativität (0.1 = präzise, 0.8 = kreativ). Für Finanzberatung wird 0.4-0.5 empfohlen.
     - **Kontextgröße (num_ctx)**: Modellspeicher. Wenn Sie viele Daten haben, erhöhen Sie diesen Wert (z. B. 4096).
     - **Datenlimit (slice)**: Anzahl der an die KI gesendeten Datenzeichen. Erhöhen Sie diesen Wert bei Tausenden von Zeilen.
   - Klicken Sie auf **"Mit KI analysieren"**.

---
*Personal Finance Pro - Verwalten Sie Ihre Zukunft, Cent für Cent.*
