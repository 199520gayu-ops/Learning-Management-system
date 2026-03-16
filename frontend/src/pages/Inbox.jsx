import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Plus,
  Search,
  Archive,
  Trash2,
  Inbox as InboxIcon
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api/tasks";

export default function ProfessionalInbox() {

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("inbox");

  // ✅ FIXED: form fields now match Task model (title, description, learnerEmail)
  const [form, setForm] = useState({
    learnerEmail: "",
    title: "",
    description: ""
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API);

      const data = res.data.map((msg) => ({
        ...msg,
        id: msg._id,
        sender: msg.learnerEmail || "Unknown",         // ✅ use learnerEmail as sender
        subject: msg.title || "No Subject",            // ✅ use title as subject
        message: msg.description || "",                // ✅ use description as message body
        time: new Date(msg.createdAt).toLocaleString(),
        unread: false,
        initials: msg.learnerEmail
          ? msg.learnerEmail.slice(0, 2).toUpperCase()
          : "UK",
        folder: msg.folder || "inbox",
        attachments: []
      }));

      setMessages(data);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  const openMessage = (msg) => {
    setSelected(msg);
  };

  const deleteMessage = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchMessages();
    setSelected(null);
  };

  const sendReply = async () => {
    if (!reply) return;

    // ✅ FIXED: backend replyTask expects { reply } not { message }
    await axios.post(`${API}/reply/${selected.id}`, {
      reply: reply
    });

    setReply("");
    fetchMessages();
  };

  const sendMessage = async () => {
    // ✅ FIXED: sending correct fields matching Task model
    if (!form.learnerEmail || !form.title || !form.description) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post(`${API}/create`, {
        learnerEmail: form.learnerEmail,
        title: form.title,
        description: form.description
      });

      setShowCompose(false);
      setForm({ learnerEmail: "", title: "", description: "" });
      fetchMessages();
    } catch (error) {
      console.error("Send error:", error);
      alert("Failed to send message.");
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesFolder = m.folder === activeFolder;
      const matchesSearch =
        m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [messages, activeFolder, searchQuery]);

  const unreadCount = messages.filter(
    (m) => m.unread && m.folder === "inbox"
  ).length;

  return (
    <div className="flex h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r">

        <div className="p-4 border-b">
          <button
            onClick={() => navigate("/dashboard")}
            className="font-bold"
          >
            ← Back to Dashboard
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem
            icon={<InboxIcon size={18} />}
            label="Inbox"
            active={activeFolder === "inbox"}
            onClick={() => setActiveFolder("inbox")}
            count={unreadCount}
          />
          <NavItem
            icon={<Send size={18} />}
            label="Sent"
            active={activeFolder === "sent"}
            onClick={() => setActiveFolder("sent")}
          />
          <NavItem
            icon={<Archive size={18} />}
            label="Archive"
            active={activeFolder === "archive"}
            onClick={() => setActiveFolder("archive")}
          />
          <NavItem
            icon={<Trash2 size={18} />}
            label="Trash"
            active={activeFolder === "trash"}
            onClick={() => setActiveFolder("trash")}
          />
        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

          <div className="relative w-96">
            <Search className="absolute left-3 top-2 text-gray-400" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={() => setShowCompose(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
          >
            <Plus size={18} /> Compose
          </button>

        </header>

        <div className="flex flex-1 overflow-hidden">

          {/* MESSAGE LIST */}
          <div className="w-96 border-r overflow-y-auto bg-white">
            {filteredMessages.length === 0 ? (
              <div className="p-6 text-gray-400 text-center">No messages</div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50
                    ${selected?.id === msg.id ? "bg-blue-50" : ""}
                  `}
                >
                  <p className="font-bold text-sm">{msg.sender}</p>
                  <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                </div>
              ))
            )}
          </div>

          {/* MESSAGE VIEW */}
          <div className="flex-1 bg-white overflow-y-auto">
            {!selected ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a message
              </div>
            ) : (
              <div className="p-8">

                <h2 className="text-2xl font-bold">{selected.subject}</h2>
                <p className="text-sm text-gray-400 mt-1">From: {selected.sender}</p>
                <p className="mt-4 text-gray-600">{selected.message}</p>

                {/* Show educator reply if exists */}
                {selected.reply && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-700">Educator Reply:</p>
                    <p className="text-gray-700 mt-1">{selected.reply}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-8">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write reply..."
                    className="w-full border p-3 rounded-lg h-28 resize-none"
                  />
                  <button
                    onClick={sendReply}
                    className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg flex gap-2 items-center"
                  >
                    <Send size={16} /> Reply
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>

      {/* COMPOSE MODAL */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-96 space-y-4 shadow-xl">

            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">New Task</h3>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* ✅ FIXED: input labels match backend model fields */}
            <input
              placeholder="Learner Email"
              value={form.learnerEmail}
              onChange={(e) => setForm({ ...form, learnerEmail: e.target.value })}
              className="w-full border p-2 rounded"
              type="email"
            />

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 rounded h-28 resize-none"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            >
              Send Task
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

function NavItem({ icon, label, active, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center p-3 rounded cursor-pointer
        ${active ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
      `}
    >
      <div className="flex gap-3 items-center">
        {icon}
        <span>{label}</span>
      </div>
      {count > 0 && (
        <span className="text-xs bg-white text-blue-500 px-2 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}