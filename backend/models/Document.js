import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
