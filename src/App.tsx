/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  BrainCircuit,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Download,
  Trash2,
  AlertCircle,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  Cpu
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { it, enUS, de, fr } from 'date-fns/locale';
import { Transaction, TransactionType, MonthlyStats } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Language = 'it' | 'en' | 'de' | 'fr';

const translations = {
  it: {
    title: "AI Financial Data Analyzer",
    subtitle: "Monitoraggio intelligente delle tue finanze mensili.",
    upload: "Carica",
    export: "Esporta",
    clear: "Pulisci tutto",
    noFile: "Nessun file caricato",
    noFileDesc: "Carica o trascina un file Excel o CSV contenente le tue spese e i tuoi guadagni per iniziare l'analisi professionale.",
    income: "Entrate Totali",
    expense: "Uscite Totali",
    balance: "Bilancio Netto",
    searchTotal: "Totale",
    monthlyTrend: "Andamento Mensile",
    dailyTrend: "Andamento Giornaliero",
    yearlyTrend: "Andamento Annuale",
    daily: "Giornaliero",
    monthly: "Mensile",
    yearly: "Annuale",
    positive: "Positivo",
    negative: "Negativo",
    aiConsultant: "Consulente AI",
    aiPlaceholder: "Clicca il pulsante sotto per ricevere consigli personalizzati basati sui tuoi dati.",
    aiAnalyze: "Analizza con AI",
    aiError: "Errore nella generazione dei consigli AI.",
    aiNoAdvice: "Non è stato possibile generare consigli al momento.",
    searchPlaceholder: "Cerca spesa (es. Hotel)...",
    allMonths: "Tutti i mesi",
    date: "Data",
    description: "Descrizione",
    category: "Mese",
    amount: "Importo",
    noTransactions: "Nessuna transazione trovata con i filtri attuali.",
    incomeLabel: "Entrate",
    expenseLabel: "Uscite",
    ollamaModel: "Modello Ollama",
    ollamaPlaceholder: "es. tinyllama",
    ollamaError: "Errore: Assicurati che Ollama sia attivo con OLLAMA_ORIGINS=\"*\"",
    numPredict: "Lunghezza Risposta (num_predict)",
    temperature: "Temperatura (temperature)",
    numCtx: "Dimensione Contesto (num_ctx)",
    dataSlice: "Limite Dati (slice)",
    langName: "IT",
    flag: "it",
    dark: "Tema Scuro",
    light: "Tema Chiaro"
  },
  en: {
    title: "AI Financial Data Analyzer",
    subtitle: "Smart monitoring of your monthly finances.",
    upload: "Upload",
    export: "Export",
    clear: "Clear all",
    noFile: "No file uploaded",
    noFileDesc: "Upload or drag and drop an Excel or CSV file containing your expenses and income to start the professional analysis.",
    income: "Total Income",
    expense: "Total Expenses",
    balance: "Net Balance",
    searchTotal: "Total",
    monthlyTrend: "Monthly Trend",
    dailyTrend: "Daily Trend",
    yearlyTrend: "Yearly Trend",
    daily: "Daily",
    monthly: "Monthly",
    yearly: "Yearly",
    positive: "Positive",
    negative: "Negative",
    aiConsultant: "AI Consultant",
    aiPlaceholder: "Click the button below to receive personalized advice based on your data.",
    aiAnalyze: "Analyze with AI",
    aiError: "Error generating AI advice.",
    aiNoAdvice: "Could not generate advice at this time.",
    searchPlaceholder: "Search expense (e.g. Hotel)...",
    allMonths: "All months",
    date: "Date",
    description: "Description",
    category: "Month",
    amount: "Amount",
    noTransactions: "No transactions found with current filters.",
    incomeLabel: "Income",
    expenseLabel: "Expenses",
    ollamaModel: "Ollama Model",
    ollamaPlaceholder: "e.g. tinyllama",
    ollamaError: "Error: Ensure Ollama is running with OLLAMA_ORIGINS=\"*\"",
    numPredict: "Response Length (num_predict)",
    temperature: "Temperature (temperature)",
    numCtx: "Context Size (num_ctx)",
    dataSlice: "Data Limit (slice)",
    langName: "EN",
    flag: "us",
    dark: "Dark Mode",
    light: "Light Mode"
  },
  de: {
    title: "AI Financial Data Analyzer",
    subtitle: "Intelligente Überwachung Ihrer monatlichen Finanzen.",
    upload: "Hochladen",
    export: "Exportieren",
    clear: "Alles löschen",
    noFile: "Keine Datei hochgeladen",
    noFileDesc: "Laden Sie eine Excel- oder CSV-Datei hoch o ziehen Sie sie hierher, um mit der professionellen Analyse zu beginnen.",
    income: "Gesamteinnahmen",
    expense: "Gesamtausgaben",
    balance: "Netto-Saldo",
    searchTotal: "Gesamt",
    monthlyTrend: "Monatlicher Trend",
    dailyTrend: "Täglicher Trend",
    yearlyTrend: "Jährlicher Trend",
    daily: "Täglich",
    monthly: "Monatlich",
    yearly: "Jährlich",
    positive: "Positiv",
    negative: "Negativ",
    aiConsultant: "KI-Berater",
    aiPlaceholder: "Klicken Sie auf die Schaltfläche unten, um personalisierte Ratschläge basierend auf Ihren Daten zu erhalten.",
    aiAnalyze: "Mit KI analysieren",
    aiError: "Fehler beim Generieren von KI-Ratschlägen.",
    aiNoAdvice: "Ratschläge konnten derzeit nicht generiert werden.",
    searchPlaceholder: "Ausgabe suchen (z. B. Hotel)...",
    allMonths: "Alle Monate",
    date: "Datum",
    description: "Beschreibung",
    category: "Monat",
    amount: "Betrag",
    noTransactions: "Keine Transaktionen mit den aktuellen Filtern gefunden.",
    incomeLabel: "Einnahmen",
    expenseLabel: "Ausgaben",
    ollamaModel: "Ollama-Modell",
    ollamaPlaceholder: "z.B. tinyllama",
    ollamaError: "Fehler: Stellen Sie sicher, dass Ollama mit OLLAMA_ORIGINS=\"*\" läuft",
    numPredict: "Antwortlänge (num_predict)",
    temperature: "Temperatur (temperature)",
    numCtx: "Kontextgröße (num_ctx)",
    dataSlice: "Datenlimit (slice)",
    langName: "DE",
    flag: "de",
    dark: "Dunkelmodus",
    light: "Hellmodus"
  },
  fr: {
    title: "AI Financial Data Analyzer",
    subtitle: "Suivi intelligent de vos finances mensuelles.",
    upload: "Charger",
    export: "Exporter",
    clear: "Tout effacer",
    noFile: "Aucun fichier chargé",
    noFileDesc: "Chargez ou glissez-déposez un fichier Excel ou CSV contenant vos dépenses et vos revenus pour commencer l'analyse professionnelle.",
    income: "Revenus Totaux",
    expense: "Dépenses Totales",
    balance: "Solde Net",
    searchTotal: "Total",
    monthlyTrend: "Tendance Mensuelle",
    dailyTrend: "Tendance Journalière",
    yearlyTrend: "Tendance Annuelle",
    daily: "Journalier",
    monthly: "Mensuel",
    yearly: "Annuel",
    positive: "Positif",
    negative: "Négatif",
    aiConsultant: "Consultant IA",
    aiPlaceholder: "Cliquez sur le bouton ci-dessous pour recevoir des conseils personnalisés basés sur vos données.",
    aiAnalyze: "Analyser con IA",
    aiError: "Erreur lors della génération des conseils IA.",
    aiNoAdvice: "Impossible de générer des conseils pour le moment.",
    searchPlaceholder: "Rechercher une dépense (ex. Hotel)...",
    allMonths: "Tous les mois",
    date: "Date",
    description: "Description",
    category: "Mois",
    amount: "Montant",
    noTransactions: "Aucune transaction trouvée avec les filtres actuels.",
    incomeLabel: "Revenus",
    expenseLabel: "Dépenses",
    ollamaModel: "Modèle Ollama",
    ollamaPlaceholder: "ex: tinyllama",
    ollamaError: "Erreur : Assurez-vous qu'Ollama fonctionne avec OLLAMA_ORIGINS=\"*\"",
    numPredict: "Longueur Réponse (num_predict)",
    temperature: "Température (temperature)",
    numCtx: "Taille Contexte (num_ctx)",
    dataSlice: "Limite Données (slice)",
    langName: "FR",
    flag: "fr",
    dark: "Mode Sombre",
    light: "Mode Clair"
  }
};

const dateLocales = {
  it: it,
  en: enUS,
  de: de,
  fr: fr
};

const currencyMap: Record<string, string> = {
  '€': 'EUR',
  '$': 'USD',
  '£': 'GBP',
  '¥': 'JPY',
  'CHF': 'CHF'
};

const currencySymbols: Record<string, string> = {
  'EUR': '€',
  'USD': '$',
  'GBP': '£',
  'JPY': '¥',
  'CHF': 'CHF'
};

type Theme = 'dark' | 'light';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction, direction: 'asc' | 'desc' } | null>(null);
  const [chartView, setChartView] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [isChartViewOpen, setIsChartViewOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [ollamaModel, setOllamaModel] = useState('tinyllama');
  const [numPredict, setNumPredict] = useState(500);
  const [temperature, setTemperature] = useState(0.4);
  const [numCtx, setNumCtx] = useState(2048);
  const [dataSlice, setDataSlice] = useState(2000);
  const [lang, setLang] = useState<Language>('it');
  const [currency, setCurrency] = useState('EUR');
  const [theme, setTheme] = useState<Theme>('dark');
  const [selectedDailyMonth, setSelectedDailyMonth] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const uniqueMonths = useMemo(() => {
    const months = Array.from(new Set(transactions.map(t => t.month)));
    return months.sort((a, b) => {
      const dateA = transactions.find(t => t.month === a)?.date || new Date(0);
      const dateB = transactions.find(t => t.month === b)?.date || new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
  }, [transactions]);

  useEffect(() => {
    if (uniqueMonths.length > 0 && !selectedDailyMonth) {
      setSelectedDailyMonth(uniqueMonths[uniqueMonths.length - 1]);
    }
  }, [uniqueMonths, selectedDailyMonth]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        let allTransactions: Transaction[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // Use header: 1 to get raw arrays for better positional analysis
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];
          allTransactions = [...allTransactions, ...parseRawData(rawData, sheetName)];
        });
        setTransactions(prev => [...prev, ...allTransactions]);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileName.endsWith('.csv')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        Papa.parse(text, {
          header: false, // Raw arrays
          skipEmptyLines: true,
          complete: (results) => {
            const parsed = parseRawData(results.data as any[][], 'CSV Import');
            setTransactions(prev => [...prev, ...parsed]);
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const exportToExcel = () => {
    const dataToExport = filteredTransactions.map(t => ({
      [translations[lang].date]: format(t.date, 'dd/MM/yyyy'),
      [translations[lang].description]: t.description,
      [translations[lang].category]: t.month,
      [translations[lang].amount]: t.amount,
      'Tipo': t.type === 'income' ? translations[lang].incomeLabel : translations[lang].expenseLabel
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finanze");
    XLSX.writeFile(workbook, "Finanza_Personale_Export.xlsx");
    setIsExportOpen(false);
  };

  const exportToPdf = () => {
    setIsExportOpen(false);
    setIsLangOpen(false);
    setIsThemeOpen(false);
    setIsChartViewOpen(false);

    const doc = new jsPDF();
    
    // Titolo
    doc.setFontSize(20);
    doc.setTextColor(0, 122, 255);
    doc.text(t.title, 14, 22);
    
    // Sottotitolo / Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t.income}: ${formatCurrency(stats.income)}`, 14, 32);
    doc.text(`${t.expense}: ${formatCurrency(stats.expense)}`, 14, 38);
    doc.text(`${t.balance}: ${formatCurrency(stats.balance)}`, 14, 44);
    doc.text(`Data Export: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 50);

    const tableData = filteredTransactions.map(t_item => [
      format(t_item.date, 'dd/MM/yyyy'),
      t_item.description,
      t_item.month,
      `${t_item.type === 'income' ? '+' : '-'} ${formatCurrency(t_item.amount)}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [[t.date, t.description, t.category, t.amount]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 122, 255], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 55 },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        3: { halign: 'right', fontStyle: 'bold' }
      }
    });

    doc.save(`Finanza_Personale_Export_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const parseRawData = (rawData: any[][], sourceName: string): Transaction[] => {
    if (!rawData || rawData.length === 0) return [];

    // 1. Find the header row dynamically
    let headerIndex = -1;
    for (let i = 0; i < Math.min(rawData.length, 20); i++) {
      const row = rawData[i];
      if (row && row.some(cell => {
        const s = String(cell || '').toLowerCase();
        return /data|date|importo|desc|entrata|uscita|incasso|spesa|valore|causale|voce/i.test(s);
      })) {
        headerIndex = i;
        break;
      }
    }

    // If no header found, assume data starts at row 0
    const headers = headerIndex !== -1 ? rawData[headerIndex].map(h => String(h || '').toLowerCase()) : [];
    const dataRows = rawData.slice(headerIndex + 1);

    // 2. Map columns by name or default to user's C/D request
    const dateIdx = headers.findIndex(h => /data|date|giorno|day/i.test(h)) !== -1 ? headers.findIndex(h => /data|date|giorno|day/i.test(h)) : 0;
    const descIdx = headers.findIndex(h => /desc|nome|name|causale|oggetto|voce/i.test(h)) !== -1 ? headers.findIndex(h => /desc|nome|name|causale|oggetto|voce/i.test(h)) : 1;
    
    // Heuristic to find the year from the first few rows
    let yearHeuristic = 2025; // Default to 2025 as per user's data context
    for (let i = 0; i < Math.min(dataRows.length, 50); i++) {
      const cell = String(dataRows[i][dateIdx] || '');
      const match = cell.match(/\b(20\d{2})\b/);
      if (match) {
        yearHeuristic = parseInt(match[1]);
        break;
      }
    }

    // Specifically look for income/expense headers
    let incomeIdx = headers.findIndex(h => /entrata|guadagno|income|profit|credito|incasso|entrate/i.test(h));
    let expenseIdx = headers.findIndex(h => /uscita|spesa|expense|costo|debito|uscite|spese/i.test(h));

    // Fallback to Col C (2) and Col D (3) if not found by name
    if (incomeIdx === -1) incomeIdx = 2;
    if (expenseIdx === -1) expenseIdx = 3;

    const parseAmount = (val: any) => {
      if (val === null || val === undefined || val === '') return 0;
      let s = String(val).trim();
      
      // Detect currency
      for (const [symbol, code] of Object.entries(currencyMap)) {
        if (s.includes(symbol)) {
          setCurrency(code);
          break;
        }
      }

      // Remove currency symbols and spaces
      s = s.replace(/[€$£¥\s]/g, '').replace(/CHF/g, '');
      
      if (s.includes(',') && s.includes('.')) {
        // Format like 1.234,56 -> remove thousands dot, replace decimal comma
        s = s.replace(/\./g, '').replace(',', '.');
      } else if (s.includes(',')) {
        // Format like 1234,56 -> replace decimal comma
        s = s.replace(',', '.');
      }
      
      const num = parseFloat(s);
      return isNaN(num) ? 0 : num;
    };

    const transactions: Transaction[] = [];

    dataRows.forEach((row, rowIndex) => {
      if (!row || row.length === 0) return;

      // Skip rows that look like totals or are empty
      const rowString = row.join('').toLowerCase();
      if (rowString.includes('totale') || rowString.includes('total') || rowString.trim() === '') return;

      // Parse Date
      let date = new Date(yearHeuristic, 0, 1);
      const rawDate = row[dateIdx];
      let yearInString = false;
      
      if (typeof rawDate === 'string') {
        yearInString = /\b(20\d{2}|19\d{2})\b/.test(rawDate);
      }

      if (rawDate instanceof Date && isValid(rawDate)) {
        date = new Date(rawDate); // Clone to avoid mutation
      } else if (typeof rawDate === 'number') {
        try {
          const excelDate = XLSX.SSF.parse_date_code(rawDate);
          date = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
          yearInString = true; // Excel date codes are absolute
        } catch (e) { date = new Date(yearHeuristic, 0, 1); }
      } else if (typeof rawDate === 'string' && rawDate.trim() !== '') {
        const s = rawDate.trim().toLowerCase();
        const parts = s.split(/[/.-]/).map(p => parseInt(p)).filter(p => !isNaN(p));
        
        if (parts.length === 3) {
          let y = parts[2], m = parts[1], d = parts[0];
          if (parts[0] > 1000) { y = parts[0]; m = parts[1]; d = parts[2]; }
          else if (parts[2] < 100) { y = 2000 + parts[2]; }
          
          if (m > 12 && d <= 12) { const tmp = m; m = d; d = tmp; }
          date = new Date(y, m - 1, d);
          yearInString = true;
        } else if (parts.length === 2) {
          if (parts[1] > 1000) {
            date = new Date(parts[1], parts[0] - 1, 1);
            yearInString = true;
          } else if (parts[1] > 20) {
            date = new Date(2000 + parts[1], parts[0] - 1, 1);
            yearInString = true;
          } else {
            date = new Date(yearHeuristic, parts[1] - 1, parts[0]);
          }
        } else {
          // Try month names
          const monthsIt = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
          const mIdx = monthsIt.findIndex(m => s.includes(m));
          if (mIdx !== -1) {
            date = new Date(yearHeuristic, mIdx, 1);
          } else {
            const parsed = new Date(s);
            if (isValid(parsed)) {
              date = parsed;
            }
          }
        }
      }

      // Final check: if the year is 2026 (current year) but the heuristic is different,
      // and we didn't explicitly find a year in the raw data, force it to yearHeuristic.
      if (isValid(date)) {
        const currentYear = new Date().getFullYear();
        if (date.getFullYear() === currentYear && !yearInString && yearHeuristic !== currentYear) {
          date.setFullYear(yearHeuristic);
        }
      }

      if (!isValid(date)) date = new Date(yearHeuristic, 0, 1);

      const description = String(row[descIdx] || 'Senza descrizione').trim();

      // Process Income (Col C)
      const incomeVal = row[incomeIdx];
      const incomeAmt = parseAmount(incomeVal);
      if (incomeAmt !== 0) {
        transactions.push({
          id: `${sourceName}-${rowIndex}-in-${Date.now()}-${Math.random()}`,
          date,
          description: description || (lang === 'it' ? 'Entrata' : 'Income'),
          amount: Math.abs(incomeAmt),
          category: sourceName,
          type: 'income',
          month: format(date, 'MMMM yyyy', { locale: dateLocales[lang] })
        });
      }

      // Process Expense (Col D)
      const expenseVal = row[expenseIdx];
      const expenseAmt = parseAmount(expenseVal);
      if (expenseAmt !== 0) {
        transactions.push({
          id: `${sourceName}-${rowIndex}-out-${Date.now()}-${Math.random()}`,
          date,
          description: description || (lang === 'it' ? 'Uscita' : 'Expense'),
          amount: Math.abs(expenseAmt),
          category: sourceName,
          type: 'expense',
          month: format(date, 'MMMM yyyy', { locale: dateLocales[lang] })
        });
      }
    });

    return transactions;
  };

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth = monthFilter === 'all' || t.month === monthFilter;
      return matchesSearch && matchesMonth;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key];
        let bValue: any = b[sortConfig.key];

        // For amount, we might want to sort by signed value
        if (sortConfig.key === 'amount') {
          aValue = a.type === 'income' ? a.amount : -a.amount;
          bValue = b.type === 'income' ? b.amount : -b.amount;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [transactions, searchQuery, monthFilter, sortConfig]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    
    // Calculate total for the specific search query if it's active
    // Use algebraic sum (income - expense)
    const searchTotal = searchQuery ? filteredTransactions.reduce((acc, t) => {
      return acc + (t.type === 'income' ? t.amount : -t.amount);
    }, 0) : 0;

    return { income, expense, balance: income - expense, searchTotal };
  }, [filteredTransactions, searchQuery]);

  const chartData = useMemo(() => {
    const groups: Record<string, any> = {};
    
    // If daily view, pre-populate with all days of the selected month
    if (chartView === 'daily' && selectedDailyMonth) {
      const refTx = transactions.find(t => t.month === selectedDailyMonth);
      if (refTx) {
        const start = startOfMonth(refTx.date);
        const end = endOfMonth(refTx.date);
        const days = eachDayOfInterval({ start, end });
        days.forEach(day => {
          const key = format(day, 'dd/MM/yyyy');
          groups[key] = { label: key, income: 0, expense: 0, balance: 0, date: day };
        });
      }
    }

    transactions.forEach(t => {
      let key = '';
      if (chartView === 'daily') {
        if (selectedDailyMonth && t.month !== selectedDailyMonth) return;
        key = format(t.date, 'dd/MM/yyyy');
      } else if (chartView === 'monthly') {
        key = t.month;
      } else {
        key = format(t.date, 'yyyy');
      }

      if (!groups[key]) {
        groups[key] = { label: key, income: 0, expense: 0, balance: 0, date: t.date };
      }
      if (t.type === 'income') groups[key].income += t.amount;
      else groups[key].expense += t.amount;
      groups[key].balance = groups[key].income - groups[key].expense;
    });

    return Object.values(groups).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions, chartView, selectedDailyMonth]);

  const generateAdvice = async () => {
    if (transactions.length === 0) return;
    setIsGeneratingAdvice(true);
    setAiAdvice(""); 
    try {
      const summary = transactions.map(t => `${t.date.toLocaleDateString()}: ${t.description} (${t.amount}${currencySymbols[currency]}, ${t.type})`).join('\n');
      const langNames = { it: 'Italiano', en: 'English', de: 'Deutsch', fr: 'Français' };
      const currentLang = langNames[lang];
      
      // Localized instructions to "prime" the model
      const instructions = {
        it: "Analizza questi dati finanziari e fornisci consigli sintetici e professionali in Italiano. Rispondi solo in Italiano.",
        en: "Analyze these financial data and provide concise and professional advice in English. Respond only in English.",
        de: "Analysieren Sie diese Finanzdaten und geben Sie prägnante und professionelle Ratschläge auf Deutsch. Antworten Sie nur auf Deutsch.",
        fr: "Analysez ces données financières et donnez des conseils concis et professionnels en Français. Répondez uniquement en Français."
      };

      const systemInstructions = {
        it: "Sei un consulente finanziario. Rispondi SEMPRE in Italiano. Non usare mai l'inglese.",
        en: "You are a financial advisor. Respond ALWAYS in English.",
        de: "Sie sind ein Finanzberater. Antworten Sie IMMER auf Deutsch.",
        fr: "Vous êtes un conseiller financier. Répondez TOUJOURS en Français."
      };

      const prompt = `${instructions[lang]}
Dati:
${summary.slice(0, dataSlice)}

Risposta in ${currentLang}:`;

      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: prompt,
          system: systemInstructions[lang],
          stream: true,
          options: {
            num_ctx: numCtx,
            num_predict: numPredict,
            temperature: temperature,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ollama error (${response.status}): ${errorData}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = ""; // Buffer per gestire JSON parziali

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Mantieni l'ultima linea (potrebbe essere incompleta) nel buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.response) {
              accumulatedText += json.response;
              setAiAdvice(accumulatedText);
            }
          } catch (e) {
            console.warn("Errore parsing chunk:", e);
          }
        }
      }

      if (!accumulatedText) setAiAdvice(t.aiNoAdvice);
    } catch (error) {
      console.error('Ollama Fetch Error:', error);
      setAiAdvice(t.ollamaError + " (Verifica che Ollama sia attivo e il modello scaricato)");
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const formatCurrency = (value: number, decimals = 2) => {
    return new Intl.NumberFormat(lang === 'it' ? 'it-IT' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === 'light' ? "light" : "dark"
    )}>
      <div id="main-content" className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{t.title}</h1>
            <p className="text-[var(--text-muted)] font-medium">{t.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-4 no-export">
            {/* Language Dropdown */}
            <div className="relative no-export">
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsThemeOpen(false);
                  setIsExportOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-sm font-bold shadow-sm hover:bg-[var(--card-border)] transition-all"
              >
                <img src={`https://flagcdn.com/w40/${t.flag}.png`} alt={t.langName} className="w-5 h-auto rounded-sm" />
                <span>{t.langName}</span>
                <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass-card overflow-hidden z-50 shadow-2xl"
                  >
                    {(['it', 'en', 'de', 'fr'] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLang(l);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--card-border)]",
                          lang === l ? "text-accent" : "text-[var(--text)]"
                        )}
                      >
                        <img src={`https://flagcdn.com/w40/${translations[l].flag}.png`} alt={translations[l].langName} className="w-5 h-auto rounded-sm" />
                        <span>{translations[l].langName}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Dropdown */}
            <div className="relative no-export">
              <button
                onClick={() => {
                  setIsThemeOpen(!isThemeOpen);
                  setIsLangOpen(false);
                  setIsExportOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-sm font-bold shadow-sm hover:bg-[var(--card-border)] transition-all"
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <ChevronDown size={14} className={cn("transition-transform", isThemeOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 glass-card overflow-hidden z-50 shadow-2xl"
                  >
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setIsThemeOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--card-border)]",
                        theme === 'dark' ? "text-accent" : "text-[var(--text)]"
                      )}
                    >
                      <Moon size={16} />
                      <span>{t.dark}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTheme('light');
                        setIsThemeOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--card-border)]",
                        theme === 'light' ? "text-accent" : "text-[var(--text)]"
                      )}
                    >
                      <Sun size={16} />
                      <span>{t.light}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <label className="apple-button flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-full font-semibold cursor-pointer shadow-lg shadow-accent/20">
              <Upload size={20} />
              {t.upload}
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
            </label>

            {transactions.length > 0 && (
              <div className="relative no-export">
                <button
                  onClick={() => {
                    setIsExportOpen(!isExportOpen);
                    setIsLangOpen(false);
                    setIsThemeOpen(false);
                  }}
                  className="apple-button flex items-center gap-2 px-6 py-3 bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text)] rounded-full font-semibold shadow-lg hover:bg-[var(--card-border)] transition-all"
                >
                  <Download size={20} />
                  {t.export}
                  <ChevronDown size={14} className={cn("transition-transform", isExportOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isExportOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass-card overflow-hidden z-50 shadow-2xl"
                    >
                      <button
                        onClick={exportToExcel}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/10 text-[var(--text)]"
                      >
                        <Download size={16} className="text-success" />
                        <span>Excel (.xlsx)</span>
                      </button>
                      <button
                        onClick={exportToPdf}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/10 text-[var(--text)]"
                      >
                        <Download size={16} className="text-danger" />
                        <span>PDF (.pdf)</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {transactions.length > 0 && (
              <button 
                onClick={() => {
                  setTransactions([]);
                  setCurrency('EUR');
                }}
                className="p-3 text-[var(--text-muted)] hover:text-danger hover:bg-danger/10 rounded-full transition-colors"
                title={t.clear}
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </header>

        {transactions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] transition-all duration-300 border-2 border-dashed",
              isDragging ? "border-accent bg-accent/5 scale-[1.02]" : "border-transparent"
            )}
          >
            <div className="w-20 h-20 bg-[var(--input-bg)] rounded-3xl flex items-center justify-center mb-6 border border-[var(--card-border)]">
              <Wallet size={40} className="text-accent" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">{t.noFile}</h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">
              {t.noFileDesc}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title={t.income} 
                value={stats.income} 
                icon={<TrendingUp className="text-success" />} 
                color="success"
                formatCurrency={formatCurrency}
              />
              <StatCard 
                title={t.expense} 
                value={stats.expense} 
                icon={<TrendingDown className="text-danger" />} 
                color="danger"
                formatCurrency={formatCurrency}
              />
              <StatCard 
                title={t.balance} 
                value={stats.balance} 
                icon={<Wallet className="text-accent" />} 
                color="accent"
                formatCurrency={formatCurrency}
              />
              {searchQuery && (
                <StatCard 
                  title={`${t.searchTotal}: ${searchQuery}`} 
                  value={stats.searchTotal} 
                  icon={<Search className={stats.searchTotal >= 0 ? "text-success" : "text-danger"} />} 
                  color={stats.searchTotal >= 0 ? "success" : "danger"}
                  highlight
                  formatCurrency={formatCurrency}
                />
              )}
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              <div className="glass-card p-6 flex flex-col w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {chartView === 'daily' ? t.dailyTrend : chartView === 'monthly' ? t.monthlyTrend : t.yearlyTrend}
                  </h3>

                  {chartView === 'daily' && uniqueMonths.length > 0 && (
                    <div className="flex items-center gap-4 bg-[var(--input-bg)] px-3 py-1.5 rounded-lg border border-[var(--card-border)] no-export">
                      <button 
                        onClick={() => {
                          const idx = uniqueMonths.indexOf(selectedDailyMonth);
                          if (idx > 0) setSelectedDailyMonth(uniqueMonths[idx - 1]);
                        }}
                        disabled={uniqueMonths.indexOf(selectedDailyMonth) === 0}
                        className="p-1 hover:bg-[var(--card-border)] rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-sm font-medium min-w-[120px] text-center">
                        {selectedDailyMonth}
                      </span>
                      <button 
                        onClick={() => {
                          const idx = uniqueMonths.indexOf(selectedDailyMonth);
                          if (idx < uniqueMonths.length - 1) setSelectedDailyMonth(uniqueMonths[idx + 1]);
                        }}
                        disabled={uniqueMonths.indexOf(selectedDailyMonth) === uniqueMonths.length - 1}
                        className="p-1 hover:bg-[var(--card-border)] rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                  
                  <div className="relative no-export">
                    <button 
                      onClick={() => {
                        setIsChartViewOpen(!isChartViewOpen);
                        setIsLangOpen(false);
                        setIsThemeOpen(false);
                        setIsExportOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-[var(--card-border)] transition-colors"
                    >
                      <Filter size={14} />
                      {chartView === 'daily' ? t.daily : chartView === 'monthly' ? t.monthly : t.yearly}
                      <ChevronDown size={14} className={cn("transition-transform", isChartViewOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isChartViewOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-40 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                          {(['daily', 'monthly', 'yearly'] as const).map((view) => (
                            <button
                              key={view}
                              onClick={() => {
                                setChartView(view);
                                setIsChartViewOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors",
                                chartView === view ? "text-accent font-semibold" : "text-[var(--text-muted)]"
                              )}
                            >
                              {view === 'daily' ? t.daily : view === 'monthly' ? t.monthly : t.yearly}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="h-[400px] w-full relative">
                  <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke="var(--text-muted)" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                          interval={0}
                          angle={chartView === 'daily' || chartView === 'monthly' ? -45 : 0}
                          textAnchor={chartView === 'daily' || chartView === 'monthly' ? 'end' : 'middle'}
                          height={80}
                          tickFormatter={(value) => {
                            if (chartView === 'daily') {
                              // "dd/MM/yyyy" -> "dd"
                              return value.split('/')[0];
                            }
                            if (chartView === 'monthly') {
                              // "Gennaio 2025" -> "Gen '25"
                              const parts = value.split(' ');
                              if (parts.length === 2) {
                                return `${parts[0].substring(0, 3)}. ${parts[1].slice(-2)}`;
                              }
                            }
                            return value;
                          }}
                        />
                        <YAxis 
                          stroke="var(--text-muted)" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => formatCurrency(value, 0)}
                          width={60}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--input-bg)', 
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            color: 'var(--text)'
                          }}
                          itemStyle={{ color: 'var(--text)' }}
                          cursor={{ fill: 'var(--card-border)' }}
                          formatter={(value: number, name: string) => [formatCurrency(value), name]}
                          itemSorter={(item) => (item.name === t.positive ? -1 : 1)}
                        />
                        <Bar dataKey="income" fill="#34c759" radius={[4, 4, 0, 0]} name={t.positive} />
                        <Bar dataKey="expense" fill="#ff3b30" radius={[4, 4, 0, 0]} name={t.negative} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BrainCircuit className="text-accent" size={20} />
                    {t.aiConsultant}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end no-export">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold flex items-center gap-1 h-4">
                      <Cpu size={10} />
                      {t.ollamaModel}
                    </label>
                    <input
                      type="text"
                      value={ollamaModel}
                      onChange={(e) => setOllamaModel(e.target.value)}
                      placeholder={t.ollamaPlaceholder}
                      className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold h-4 flex items-center">{t.numPredict}</label>
                    <input
                      type="number"
                      value={numPredict}
                      onChange={(e) => setNumPredict(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold h-4 flex items-center">{t.temperature}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold h-4 flex items-center">{t.numCtx}</label>
                    <input
                      type="number"
                      value={numCtx}
                      onChange={(e) => setNumCtx(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold h-4 flex items-center">{t.dataSlice}</label>
                    <input
                      type="number"
                      value={dataSlice}
                      onChange={(e) => setDataSlice(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent/50"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[200px] mb-4 text-[var(--text)] text-base leading-relaxed">
                  {aiAdvice ? (
                    <div className="whitespace-pre-wrap">{aiAdvice}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <AlertCircle className="text-[var(--text-muted)] mb-3" size={48} />
                      <p className="text-[var(--text-muted)] italic text-lg">{t.aiPlaceholder}</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={generateAdvice}
                  disabled={isGeneratingAdvice}
                  className="apple-button w-full py-4 bg-[var(--input-bg)] hover:bg-[var(--card-border)] border border-[var(--card-border)] rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-lg no-export"
                >
                  {isGeneratingAdvice ? (
                    <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-accent rounded-full animate-spin" />
                  ) : (
                    <>{t.aiAnalyze}</>
                  )}
                </button>
              </div>
            </div>

            {/* Filters & Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-[var(--card-border)] flex flex-col md:flex-row md:items-center justify-between gap-4 no-export">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                  <input 
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Filter className="text-[var(--text-muted)]" size={18} />
                  <select 
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
                  >
                    <option value="all">{t.allMonths}</option>
                    {uniqueMonths.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--table-header)] text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4 cursor-pointer hover:text-accent transition-colors" onClick={() => handleSort('date')}>
                        <div className="flex items-center gap-1">
                          {t.date}
                          {sortConfig?.key === 'date' ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : <ChevronUp size={14} className="opacity-20" />}
                        </div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:text-accent transition-colors" onClick={() => handleSort('description')}>
                        <div className="flex items-center gap-1">
                          {t.description}
                          {sortConfig?.key === 'description' ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : <ChevronUp size={14} className="opacity-20" />}
                        </div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:text-accent transition-colors" onClick={() => handleSort('month')}>
                        <div className="flex items-center gap-1">
                          {t.category}
                          {sortConfig?.key === 'month' ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : <ChevronUp size={14} className="opacity-20" />}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right cursor-pointer hover:text-accent transition-colors" onClick={() => handleSort('amount')}>
                        <div className="flex items-center justify-end gap-1">
                          {t.amount}
                          {sortConfig?.key === 'amount' ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : <ChevronUp size={14} className="opacity-20" />}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)]">
                    <AnimatePresence mode="popLayout">
                      {filteredTransactions.map((t_item) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={t_item.id} 
                          className="hover:bg-[var(--table-header)] transition-colors group"
                        >
                          <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                            {format(t_item.date, 'dd MMM yyyy', { locale: dateLocales[lang] })}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {t_item.description}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2 py-1 bg-[var(--input-bg)] rounded-full text-[var(--text-muted)]">
                              {t_item.month}
                            </span>
                          </td>
                          <td className={cn(
                            "px-6 py-4 text-right font-semibold tabular-nums",
                            t_item.type === 'income' ? "text-success" : "text-danger"
                          )}>
                            {t_item.type === 'income' ? '+' : '-'} {formatCurrency(t_item.amount)}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)] italic">
                          {t.noTransactions}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, highlight, formatCurrency }: { 
  title: string, 
  value: number, 
  icon: React.ReactNode, 
  color: 'success' | 'danger' | 'accent' | 'white',
  highlight?: boolean,
  formatCurrency: (v: number) => string
}) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn(
        "glass-card p-6 flex flex-col justify-between",
        highlight && "ring-2 ring-accent/50 bg-accent/10"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[var(--text-muted)]">{title}</span>
        <div className="p-2 bg-[var(--input-bg)] rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-2xl font-bold tracking-tight",
          color === 'success' && "text-success",
          color === 'danger' && "text-danger",
          color === 'accent' && "text-accent",
          color === 'white' && "text-[var(--text)]"
        )}>
          {formatCurrency(value)}
        </span>
      </div>
    </motion.div>
  );
}
