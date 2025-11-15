"use client";

import Image from "next/image";
import Iconfb from "@/icons/facebook.svg";
import IconIG from "@/icons/instagram.svg";
import IconYT from "@/icons/youtube.svg";
import IconTW from "@/icons/twitter.svg";
import IconLN from "@/icons/linked.svg";

export function HeaderNav() {
  return (
    <>
      <div className="flex justify-end mx-[30px] mt-4 items-center gap-4">
        <Iconfb width={24} height={24} className="topsvg " />
        <IconIG width={24} height={24} className="topsvg " />
        <IconYT width={20} height={20} className="topsvg " />
        <IconTW width={20} height={20} className="topsvg " />
        <IconLN width={24} height={24} className="topsvg " />
      </div>
      <nav className="navbar navbar-expand-lg navbar-black bg-black flex ">
        <div className="container-fluid nav-container">
          <div className="nav-left">
            <a className="navbar-brand fw-bold " href="#"></a>
            <Image src="/pleague_logo.png" alt="pleague_logo" width={80} height={80} className="absolute mb-5" />
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse ml-20" id="navbarNav">
              <ul className="navbar-nav nav-links gap-5 ml-[150px]">
                <li className="nav-item dropdown ">
                  <a className="nav-link dropdown-toggle no-caret text-white" href="#">
                    賽程 ╱ 比分
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">PLG</a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <a className="dropdown-item" href="#">EASL</a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item"><a className="nav-link text-white" href="#">戰績</a></li>
                <li className="nav-item dropdown ">
                  <a className="nav-link dropdown-toggle no-caret text-white" href="#">數據</a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">綜合排行</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">特殊表現</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <div>
                          <p>球員數據</p>
                          <p className="text-[12px] text-gray-500">基本數據、進階數據</p>
                        </div>
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">球隊數據</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">TEAM CHART</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">ALL PLAYERS</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown ">
                  <a className="nav-link dropdown-toggle no-caret text-white" href="#">消息</a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">註冊註銷</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">新聞總覽</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">照片圖輯</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">精彩影音</a></li>
                  </ul>
                </li>
                <li className="nav-item"><a className="nav-link text-white" href="#">球隊</a></li>
                <li className="nav-item"><a className="nav-link text-white" href="#">關於</a></li>
                <li className="nav-item"><a className="nav-link text-white" href="#">購票</a></li>
                <li className="nav-item"><a className="nav-link text-white" href="#">商品</a></li>
              </ul>
            </div>
          </div>
          <div className="nav-icon-group">
            <div className="nav-icon">
              <Image src="/search.png" width={28} height={28} alt="search" />
            </div>
            <div className="nav-icon">
              <Image src="/cart.png" width={24} height={24} alt="cart" />
            </div>
            <div className="nav-icon">
              <Image src="/user.png" width={30} height={30} alt="user" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

