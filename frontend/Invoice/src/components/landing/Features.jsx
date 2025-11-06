import { ArrowRight } from "lucide-react";
import { FEATURES } from "../../utils/data";

const Features=()=>{
    return (
      <section id="features" className="py-20 lg:py-28 bg-[#06000a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Smart Tools for a Smarter Business.
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your invoicing and get paid.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-2xl p-8 shadow-md hover:shadow-xl hover:shadow-blue-900/50  transition-all duration-300 hover:-translate-y-1 border-2 border-blue-900"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-10 h-10 text-blue-900 bg-gray-300 rounded-lg pt-1 pb-1 " />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center mt-6 text-blue-900 font-medium hover:text-black transition-colors duration-300"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}   
export default Features;