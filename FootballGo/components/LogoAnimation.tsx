"use client";
import { motion } from 'framer-motion';
import Image from "next/image";
import React from "react";
import LogoLiverpool from "@/app/public/Logo_FC_Liverpool.svg.png";
import LogoRealMadrid from "@/app/public/Logo_Real_Madrid.svg.png";
import LogoBarcelone from "@/app/public/Logo_FC_Barcelona.svg.webp";
import LogoManCity from "@/app/public/Logo_Manchester_City_2016.svg";
import LogoBayern from "@/app/public/FC_Bayern_München_logo_(2017).svg.png";
import LogoArsenal from "@/app/public/Arsenal_FC.svg.webp";

const LogoAnimation = () => {
  const logos = [
    { src: LogoLiverpool, alt: "Liverpool" },
    { src: LogoRealMadrid, alt: "Real Madrid" },
    { src: LogoManCity, alt: "Manchester City" },
    { src: LogoBayern, alt: "Bayern" },
    { src: LogoBarcelone, alt: "Barcelone" },
    { src: LogoArsenal, alt: "Arsenal" }
  ];

  return (
    <div className="bg-black py-16 md:py-12">
      <div className="container mx-auto mt-24 max-w-3xl md:max-w-6xl px-8">
        <div>
          <p className="text-center text-white py-8 mb-4 text-lg md:text-2xl font-medium">
            Les clubs partenaires de DevGo
          </p>
        </div>
        <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-32 before:bg-gradient-to-r before:from-black before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-32 after:bg-gradient-to-l after:from-black after:to-transparent">
          <motion.div
            className="flex gap-8 md:gap-24"
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 12,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
              <Image
                key={index}
                src={logo.src}
                alt={logo.alt}
                className="w-auto h-12 md:h-20 lg:h-24 flex-shrink-0"
                priority
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LogoAnimation;