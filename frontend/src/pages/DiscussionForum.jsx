import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send } from "lucide-react";

export default function DiscussionForum() {

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [replyText, setReplyText] = useState({});

  const API = "http://localhost:5000/api/discussion";
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(API, config);
      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching discussions", error);
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        API,
        { question: questionText },
        config
      );

      setQuestions([res.data, ...questions]);
      setQuestionText("");

    } catch (error) {
      console.error("Error posting question", error);
    }
  };

  const addReply = async (id) => {

    try {

      await axios.post(
        `${API}/${id}/reply`,
        { message: replyText[id] },
        config
      );

      setReplyText({ ...replyText, [id]: "" });

      fetchQuestions();

    } catch (error) {
      console.error("Error posting reply", error);
    }

  };

  return (

    <div className="p-6 max-w-5xl mx-auto">

      {/* Page Title */}

      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Discussion Forum
        </h1>
      </div>


      {/* Ask Question Card */}

      <div className="bg-white shadow-lg rounded-xl p-5 mb-8 border">

        <h2 className="font-semibold text-lg mb-3">
          Ask a Question
        </h2>

        <form onSubmit={addQuestion}>

          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Ask your doubt to educators or learners..."
            required
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <div className="flex justify-end mt-3">

            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Send size={16}/>
              Post Question
            </button>

          </div>

        </form>

      </div>


      {/* Questions */}

      <div className="space-y-6">

        {questions.map((q) => (

          <div
            key={q._id}
            className="bg-white shadow-md rounded-xl p-5 border"
          >

            {/* Question Header */}

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {q.askedBy?.name?.charAt(0) || "U"}
              </div>

              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <h3 className="font-semibold text-gray-800">
                    {q.askedBy?.name || "User"}
                  </h3>

                  <span className="text-xs text-gray-400">
                    {new Date(q.createdAt).toLocaleString()}
                  </span>

                </div>

                <p className="text-gray-700 mt-1">
                  {q.question}
                </p>

              </div>

            </div>


            {/* Replies */}

            <div className="mt-4 ml-12 space-y-2">

              {q.replies?.map((reply, index) => (

                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg"
                >

                  <div className="text-sm font-semibold text-gray-700">
                    {reply.repliedBy?.name || "User"}
                  </div>

                  <div className="text-gray-600 text-sm">
                    {reply.message}
                  </div>

                </div>

              ))}

            </div>


            {/* Reply Box */}

            <div className="flex gap-2 mt-4 ml-12">

              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[q._id] || ""}
                onChange={(e) =>
                  setReplyText({
                    ...replyText,
                    [q._id]: e.target.value
                  })
                }
                className="border flex-1 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <button
                onClick={() => addReply(q._id)}
                className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
              >
                Reply
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}