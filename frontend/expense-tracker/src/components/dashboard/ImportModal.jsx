// src/components/dashboard/ImportModal.jsx
import { useState } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/apiPaths"
import { Upload, X, Check, AlertCircle, FileText, ArrowRight } from "lucide-react"

const ImportModal = ({ isOpen, onClose, onRefresh }) => {
  const [file, setFile] = useState(null)
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [mapping, setMapping] = useState({
    date: "",
    title: "",
    amount: "",
    type: "expense" // Default type
  })
  const [step, setStep] = useState(1) // 1: Upload, 2: Map, 3: Review/Categorize
  const [importing, setImporting] = useState(false)

  if (!isOpen) return null

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()))
      const headers = rows[0]
      const values = rows.slice(1).filter(row => row.length === headers.length && row.some(cell => cell !== ""))
      
      setHeaders(headers)
      setData(values)
      setStep(2)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    try {
      setImporting(true)
      const token = localStorage.getItem("token")
      
      const transactions = data.map(row => {
        const amount = parseFloat(row[headers.indexOf(mapping.amount)])
        return {
          title: row[headers.indexOf(mapping.title)],
          amount: Math.abs(amount),
          type: amount < 0 ? "expense" : "income",
          date: new Date(row[headers.indexOf(mapping.date)]),
          category: "General" // We can add AI categorization here later or on frontend before send
        }
      })

      // Optional: AI Categorization here before sending
      // For now, let's just send the batch
      await axios.post(`${BASE_URL}/api/transactions/batch`, { transactions }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onRefresh()
      onClose()
      setStep(1)
    } catch (err) {
      console.error(err)
      alert("Import failed. Please check the format.")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
      <div className="absolute inset-0 bg-[#0b1220]/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl p-10 rounded-[3rem] bg-[#161d2a] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Import Bank Statement</h2>
        <p className="text-gray-400 mb-8">Rapidly upload your financial history via CSV.</p>

        {step === 1 && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 hover:border-indigo-500/50 transition-all group bg-white/[0.02]">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload size={40} />
            </div>
            <label className="cursor-pointer">
              <span className="px-8 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                Choose CSV File
              </span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <p className="mt-4 text-sm text-gray-500">Only .csv files supported at this moment.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <FileText className="text-indigo-400" />
              <span className="text-white font-medium">{file?.name}</span>
              <span className="text-gray-500 text-sm ml-auto">Detected {data.length} rows</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {['title', 'amount', 'date'].map(field => (
                <div key={field} className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{field}</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                    value={mapping[field]}
                    onChange={(e) => setMapping({...mapping, [field]: e.target.value})}
                  >
                    <option value="">Select Column</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <button 
              onClick={handleImport}
              disabled={!mapping.title || !mapping.amount || !mapping.date || importing}
              className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-40"
            >
              {importing ? "Importing Data..." : "Finalize Import"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportModal
