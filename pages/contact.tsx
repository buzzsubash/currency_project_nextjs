import { useState } from 'react';
import Layout from '@/components/Layout';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just console.log the data
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <Layout
      title="Contact Us - Sgd.to"
      description="Get in touch with Sgd.to for inquiries, feedback, or more information about currency conversion."
    >
      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          {/* Section Heading */}
          <div className="flex justify-center">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-center mb-2">Get in Touch</h2>
              <p className="text-xl text-center text-gray-600">
                Have questions or feedback? We&#39;d love to hear from you.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-10 flex justify-center">
            <div className="w-full lg:w-1/2">
              <form id="contactForm" onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                </div>
                
                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Your Email</label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                </div>
                
                {/* Message Textarea */}
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                  <textarea 
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button 
                    type="submit" 
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-5">
          <div className="flex justify-center">
            <div className="lg:w-1/2">
              <div className="text-center mt-4">
                <h3 className="text-2xl font-bold mb-3">Email Us</h3>
                <p className="text-xl mb-0">contact@sgd.to</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}