import React from 'react';
import { Link } from 'react-router';

import '../../../styles/reset.css';
import '../../../styles/global.css';
import './Root.css';

const Root = ({ children }) => (
  <div className="Root">
    <nav>
      <ul className="Root_NavList">
        <li className="Root_NavItem">
          <Link className="Root_NavLink" to="/">Home</Link>
        </li>
        <li>
          <Link className="Root_NavLink" to="/signup">Signup</Link>
        </li>
      </ul>
    </nav>
    {children}
  </div>
);

Root.propTypes = {
  children: React.PropTypes.node,
};

export default Root;
