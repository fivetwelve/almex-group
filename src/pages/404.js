import React from 'react';
import { Link } from 'gatsby';
import '../styles/404.scss';

import hLogo from '../../static/img/logo-almex-hori.svg';

const NotFoundPage = () => (
  <div className="not-found">
    <img className="logo" src={hLogo} alt="Almex Group" />
    <h3>Sorry, that page could not be found!</h3>

    <p>
      You may be able to find what you were looking for from the <Link to="/">homepage</Link>.
    </p>
  </div>
);

NotFoundPage.defaultProps = {};

NotFoundPage.propTypes = {};

export default NotFoundPage;
