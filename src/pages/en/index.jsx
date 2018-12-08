import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

const Layout = () => (
  <div>
    Welcome to Almex Group!
    <StaticQuery
      query={graphql`
        query {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `}
      render={data => <div>{data.site.siteMetadata.title}</div>}
    />
  </div>
);

export default Layout;
