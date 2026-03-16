export default function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition">
          <h4 className="text-lg font-bold mb-2">Hands-on Projects</h4>
          <p className="text-gray-600">Build portfolio-ready projects while you learn.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition">
          <h4 className="text-lg font-bold mb-2">Expert Mentors</h4>
          <p className="text-gray-600">Get guidance from industry professionals and instructors.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition">
          <h4 className="text-lg font-bold mb-2">Verified Certificates</h4>
          <p className="text-gray-600">Earn certificates to showcase your skills to employers.</p>
        </div>
      </div>
    </section>
  );
}
