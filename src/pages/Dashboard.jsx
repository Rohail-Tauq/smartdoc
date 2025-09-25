import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FileText, X, FileSignature, Image, Search, Filter, Download, MoreVertical } from "lucide-react";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // all | pdf | doc | image
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState({});

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/docs/mydocs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      alert(err.response?.data?.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/docs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(documents.filter((doc) => doc._id !== id));
      alert("Document deleted successfully");
    } catch (err) {
      console.error("Error deleting document:", err);
      alert(err.response?.data?.message || "Failed to delete document");
    }
  };
const handleDownload = async (id) => {
  try {
    const token = localStorage.getItem("token"); // or however you store JWT

    const res = await fetch(`http://localhost:5000/api/docs/download/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errMsg = await res.json();
      alert(errMsg.message || "Download failed");
      return;
    }

    // Convert to blob for download
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    // Try to extract filename from content-disposition header
    const disposition = res.headers.get("Content-Disposition");
    let filename = "file";
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Download error:", err);
    alert("Error downloading file");
  }
};

  // Filter + Search
  const filteredDocuments = documents.filter((doc) => {
    const name = doc.originalName.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());

    if (activeFilter === "pdf") return matchesSearch && name.endsWith(".pdf");
    if (activeFilter === "doc") return matchesSearch && (name.endsWith(".doc") || name.endsWith(".docx"));
    if (activeFilter === "image") return matchesSearch && (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png"));
    return matchesSearch; // all
  });

  const getFileTypeIcon = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.endsWith('.pdf')) return <FileText className="text-red-400" size={20} />;
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FileSignature className="text-blue-400" size={20} />;
    if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')) return <Image className="text-green-400" size={20} />;
    return <FileText className="text-gray-400" size={20} />;
  };

  const filterButtons = [
    { key: 'all', icon: Filter, label: 'All', count: documents.length },
    { key: 'pdf', icon: FileText, label: 'PDF', count: documents.filter(d => d.originalName.toLowerCase().endsWith('.pdf')).length },
    { key: 'doc', icon: FileSignature, label: 'DOC', count: documents.filter(d => d.originalName.toLowerCase().endsWith('.doc') || d.originalName.toLowerCase().endsWith('.docx')).length },
    { key: 'image', icon: Image, label: 'Images', count: documents.filter(d => d.originalName.toLowerCase().endsWith('.jpg') || d.originalName.toLowerCase().endsWith('.jpeg') || d.originalName.toLowerCase().endsWith('.png')).length }
  ];

  return (
<div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
  {/* Sidebar */}
  <aside className="fixed top-0 bottom-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col z-50">
    <Sidebar />
  </aside>

  {/* Main Section */}
  <div className="flex-1 ml-0 md:ml-64 flex flex-col overflow-y-auto">
    {/* Header */}
    <Header />

    {/* Content */}
    <main className="flex-1 p-4 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Your Documents
        </h2>
        <p className="text-slate-400">
          Manage and organize your uploaded documents
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          {filterButtons.map(({ key, icon: Icon, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${activeFilter === key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" : "text-slate-300 hover:text-white hover:bg-slate-700/50"}`}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === key ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-400">Loading documents...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No documents found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div key={doc._id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getFileTypeIcon(doc.originalName)}
                  <a
                    href={`http://localhost:5000${doc.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium truncate max-w-[180px]"
                    title={doc.originalName}
                  >
                    {doc.originalName}
                  </a>
                </div>

                {/* 3-dot menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(prev => ({ ...prev, [doc._id]: !prev[doc._id] }))}
                    className="p-1 text-slate-400 hover:text-white rounded"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {menuOpen[doc._id] && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-700 border border-slate-600 rounded shadow-lg z-50 flex flex-col">
                      <button
                        onClick={() => handleDownload(doc._id, doc.originalName)}
                        className="px-3 py-2 hover:bg-slate-600 text-white text-left"
                      >
                        <Download size={16} className="inline mr-2" /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="px-3 py-2 hover:bg-red-600 text-white text-left"
                      >
                        <X size={16} className="inline mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  </div>
</div>


  );
}
