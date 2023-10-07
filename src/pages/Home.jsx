import React from "react";
import CtaPhoto from "../images/cta-phot.png";

const Home = () => {
  return (
    <div>
      {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}

      <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Explore Business Opportunities Now
            </h2>

            <p className="text-xl font-semibold text-blue-500 md:text-gray-700 md:mt-4 md:block">
              Ready to Level Up Your Career?
            </p>
            <p className="hidden text-gray-500 md:mt-4 md:block">
              Join thousands of successful job seekers who have found their
              dream jobs through us. Your dream job is just a click away.
            </p>

            <span className="text-xl font-bold text-gray-500 md:text-md md:font-light">
              Don't miss out on this opportunity to shape your future!
            </span>

            <div className="mt-3 md:mt-6">
              <a
                href="/jobPostings/listall"
                className="inline-block rounded bg-[#04B16F] px-8 py-3 text-md font-bold text-white hover:text-white transition hover:bg-[#57896A] focus:outline-none focus:ring focus:ring-yellow-400"
              >
                <span>Discover job postings</span>
              </a>
            </div>
          </div>
        </div>

        <img
          alt="Violin"
          src={CtaPhoto}
          className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_6rem)] md:rounded-ss-[80px]"
        />
      </section>
    </div>
  );
};

export default Home;
