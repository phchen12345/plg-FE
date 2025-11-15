"use client";

import Image from "next/image";
import "./home.scss";
import Iconfb from "../icons/facebook.svg";
import IconIG from "../icons/instagram.svg";
import IconYT from "../icons/youtube.svg";
import IconTW from "../icons/twitter.svg";
import IconLN from "../icons/linked.svg";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { ScheduleCarousel } from "@/components/ScheduleCarousel";
import Carousel from "@/components/Carousel";
import StandingTable from "@/components/StandingTable";

type ScheduleMatch = {
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
  matches: ScheduleMatch[];
};

const scheduleSlides: ScheduleSlide[] = [
  {
    id: "week-2",
    label: "例行賽",
    week: "WEEK 2",
    matches: [
      {
        id: "g01",
        date: "11/08 (六)",
        home: "領航猿",
        away: "勇士",
        homeScore: "0",
        awayScore: "1",
      },
      {
        id: "g02",
        date: "11/09 (日)",
        home: "洋基",
        away: "勇士",
        homeScore: "1",
        awayScore: "0",
      },
    ],
  },
  {
    id: "week-3",
    label: "例行賽",
    week: "WEEK 3",
    matches: [
      {
        id: "g03",
        date: "11/15 (六)",
        home: "獵鷹",
        away: "領航猿",
        homeScore: "0",
        awayScore: "1",
      },
      {
        id: "g04",
        date: "11/16 (日)",
        home: "勇士",
        away: "洋基",
        homeScore: "1",
        awayScore: "0",
      },
    ],
  },
  {
    id: "week-4",
    label: "例行賽",
    week: "WEEK 4",
    matches: [
      {
        id: "g05",
        date: "11/22 (六)",
        home: "領航猿",
        away: "勇士",
        homeScore: "—",
        awayScore: "—",
      },
      {
        id: "g06",
        date: "11/23 (日)",
        home: "勇士",
        away: "洋基",
        homeScore: "—",
        awayScore: "—",
      },
    ],
  },
  {
    id: "week-5",
    label: "例行賽",
    week: "WEEK 5",
    matches: [
      {
        id: "g07",
        date: "11/29 (六)",
        home: "獵鷹",
        away: "勇士",
        homeScore: "—",
        awayScore: "—",
      },
      {
        id: "g08",
        date: "11/30 (日)",
        home: "洋基",
        away: "領航猿",
        homeScore: "—",
        awayScore: "—",
      },
    ],
  },
];

export default function Home() {
  return (
    <>
      <div className=" min-h-screen bg-black ">
        <div className="mb-4">
          <ScheduleCarousel slides={scheduleSlides} />
        </div>
        <Carousel />
        <section className="standing w-full">
          <div className="flex flex-col items-center w-7xl mx-auto">
            <StandingTable />
          </div>
        </section>
      </div>
    </>
  );
}
