import Image from "next/image";
import "./footer.scss";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="mx-auto w-7xl mt-10 pt-[50px] pb-[15px]">
        <Image
          src="/pleague_logo_white.png"
          alt="logo"
          width="200"
          height="31"
        ></Image>
        <div className="flex gap-2 items-center mt-6">
          <a href="#">媒體合作</a>｜<a href="#">業務合作</a>｜
          <a href="#">購物須知</a>｜<a href="#">服務條款</a>｜
          <a href="#">隱私權政策</a>
        </div>
        <span className="text-[12px]"> © 2020-2025</span>
      </div>
    </footer>
  );
}
