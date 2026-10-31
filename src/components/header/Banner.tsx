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
  CarouselNext,
  CarouselPrevious,
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
    image: "/banner_imgs/banner-1.jpeg",
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
    image: "/banner_imgs/banner-2.jpeg",
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
    image: "/banner_imgs/banner-3.jpeg",
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

  // Track the active carousel slide
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap() ?? 0);
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Auto slider carousel
  useEffect(() => {
    if (!carouselApi) return;

    timerRef.current = setInterval(() => {
      carouselApi.scrollNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [carouselApi]);

  return (
    <section className="relative w-full overflow-hidden bg-muted">
      <Carousel
        setApi={setCarouselApi}
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="min-h-screen sm:h-[500px]">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image} className="relative h-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.heading}
                fill
                sizes="100vw"
                className="object-cover object-center sm:object-top"
                priority={index === 0}
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-black/90 blur-xl" />

              {/* Content */}
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-6 sm:p-10 md:p-16">
                <div className="max-w-7xl text-center ">
                  {/* Kicker */}
                  <div className="flex items-center gap-3 text-[#F59E0B] text-sm font-semibold tracking-wider uppercase mb-2 drop-shadow-md">
                    <span className="flex-1 border-t border-[#F59E0B]/40" />
                    <span>{slide.kicker}</span>
                    <span className="flex-1 border-t border-[#F59E0B]/40" />
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl  font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl leading-tight">
                    {slide.heading}
                  </h2>

                  <p className="mt-4 text-base text-slate-100 drop-shadow-md sm:text-xl">
                    {slide.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-4">
                    <Link
                      href={slide.buttonHref}
                      className="inline-flex items-center justify-center rounded-md bg-[#F59E0B] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#D97706] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 sm:w-auto lg:px-8 lg:py-3.5"
                    >
                      {slide.buttonLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      href={slide.button2Href}
                      className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 sm:w-auto lg:px-8 lg:py-3.5"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {slide.button2Label}
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation */}
        <CarouselPrevious className="left-4 border-white/30 bg-black/30 text-white hover:bg-black/60 hover:text-white" />
        <CarouselNext className="right-4 border-white/30 bg-black/30 text-white hover:bg-black/60 hover:text-white" />
      </Carousel>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={selectedIndex === index ? "true" : undefined}
            className={cn(
              "h-2 w-8 rounded-full bg-white/50 transition-all duration-300 hover:bg-white/80",
              selectedIndex === index && "w-12 bg-white",
            )}
          />
        ))}
      </div>
    </section>
  );
}
