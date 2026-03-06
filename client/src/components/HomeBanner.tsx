import defaultImage from '../assets/images/ComingSoon.jpg';

const IMAGE_BANNER_URL = 'https://image.tmdb.org/t/p/original';

const HomeBanner = ({ backdrop }: { backdrop: string }) => {
  return (
    <>
      <div className="relative scale-110 -left-10 z-0 w-full h-185 overflow-hidden">
        <img
          src={backdrop ? `${IMAGE_BANNER_URL}${backdrop}` : defaultImage}
          className="w-full h-full  object-cover object-[center_10%] rounded-md "
          alt="movie backdrop"
        />

        <div className="absolute inset-0 dark:bg-black/35" />

        <div className="absolute inset-0 dark:bg-linear-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 dark:bg-linear-to-b from-black/40 via-transparent to-transparent" />
      </div>
    </>
  );
};

export default HomeBanner;
