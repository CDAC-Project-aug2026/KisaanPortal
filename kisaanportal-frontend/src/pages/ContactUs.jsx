import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function ContactUs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("Backend will be connected later.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-14">
        <div className="text-center" data-aos="fade-down">
          <h1 className="text-5xl font-bold mt-6 text-gray-800">
            Let's Start A Conversation
          </h1>

          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full mt-6"></div>

          <p className="text-gray-600 text-lg leading-8 mt-6 max-w-2xl mx-auto">
            We'd love to hear your questions,
            suggestions or feedback.
            Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div
          data-aos="fade-up"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Address */}
          <div className="bg-white rounded-3xl shadow-xl p-7 text-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              📍
            </div>

            <h3 className="font-bold text-xl mt-5">
              Address
            </h3>

            <p className="text-gray-600 mt-3">
              CDAC ACTS
              <br />
              Pune, Maharashtra
            </p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-3xl shadow-xl p-7 text-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              📞
            </div>

            <h3 className="font-bold text-xl mt-5">
              Phone
            </h3>

            <p className="text-gray-600 mt-3">
              +91 98765 43210
            </p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-3xl shadow-xl p-7 text-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              📧
            </div>

            <h3 className="font-bold text-xl mt-5">
              Email
            </h3>

            <p className="text-gray-600 mt-3 break-all">
              support@kisaanportal.com
            </p>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-3xl shadow-xl p-7 text-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🕒
            </div>

            <h3 className="font-bold text-xl mt-5">
              Working Hours
            </h3>

            <p className="text-gray-600 mt-3">
              Mon - Sat
              <br />
              9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-16 px-6">
        <div
          data-aos="zoom-in"
          className="max-w-5xl mx-auto bg-white rounded-[35px] shadow-2xl p-10 border border-green-100"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800">
            Send Us A Message
          </h2>

          <p className="text-center text-gray-500 mt-3 mb-10">
            Fill in your details and we'll contact you shortly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>

            <textarea
              name="message"
              rows="7"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-600 outline-none resize-none"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              Send Message →
            </button>
          </form>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="pb-16 px-6">
        <div
          data-aos="fade-up"
          className="max-w-6xl mx-auto bg-gradient-to-r from-green-700 via-green-600 to-green-700 rounded-[35px] p-10 text-white shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              We're Always Ready To Help
            </h2>

            <p className="mt-5 text-green-100 max-w-3xl mx-auto leading-8">
              Whether you're a farmer looking to rent equipment
              or an owner who wants to list machinery,
              KisaanPortal is here to make the process simple,
              secure and hassle-free.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 py-4">
                📧 support@kisaanportal.com
              </div>

              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 py-4">
                📞 +91 98765 43210
              </div>

              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 py-4">
                📍 Pune, Maharashtra
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
