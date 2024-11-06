import { MdOutlineLocalLaundryService } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center gap-2 border-t bg-[#f0f4ff] p-4">
      <div className="logo flex items-center justify-center gap-2">
        <MdOutlineLocalLaundryService fontSize={24} color="#2563eb" />
        <h1 className="font-semibold text-[#0c1b4d]">FARS</h1>
      </div>

      {/* Copyright */}
      <h1 className="text-center text-xs md:text-sm">
        ⓒ {currentYear} Feedback and Review System. All rights reserved.
      </h1>
    </footer>
  );
};

export default Footer;
