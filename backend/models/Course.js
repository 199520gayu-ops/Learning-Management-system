import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    educator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: { type: Number, default: 0 },
    oldPrice: { type: Number, default: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "General" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    totalHours: { type: Number, default: 0 },
    language: { type: String, default: "English" },
    bestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);


