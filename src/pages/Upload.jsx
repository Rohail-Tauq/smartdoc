import { useState } from "react";
import { UploadCloud, FileText, X, File, Image } from "lucide-react";
import Navbar from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle file change
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  // Remove file
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Upload to backend
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("token"); // JWT from login

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file); // append each file

        const res = await axios.post(
          "http://localhost:5000/api/docs/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // send token
            },
          }
        );

        console.log("Uploaded:", res.data);
        alert(`✅ ${file.name} uploaded! URL: ${res.data.fileUrl}`);
      }

      setFiles([]);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "❌ Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
      return <Image className="text-green-400" size={20} />;
    } else if (['pdf'].includes(extension)) {
      return <FileText className="text-red-400" size={20} />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <File className="text-blue-400" size={20} />;
    }
    return <FileText className="text-slate-400" size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed top-0 bottom-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col z-50">
      <Sidebar />
    </aside>

      <div className="flex-1 ml-0 md:ml-64 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-4 md:p-8 space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Upload Documents
            </h2>
            <p className="text-slate-400">
              Upload your files and documents to extract data
            </p>
          </div>

          {/* Drag & Drop Box */}
          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/30 backdrop-blur-sm cursor-pointer hover:border-indigo-500 hover:bg-slate-800/50 transition-all duration-300 group">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-indigo-600/20 rounded-full group-hover:bg-indigo-600/30 transition-colors">
                  <UploadCloud size={48} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                </div>
                <div className="text-center space-y-2">
                  <span className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    Drag & Drop files here
                  </span>
                  <span className="text-slate-400 block">
                    or click to browse files
                  </span>
                  <div className="text-sm text-slate-500 mt-2">
                    Supports: PDF, DOC, DOCX, Images (JPG, PNG)
                  </div>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Files to Upload
                </h3>
                <div className="px-3 py-1 bg-indigo-600/20 rounded-full">
                  <span className="text-indigo-300 text-sm font-medium">
                    {files.length} file{files.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="group flex justify-between items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl hover:border-indigo-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="shrink-0">
                        {getFileIcon(file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                    <button
  onClick={() => removeFile(index)}
  className="p-2 text-red-400 rounded-lg"
  title="Remove file"
>
  <X size={18} />
</button>
                  </div>
                ))}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`
                  w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3
                  ${uploading 
                    ? "bg-slate-700 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/25"
                  }
                `}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading files...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} />
                    <span>Upload {files.length} file{files.length > 1 ? 's' : ''}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}