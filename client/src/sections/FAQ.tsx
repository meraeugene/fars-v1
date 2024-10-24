import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What services does Zerca Laundry Lounge offer?",
    answer:
      "We offer a variety of laundry services including wash and fold, dry cleaning.",
  },
  {
    question: "What are your operating hours?",
    answer: "We are open from 8:00 AM to 8:00 PM, Monday to Saturday.",
  },
  {
    question: "How long does the laundry service take?",
    answer:
      "Typically, our wash and fold service takes 24 hours. Express services are available for faster turnaround.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-[#f0f4ff] mx-auto  p-4 pb-24 md:px-10 lg:px-16 xl:px-60 pt-16">
      <div className="flex flex-col lg:flex-row md:gap-16 lg:gap-14 gap-10 ">
        <div className="faqs__container basis-1/2">
          <h2 className="text-2xl text-[#0c1b4d] font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-300 rounded-lg">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-4 border border-[#4a71ff] text-left text-base font-medium rounded-md rounded-br-none rounded-bl-none transition-all duration-300 ease-in-out bg-[#fff]"
                >
                  {faq.question}
                  <span className="ml-4">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>
                <div
                  className={`transition-[max-height] duration-200 ease-in-out overflow-hidden ${
                    openIndex === index ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="p-4 border text-base border-[#4a71ff] border-t-0 text-gray-700 bg-white">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="maps__container w-full basis-1/2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.986903753061!2d124.62956767568821!3d8.500651597034143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff305166a30d1%3A0x6b28f050efb47d4d!2sZerca%20Laundry%20Lounge!5e0!3m2!1sen!2sph!4v1729676019941!5m2!1sen!2sph"
            width="100%"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
