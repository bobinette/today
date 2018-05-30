import React from 'react';

import './navbar.scss';

export const NavBar = () => (
  <nav className="navbar navbar-row navbar-top navbar-inverse bg-primary TodayNavbar">
    <div className="container">
      <div className="row w-100 flex flex-align-items-center flex-space-between">
        <h5 className="NavBar__AppName fg-white">
          <img
            className="TodayLogo"
            src="/assets/leaf-inverse.png"
            alt=""
            height="24"
            width="24"
          />
          Today
        </h5>
        <div className="GithubLogo">
          <a
            className="GithubLink"
            href="https://github.com/bobinette/today"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github" />
          </a>
        </div>
      </div>
    </div>
  </nav>
);

export default NavBar;
