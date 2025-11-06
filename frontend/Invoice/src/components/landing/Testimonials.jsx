import React from "react";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../utils/data";
const Testimonials=()=>{
    return (
      <section id="testimonials" className="py-20 lg:py-28 bg-[#0d0013]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Why Our Users Choose Us Stories from Happy Clients
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              We are trusted by thousands of small businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl hover:shadow-blue-900/50 transition-all duration-300 relative hover:-translate-y-1 border border-blue-900"
              >
                <div className="absolute top-4 left-8  bg-gradient-to-br from-blue-950 to blue-900 rounded-full flex items-center justify-center text-black w-8 h-8">
                  <Quote className="w-5 h-5 " />
                </div>
                <p className="text-gray-700 mb-6 pt-4 leading-relaxed italic text-lg">
                  {testimonial.quote}
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-900"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
export default Testimonials;