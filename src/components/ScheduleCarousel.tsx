"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Match = {
  id: string;
  date: string;
  home: string;
  away: string;
  homeScore: string;
  awayScore: string;
};

type ScheduleSlide = {
  id: string;
  label: string;
  week: string;
  matches: Match[];
};

const teamHighlightClass: Record<string, string> = {
  領航猿: "schedule-card--orange",
  勇士: "schedule-card--blue",
  獵鷹: "schedule-card--red",
  洋基: "schedule-card--green",
};

const teamLogos: Record<string, string> = {
  領航猿: "/pilots.png",
  勇士: "/braves.png",
  獵鷹: "/GhostHawks.png",
  洋基: "/yankees.png",
};

type Props = {
  slides: ScheduleSlide[];
};

export function ScheduleCarousel({ slides }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="schedule-section">
      <div className="schedule-swiper-wrapper">
        <Swiper
          className="schedule-swiper"
          onSwiper={(instance) => (swiperRef.current = instance)}
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 24 },
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="schedule-slide">
                <div className="schedule-slide__meta flex flex-col justify-center">
                  <span className="schedule-slide__label">{slide.label}</span>
                  <span className="schedule-slide__week">{slide.week}</span>
                </div>
                <div className="schedule-card-list">
                  {slide.matches.map((match) => {
                    const highlight = teamHighlightClass[match.home];
                    return (
                      <div
                        key={match.id}
                        className={`schedule-card${
                          highlight ? ` ${highlight}` : ""
                        }`}
                      >
                        <div className="schedule-card__header">
                          <span className="schedule-match__game">
                            {match.id.toUpperCase()}
                          </span>
                          <span className="schedule-match__date">
                            {match.date}
                          </span>
                        </div>
                        <div className="schedule-card__divider" />
                        <div className="schedule-card__body">
                          <div className="schedule-match__row">
                            <Image
                              src={
                                teamLogos[match.home] ?? "/logos/default.png"
                              }
                              alt={match.home}
                              width={24}
                              height={24}
                            />
                            <span>{match.home}</span>
                            <span>{match.homeScore}</span>
                          </div>
                          <div className="schedule-match__row">
                            <Image
                              src={
                                teamLogos[match.away] ?? "/logos/default.png"
                              }
                              alt={match.away}
                              width={24}
                              height={24}
                            />
                            <span>{match.away}</span>
                            <span>{match.awayScore}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SwiperSlide>
          ))}

          <SwiperSlide key="cta">
            <button className="schedule-more-slide">
              <span>查看更多</span>
              <span>完整賽程</span>
            </button>
          </SwiperSlide>
        </Swiper>

        <button
          className="schedule-nav-btn schedule-nav-btn--prev"
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <Image src="/arrow-left.png" width={30} height={30} alt="上一張" />
        </button>
        <button
          className="schedule-nav-btn schedule-nav-btn--next"
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <Image src="/arrow-right.png" width={30} height={30} alt="下一張" />
        </button>
      </div>
    </section>
  );
}
