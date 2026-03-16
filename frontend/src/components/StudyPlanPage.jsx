import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudyPlanPage() {

  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    title: "",
    topic: "",
    date: "",
    duration: ""
  });

  const API = "http://localhost:5000/api/plan";

  // GET TOKEN FROM LOCAL STORAGE
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  // GET STUDY PLANS
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {

      const res = await axios.get(API, config);

      setPlans(res.data);

    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };


  // ADD PLAN
  const addPlan = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(API, form, config);

      setPlans([...plans, res.data]);

      setForm({
        title: "",
        topic: "",
        date: "",
        duration: ""
      });

    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };


  // TOGGLE COMPLETE
  const toggleComplete = async (id, completed) => {

    try {

      await axios.put(`${API}/${id}`, {
        completed: !completed
      }, config);

      setPlans(
        plans.map((plan) =>
          plan._id === id
            ? { ...plan, completed: !completed }
            : plan
        )
      );

    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };


  // DELETE PLAN
  const deletePlan = async (id) => {

    try {

      await axios.delete(`${API}/${id}`, config);

      setPlans(plans.filter((plan) => plan._id !== id));

    } catch (error) {
      console.error("Error deleting plan:", error);
    }

  };


  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Study Plan / Learning Schedule
      </h1>


      {/* ADD PLAN FORM */}

      <form
        onSubmit={addPlan}
        className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
      >

        <h2 className="text-xl font-semibold">
          Add Study Plan
        </h2>

        <input
          type="text"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Topic"
          required
          value={form.topic}
          onChange={(e) =>
            setForm({ ...form, topic: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <input
          type="date"
          required
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Duration"
          required
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Plan
        </button>

      </form>


      {/* PLAN LIST */}

      <div className="grid md:grid-cols-2 gap-4">

        {plans.map((plan) => (

          <div
            key={plan._id}
            className={`p-4 rounded-lg border shadow-sm ${
              plan.completed
                ? "bg-green-50 border-green-300"
                : "bg-white"
            }`}
          >

            <h3 className="text-lg font-semibold">
              {plan.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {plan.topic}
            </p>

            <div className="flex justify-between mt-2 text-sm">
              <span>📅 {plan.date?.slice(0,10)}</span>
              <span>⏱ {plan.duration}</span>
            </div>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() =>
                  toggleComplete(plan._id, plan.completed)
                }
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                {plan.completed ? "Completed" : "Mark Done"}
              </button>

              <button
                onClick={() => deletePlan(plan._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}