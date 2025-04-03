import Layout from '@/components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout
      title="Privacy Policy - Sgd.to"
      description="Privacy Policy of Sgd.to, detailing the collection, use, and protection of personal information."
    >
      {/* Privacy Policy Section */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          {/* Section Heading */}
          <div className="flex justify-center">
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-center mb-10">Privacy Policy</h1>
            </div>
          </div>

          {/* Policy Content */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-3">Introduction</h3>
            <p className="mb-6 text-gray-700">
              At Sgd.to, we are committed to maintaining the trust and confidence of our visitors to our website. In this Privacy Policy, we&#39;ve provided detailed information on when and why we collect personal
              information, how we use it, and how we keep it secure.
            </p>

            <h3 className="text-xl font-bold mb-3">Information We Collect</h3>
            <p className="mb-3 text-gray-700">
              We may collect personal information including name, email address, phone number, and location when you:
            </p>
            <ul className="list-disc pl-8 mb-6 text-gray-700">
              <li className="mb-1">Sign up for our newsletter or updates.</li>
              <li className="mb-1">Submit inquiries through our contact form.</li>
              <li className="mb-1">Participate in surveys or promotional events.</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">Use of Your Information</h3>
            <p className="mb-3 text-gray-700">
              We use the information collected primarily to process the task for which you visited the website. Specifically, we may use your information for:
            </p>
            <ul className="list-disc pl-8 mb-6 text-gray-700">
              <li className="mb-1">Improving our services and website based on your feedback.</li>
              <li className="mb-1">Sending newsletters and promotional emails, if you&#39;ve opted in.</li>
              <li className="mb-1">Responding to your inquiries or requests.</li>
            </ul>

            <h3 className="text-xl font-bold mb-3">Sharing of Your Information</h3>
            <p className="mb-6 text-gray-700">
              We do not sell, rent or trade email lists with other companies and businesses for marketing purposes. We only share information with third parties when it is necessary to fulfill a specific request or
              provide a service to you.
            </p>

            <h3 className="text-xl font-bold mb-3">Security of Your Information</h3>
            <p className="mb-6 text-gray-700">
              We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.
            </p>

            <h3 className="text-xl font-bold mb-3">Cookies</h3>
            <p className="mb-6 text-gray-700">
              Cookies are used on this site to collect information on your browsing behavior. The information collected in this way can be used to identify you unless you modify your browser settings.
            </p>

            <h3 className="text-xl font-bold mb-3">Your Rights</h3>
            <p className="mb-6 text-gray-700">
              You are entitled to view, amend, or delete the personal information that we hold. Email your request to our data protection officer at contact@sgd.to.
            </p>

            <h3 className="text-xl font-bold mb-3">Changes to this Privacy Policy</h3>
            <p className="mb-6 text-gray-700">
              We may change this policy from time to time. Any changes will be immediately posted on this page and you will be deemed to have accepted the terms of the policy on your first use of the website
              following the alterations.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}