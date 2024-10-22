const Hero = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  return (
    <div className="hero__container flex flex-col gap-6">
      <div className="px-5 content__container flex flex-col gap-4 text-center">
        <h1 className="h2-bold ">Your Opinion Matters!</h1>
        <p className="p-regular-16 text-neutral-600">
          Help us improve by sharing your thoughts. Whether we made your laundry
          day easier or you have suggestions for improvement, your feedback
          helps us serve you better.
        </p>
        <div className="cta-button" onClick={onGetStartedClick}>
          Get Started
        </div>
      </div>
      <div className="image__container">
        <img src="/hero.jpg" alt="laundry" loading="lazy" />
      </div>
    </div>
  );
};

export default Hero;
