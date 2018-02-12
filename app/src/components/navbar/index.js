import React from 'react';

import './navbar.scss';

export const NavBar = () => (
  <nav
    id="navbar"
    className="navbar navbar-row navbar-top navbar-inverse bg-primary"
  >
    <div className="container">
      <div className="row flex-align-center">
        <h5 className="NavBar__AppName fg-white">
          <img src="/assets/leaf-inverse.png" height="24" width="24" />
          Today
        </h5>
      </div>
    </div>
  </nav>
);

export default NavBar;
