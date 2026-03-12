import defaultImage from '../assets/images/ComingSoon.jpg';

interface HomeBannerProps {
  backdrop?: string | null;
}

const HomeBanner = ({ backdrop }: HomeBannerProps) => {
  const imageSrc = backdrop ?? defaultImage;

  return (
    <div className="relative scale-110 mt-15 -left-10 z-0 w-full h-185 overflow-hidden">
      <img
        src={imageSrc}
        alt="movie backdrop"
        loading="lazy"
        className="w-full h-full object-cover object-[center_10%] rounded-md"
      />

      {/* overlay layers */}
      <div className="absolute inset-0 dark:bg-black/35" />
      <div className="absolute inset-0 dark:bg-linear-to-t from-black via-transparent to-transparent" />
      <div className="absolute inset-0 dark:bg-linear-to-b from-black/40 via-transparent to-transparent" />
    </div>
  );
};

export default HomeBanner;
