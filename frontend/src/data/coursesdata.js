import { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { CartContext } from "../context/CartContext";

const courses = [
  {
    id: 1,
    title: "Complete React Developer Bootcamp",
    instructor: "John Smith",
    rating: 4.7,
    students: "120,543",
    price: 499,
    oldPrice: 3199,
    bestseller: true,
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Full Stack MERN Development",
    instructor: "David Johnson",
    rating: 4.6,
    students: "89,210",
    price: 599,
    oldPrice: 3499,
    category: "Full Stack",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Mastering AI & Machine Learning",
    instructor: "Sarah Lee",
    rating: 4.8,
    students: "165,432",
    price: 699,
    oldPrice: 4999,
    bestseller: true,
    category: "AI",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "UI/UX Design Masterclass",
    instructor: "Emma Brown",
    rating: 4.5,
    students: "52,345",
    price: 399,
    oldPrice: 2999,
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Advanced JavaScript: From Zero to Hero",
    instructor: "Michael Adams",
    rating: 4.9,
    students: "210,000",
    price: 549,
    oldPrice: 3799,
    bestseller: true,
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Python for Data Science & Analytics",
    instructor: "Sophia Wilson",
    rating: 4.8,
    students: "198,765",
    price: 699,
    oldPrice: 4299,
    category: "Data Science",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Next.js 14 – Production Ready Apps",
    instructor: "Daniel Thomas",
    rating: 4.7,
    students: "76,234",
    price: 599,
    oldPrice: 3499,
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    instructor: "Olivia Martinez",
    rating: 4.6,
    students: "54,321",
    price: 449,
    oldPrice: 2999,
    category: "Security",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    title: "AWS Cloud Practitioner & Solutions Architect",
    instructor: "Andrew Miller",
    rating: 4.8,
    students: "182,432",
    price: 799,
    oldPrice: 5499,
    bestseller: true,
    category: "Cloud",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    title: "DevOps CI/CD with Docker & Kubernetes",
    instructor: "Robert King",
    rating: 4.7,
    students: "94,210",
    price: 749,
    oldPrice: 4799,
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=800&q=80",
  },
];

export default courses;
