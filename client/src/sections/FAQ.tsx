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
    <div className="mx-auto w-full bg-[#f0f4ff] p-4 pb-24 pt-20 md:px-10 lg:px-16 xl:px-60">
      <div className="flex flex-col gap-10 md:gap-16 lg:flex-row lg:gap-14">
        <div className="faqs__container basis-1/2">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#0c1b4d]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-300">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between rounded-md rounded-bl-none rounded-br-none border border-[#4a71ff] bg-[#fff] p-4 text-left text-base font-medium shadow-xl shadow-blue-100 transition-all duration-300 ease-in-out"
                >
                  {faq.question}
                  <span className="ml-4">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
                    openIndex === index ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="border border-t-0 border-[#4a71ff] bg-white p-4 text-base text-gray-700 shadow-xl shadow-blue-100">
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
            className="rounded-lg shadow-xl shadow-blue-200"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
