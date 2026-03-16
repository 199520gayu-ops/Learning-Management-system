export default function About() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 min-h-screen text-white">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          About <span className="text-yellow-300">Learnify</span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto text-white/90">
          Learnify is a modern learning platform designed to help students,
          educators, and professionals build real-world skills with confidence.
        </p>
      </section>

      {/* INFO CARDS */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid gap-8 md:grid-cols-3">
        
        <Card
          title="🚀 Our Mission"
          desc="To empower learners with industry-ready skills through practical and engaging education."
        />

        <Card
          title="🎯 What We Offer"
          desc="High-quality courses, expert instructors, structured learning paths, and real projects."
        />

        <Card
          title="💡 Why Learnify"
          desc="Modern UI, personalized learning, career-focused curriculum, and community support."
        />

      </section>

      {/* STATS */}
      <section className="bg-white text-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4 text-center">
          <Stat number="10K+" label="Students" />
          <Stat number="150+" label="Courses" />
          <Stat number="50+" label="Educators" />
          <Stat number="95%" label="Success Rate" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-6">
          Build Your Future With Learnify
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-white/90">
          Join thousands of learners who are transforming their careers with us.
        </p>
        <button className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition">
          Get Started
        </button>
      </section>

    </div>
  );
}

/* Reusable Components */

function Card({ title, desc }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition transform shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-white/90">{desc}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <h3 className="text-4xl font-extrabold text-indigo-600">{number}</h3>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}
