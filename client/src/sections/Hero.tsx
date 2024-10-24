const Hero = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  return (
    <div className="hero__container flex flex-col gap-12  md:flex-row md:px-10 md:pb-12 md:gap-12 lg:px-16 lg:items-center xl:px-60 bg-[#f0f4ff]">
      <div className="px-5 content__container flex flex-col gap-4 text-center md:basis-1/2 md:px-0 xl:px-36">
        <h1 className="h2-bold text-[#0c1b4d]">Your Opinion Matters!</h1>
        <p className="p-regular-16 text-[#777fa1]">
          Help us improve by sharing your thoughts. Whether we made your laundry
          day easier or you have suggestions for improvement, your feedback
          helps us serve you better.
        </p>
        <div
          className="cta-button md:mt-2 cursor-pointer  hover:text-white transition-all duration-300  ease-out"
          onClick={onGetStartedClick}
        >
          Get Started
        </div>
      </div>
      <div className="image__container md:basis-1/2 px-5 pb-10 md:px-0">
        <img
          src="/boy.svg"
          alt="laundry"
          loading="lazy"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
    </div>
  );
};

export default Hero;
