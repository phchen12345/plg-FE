"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/store/userAuthStore";
import { logout } from "@/api/login/login_api";

import Image from "next/image";
import Iconfb from "@/icons/facebook.svg";
import IconIG from "@/icons/instagram.svg";
import IconYT from "@/icons/youtube.svg";
import IconTW from "@/icons/twitter.svg";
import IconLN from "@/icons/linked.svg";

import "./headerNav.scss";

export default function HeaderNav() {
  const { state, dispatch } = useCart();

  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore(); // 清登入狀態
      dispatch({ type: "RESET" }); // 把購物車數量清零
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-end mx-[30px] mt-4 items-center gap-4">
        <Iconfb width={24} height={24} className="topsvg" />
        <IconIG width={24} height={24} className="topsvg" />
        <IconYT width={20} height={20} className="topsvg" fill="#fff" />
        <IconTW width={20} height={20} className="topsvg" fill="#fff" />
        <IconLN width={24} height={24} className="topsvg" fill="#fff" />
      </div>

      <nav className="navbar navbar-expand-lg navbar-black bg-black flex">
        <div className="container-fluid nav-container">
          <div className="nav-left">
            <a href="/" className="absolute mb-5">
              <Image
                src="/pleague_logo.png"
                alt="pleague_logo"
                width={80}
                height={80}
              />
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="navbar-collapse ml-20" id="navbarNav">
              <ul className="navbar-nav nav-links gap-5 ml-[150px]">
                <li className="nav-item dropdown ">
                  <a
                    className="nav-link dropdown-toggle no-caret text-white"
                    href="#"
                  >
                    賽程 ╱ 比分
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        PLG
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        EASL
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    戰績
                  </a>
                </li>
                <li className="nav-item dropdown ">
                  <a
                    className="nav-link dropdown-toggle no-caret text-white"
                    href="#"
                  >
                    數據
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        綜合排行
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        特殊表現
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <div className="">
                          <p>球員數據</p>
                          <p className="text-[12px] text-gray-500">
                            基本數據、進階數據
                          </p>
                        </div>
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        球隊數據
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        TEAM CHART
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        ALL PLAYERS
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown ">
                  <a
                    className="nav-link dropdown-toggle no-caret text-white"
                    href="#"
                  >
                    消息
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        註冊註銷
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        新聞總覽
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        照片圖輯
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        精彩影音
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    球隊
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    關於
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    購票
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link dropdown-toggle no-caret text-white"
                    href="/shop"
                  >
                    商品
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="nav-icon-group">
            <div className="nav-icon">
              <a href="/cart" className="cart-link">
                <Image src="/cart.png" width={24} height={24} alt="cart" />
                {state.itemCount > 0 && (
                  <span className="cart-count">{state.itemCount}</span>
                )}
              </a>
            </div>
            <div className="nav-icon relative ">
              <div className="dropdown user-dropdown">
                <button
                  className="dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton2"
                  aria-expanded="false"
                  data-bs-display="static"
                >
                  <div className="flex flex-col items-center">
                    <Image src="/user.png" width={30} height={30} alt="user" />
                    {user ? <div className="">登入中</div> : null}
                  </div>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark dropdown-menu-lg-end user-menu "
                  aria-labelledby="dropdownMenuButton2"
                >
                  {user ? (
                    <>
                      <li>
                        <a className="dropdown-item" href="/orders">
                          我的訂單
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" onClick={handleLogout}>
                          登出
                        </a>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <a href="/login">登入</a>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
