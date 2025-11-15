"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./Carousel.module.scss";
import { useState } from "react";

const slides = [
  { src: "/photo1.jpg", caption: "#EASL 全新賽季 #YourGame" },
  { src: "/photo2.jpg", caption: "#新賽季準備來襲 #Focus" },
  { src: "/photo3.jpg", caption: "#ALL BRAVES,ALL HEART勇者之心" },
  { src: "/photo4.jpg", caption: "#再下一橘" },
  { src: "/photo5.jpg", caption: "#ARK COURT, ARK RULES! 我要拚，我主宰 " },
  { src: "/photo6.jpg", caption: "#台鋼獵鷹 ENGAGE|迎南而上 " },
];

export default function Carousel() {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.carousel}>
      <Swiper
        onSlideChange={(swiper: SwiperType) => setActive(swiper.realIndex)}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className={styles.slider}
      >
        {slides.map(({ src }) => (
          <SwiperSlide key={src}>
            <Image src={src} alt="" width={1905} height={825} />
          </SwiperSlide>
        ))}
        <div className={styles.caption}>
          <div className="flex justify-center items-center gap-2 cursor-pointer">
            <div>{slides[active].caption}</div>
            <div className="bg-[#bb986c] px-4 py-[3px] rounded-md text-[16px]">
              了解更多
            </div>
          </div>
        </div>
      </Swiper>
    </section>
  );
}
