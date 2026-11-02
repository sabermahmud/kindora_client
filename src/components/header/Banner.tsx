"use client";

import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";

type Slide = {
  image: string;
  kicker: string;
  heading: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  button2Label: string;
  button2Href: string;
};

const AUTO_PLAY_INTERVAL = 5000;

const slides: Slide[] = [
  {
    image: "/banner_imgs/ban-1.jpeg",
    kicker: "Give Hope For Homeless",
    heading: "Helping Each Other Can Make World Better",
    description:
      "Connect with passionate volunteers and create meaningful change in your community.",
    buttonLabel: "Discover Now",
    buttonHref: "/upcoming-events",
    button2Label: "Watch Video",
    button2Href: "/upcoming-events",
  },
  {
    image: "/banner_imgs/ban-2.jpeg",
    kicker: "Small Actions. Greater Impact.",
    heading: "Join Hands With Local Organizations",
    description:
      "Join hands with local organizations driving real, measurable impact every day.",
    buttonLabel: "Get Involved",
    buttonHref: "/categories",
    button2Label: "Watch Video",
    button2Href: "/categories",
  },
  {
    image: "/banner_imgs/ban-3.jpeg",
    kicker: "Build a Better Community",
    heading: "Find Meaningful Ways to Contribute",
    description:
      "Find meaningful ways to contribute your time and skills near you.",
    buttonLabel: "Start Volunteering",
    buttonHref: "/",
    button2Label: "Watch Video",
    button2Href: "/",
  },
];

export default function Banner() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track active slide
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Auto play
  useEffect(() => {
    if (!carouselApi) return;

    timerRef.current = setInterval(() => {
      carouselApi.scrollNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [carouselApi]);

  return (
    <section
      aria-label="Featured community initiatives"
      className="relative isolate w-full overflow-hidden bg-[#202B25]"
    >
      <Carousel
        setApi={setCarouselApi}
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image} className="relative pl-0">
              {/* Responsive Banner Height */}
              <div className="relative min-h-[520px] h-[72svh] max-h-[760px] w-full sm:min-h-[560px] md:h-[680px] lg:h-[720px]">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.heading}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  quality={90}
                  className="object-cover object-center"
                />

                {/* Responsive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/75 sm:bg-gradient-to-r sm:from-black/75 sm:via-black/55 sm:to-black/35" />

                {/* Content */}
                <div className="absolute inset-0 z-10 flex items-center justify-center px-5 py-16 sm:px-8 md:px-12 lg:px-16">
                  <div className="mx-auto w-full max-w-5xl text-center">
                    {/* Kicker */}
                    <div className="mb-4 inline-flex max-w-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F59E0B] drop-shadow-md sm:mb-6 sm:gap-4 sm:text-xs md:text-sm">
                      <span className="h-px w-6 shrink-0 bg-[#F59E0B]/60 sm:w-12" />

                      <span>{slide.kicker}</span>

                      <span className="h-px w-6 shrink-0 bg-[#F59E0B]/60 sm:w-12" />
                    </div>

                    {/* Heading */}
                    <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                      {slide.heading}
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/85 drop-shadow-md sm:mt-6 sm:text-base sm:leading-7 md:text-lg lg:text-xl">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mx-auto mt-7 flex w-full max-w-sm flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
                      <Link
                        href={slide.buttonHref}
                        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#D97706] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-8"
                      >
                        {slide.buttonLabel}

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>

                      <Link
                        href={slide.button2Href}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-8"
                      >
                        <Play className="h-4 w-4 fill-current" />

                        {slide.button2Label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination */}
      <div
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-8"
        aria-label="Banner navigation"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={selectedIndex === index ? "true" : undefined}
            className={cn(
              "h-1.5 w-6 rounded-full bg-white/50 transition-all duration-300 hover:bg-white/80 sm:h-2 sm:w-8",
              selectedIndex === index && "w-9 bg-[#F59E0B] sm:w-12",
            )}
          />
        ))}
      </div>
    </section>
  );
}
