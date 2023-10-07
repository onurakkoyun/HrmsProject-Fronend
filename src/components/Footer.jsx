import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const footerNavs = [
    {
      id: 1,
      href: "/home",
      name: "Home",
    },
    {
      id: 2,
      href: "/jobPostings/listall",
      name: "Find Jobs",
    },
    {
      id: 3,
      href: "http://localhost:8081/employers",
      name: "Companies",
    },
    {
      id: 4,
      href: "/aboutUs",
      name: "About Us",
    },
  ];
  return (
    <footer className="text-gray-500 bg-white mt-10 px-4 py-5 max-w-screen-xl mx-auto md:px-8">
      <div className="max-w-lg sm:mx-auto sm:text-center">
        <img
          src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg"
          className="w-16 h-16 sm:mx-10"
        />
        <p className="leading-relaxed mt-2 text-[15px]">
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
        </p>
      </div>
      <ul className="justify-center space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
        {footerNavs.map((item) => (
          <li className="mt-5" key={item.id}>
            <a className="text-gray-500 hover:text-gray-800" href={item.href}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="items-center justify-between sm:flex">
        <div className="mt-6 sm:mt-0">
          &copy; {new Date().getFullYear()} ・ Onur Can AKKOYUN
        </div>
        <div className="mt-6 sm:mt-0">
          <ul className="flex items-center space-x-4">
            <li className="w-6 h-6 border rounded-full flex items-center justify-center">
              <a
                className="text-gray-800 hover:text-gray-500"
                href="https://github.com/onurakkoyun"
              >
                <FontAwesomeIcon icon={faGithub} size="2xl" />
              </a>
            </li>

            <li className="w-6 h-6 border rounded-full flex items-center justify-center">
              <a
                className="text-[#2c78c3]-800 hover:text-gray-500"
                href="https://www.linkedin.com/in/onurcanakkoyun/"
              >
                <FontAwesomeIcon icon={faLinkedin} size="2xl" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
