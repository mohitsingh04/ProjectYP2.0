"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchModal from "./SearchModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GetToken from "@/service/Callback/GetToken";
import { handlehide, handleLogout } from "@/service/Callback/Callback";
import API from "@/service/API/API";

interface Profile {
  avatar: any;
  username: string;
}

export default function Navbar() {
  const token = GetToken();
  const path = usePathname();
  const [openedMeun, setOpenedMeun] = useState(false);
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState<Profile | any>({});

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const response = await API.get(`/profile/detail`);
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <header
      className={`header ${openedMeun ? "menu-opened" : ""} ${handlehide(
        path
      )} `}
    >
      <div className="header-fixed">
        <nav
          className={`navbar navbar-expand-lg header-nav scroll-sticky add-header-bg`}
        >
          <div className="container">
            <div className="navbar-header">
              <button
                id="mobile_btn"
                className="btn"
                onClick={() => setOpenedMeun(!openedMeun)}
              >
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
              <Link href="/" className="navbar-brand logo">
                <img
                  src={"/Images/logo.png"}
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link href="/" className="menu-logo">
                  <img
                    src={"/Images/logo.png"}
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <button
                  id="menu_close"
                  className="menu-close btn"
                  onClick={() => setOpenedMeun(!openedMeun)}
                >
                  <FaTimes />
                </button>
              </div>
              <ul className="main-nav">
                <li className="active">
                  <Link href="/" className="submenu">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={`/properties`} className="submenu">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href={`/`} className="submenu">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={`/blog`} className="submenu">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href={`/`} className="submenu">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <ul className="nav header-navbar-rht">
              <li className="nav-item">
                <div>
                  <button
                    id="dark-mode-toggle"
                    className="dark-mode-toggle activate justify-content-center"
                    onClick={() => setShow(!show)}
                  >
                    <FaMagnifyingGlass />
                  </button>
                </div>
              </li>
              {!token ? (
                <li className="nav-item">
                  <Link className="nav-link header-sign" href="/login">
                    Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle header-sign"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        profile?.avatar?.[0]
                          ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${profile?.avatar?.[0]}`
                          : "/img/user/user16.jpg"
                      }
                      alt="User"
                      width="30"
                      height="30"
                      className="rounded-circle me-2"
                    />
                    {profile?.username}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" href="/profile">
                        My Profile
                      </Link>
                    </li>
                    {profile?.role === "Professional" && (
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/profile/professional"
                        >
                          Professional Profile
                        </Link>
                      </li>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </nav>
        <div className={`sidebar-overlay ${openedMeun ? "opened" : ""}`}></div>
      </div>
      <SearchModal show={show} setShow={setShow} />
    </header>
  );
}
