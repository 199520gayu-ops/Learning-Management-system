export default function Testimonials() {
  const items = [
    { id: 1, name: "Asha K.", text: "Learnify helped me switch careers — hands-on and practical." },
    { id: 2, name: "Ravi P.", text: "Great instructors and clear projects. Loved the mentorship." },
    { id: 3, name: "Maya S.", text: "Certificates helped me land interviews. Highly recommend." },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 bg-indigo-50 rounded-t-xl">
      <h3 className="text-2xl font-bold text-center mb-8">What learners say</h3>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-700 mb-4">“{it.text}”</p>
            <div className="text-sm font-semibold text-indigo-700">{it.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
