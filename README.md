# almex-poc

This project uses Gatsby which in itself is based on React (version 16.x).

If you're reading this, you likely used Git to retrieve this. Otherwise,
install Git as well.

Before you clone the repo, ensure you have node, npm, and yarn installed.

Node uses the most recent 8.x in order to match Netlify's build version.

Once cloned, run 'yarn' and it should install all necessary dependencies.

Notes:

- linting config is set up in .eslintrc and .prettierrc
- For security, 2 dotenv files are needed to store the CMS endpoint and auth token(s) and not stored in Git:

  _.env.development_

  _.env.development_

Contents of each .env will have, for example:

    #.env.development
    GATSBY_CMS_ENDPOINT="https://cms-endpoint-here"
    GATSBY_CMS_TOKEN="token_string_here"
