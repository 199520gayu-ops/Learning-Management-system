import { useState } from "react";
import {
  Users,
  Plus,
  LogIn,
  LogOut,
  MessageCircle,
} from "lucide-react";

export default function Groups() {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "JavaScript Learners",
      members: 124,
      joined: true,
      description: "Discuss JS basics, doubts & projects",
    },
    {
      id: 2,
      name: "React Developers",
      members: 98,
      joined: false,
      description: "Hooks, state, real-world React apps",
    },
    {
      id: 3,
      name: "Frontend Interview Prep",
      members: 56,
      joined: false,
      description: "HTML, CSS, JS interview questions",
    },
  ]);

  const [newGroup, setNewGroup] = useState("");

  const toggleJoin = (id) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              joined: !g.joined,
              members: g.joined ? g.members - 1 : g.members + 1,
            }
          : g
      )
    );
  };

  const createGroup = () => {
    if (!newGroup.trim()) return;

    setGroups([
      ...groups,
      {
        id: Date.now(),
        name: newGroup,
        members: 1,
        joined: true,
        description: "New learning group",
      },
    ]);
    setNewGroup("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 Learning Groups</h1>

        <div className="flex gap-2">
          <input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="Create new group"
            className="border px-3 py-2 rounded-lg"
          />
          <button
            onClick={createGroup}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={18} />
            Create
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-purple-600" />
                <h2 className="text-lg font-semibold">{g.name}</h2>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {g.description}
              </p>

              <p className="text-sm text-gray-500">
                👤 {g.members} members
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => toggleJoin(g.id)}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2
                ${
                  g.joined
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
              >
                {g.joined ? <LogOut size={16} /> : <LogIn size={16} />}
                {g.joined ? "Leave" : "Join"}
              </button>

              {g.joined && (
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700">
                  <MessageCircle size={16} />
                  Chat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
