import Layout from '@/components/Layout';
import Image from "next/image";

export default function About() {
  return (
    <Layout
      title="About Us - Real-Time Currency Conversion | Sgd.to"
      description="Learn about Sgd.to, your reliable tool for real-time currency conversion. Discover our mission to provide the most accurate and up-to-date exchange rates to help you make informed financial decisions."
    >
      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          {/* Section Header */}
          <div className="flex justify-center">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-center mb-2">Our Journey</h2>
              <p className="text-xl text-center text-gray-600">
                Empowering your financial decisions with accurate currency conversion.
              </p>
            </div>
          </div>

          {/* Section Content */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
<Image
                  src="https://cdn.corporatefinanceinstitute.com/assets/currency-basket.jpeg"
                  alt="Image representing currency"
                  width={600}
                  height={400}
                  priority={false}
                  className="mx-auto my-6 rounded border border-gray-300"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />

              <small className="text-gray-500 block mt-2">
                Image source: <a href="https://corporatefinanceinstitute.com/" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Corporate Finance Institute</a>
              </small>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
              <p className="mb-6 text-gray-700">
                Founded in 2024, Sgd.to was created to simplify the complex world of currency exchange. We provide a reliable, real-time currency converter that helps users around the globe make informed
                financial decisions with the most accurate exchange rates available.
              </p>
              
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700">
                Our mission is to deliver the most precise and up-to-date currency conversion information to our users. Whether you&#39;re a traveler, a business owner, or a financial enthusiast, Sgd.to is here to
                ensure you have the information you need, when you need it.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Our Values</h2>
              <p className="text-xl text-gray-600 mb-10">
                Driven by accuracy, powered by innovation, committed to transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Value 1 */}
              <div className="px-4">
                <div className="text-primary text-4xl mb-4">
                  <i className="bi bi-lightbulb-fill"></i>
                </div>
                <h4 className="text-xl font-bold mb-3">Accuracy Above All</h4>
                <p className="text-gray-700">We strive to provide the most accurate currency exchange rates in real-time.</p>
              </div>
              
              {/* Value 2 */}
              <div className="px-4">
                <div className="text-primary text-4xl mb-4">
                  <i className="bi bi-lightbulb-fill"></i>
                </div>
                <h4 className="text-xl font-bold mb-3">Innovation in Finance</h4>
                <p className="text-gray-700">We use cutting-edge technology to ensure our currency conversion tool is fast, reliable, and easy to use.</p>
              </div>
              
              {/* Value 3 */}
              <div className="px-4">
                <div className="text-primary text-4xl mb-4">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h4 className="text-xl font-bold mb-3">Commitment to Transparency</h4>
                <p className="text-gray-700">We believe in providing clear, transparent information, free from hidden fees or misleading data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}