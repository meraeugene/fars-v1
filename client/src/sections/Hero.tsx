const Hero = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  return (
    <div className="hero__container flex flex-col gap-12 bg-[#f0f4ff] md:flex-row md:gap-12 md:px-10 md:pb-12 lg:items-center lg:gap-16 lg:px-16 xl:px-40">
      <div className="content__container flex flex-col gap-4 px-5 text-center md:basis-1/2 md:px-0 xl:px-24">
        <h1 className="h2-bold text-[#0c1b4d]">Your Opinion Matters!</h1>

        <p className="p-regular-16 mb-2 text-[#333f61] lg:mb-3">
          Help us improve by sharing your thoughts. Whether we made your laundry
          day easier or you have suggestions for improvement, your feedback
          helps us serve you better.
        </p>
        <button
          aria-label="get-started"
          className="box w-[85%] rounded-xl px-6 py-4 md:w-[80%] lg:w-[70%]"
          onClick={onGetStartedClick}
        >
          <span>Get Started</span>
          <i></i>
        </button>
      </div>
      <div className="image__container px-5 pb-10 md:basis-1/2 md:px-0">
        <img
          src="/hero.webp"
          alt="laundry"
          // loading="lazy"
          width={450}
          height={450}
          fetchPriority="high"
          className="h-full w-full rounded-lg object-cover lg:w-[80%]"
        />
      </div>
    </div>
  );
};

export default Hero;
