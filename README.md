This project uses Gatsby which in itself is based on React (version 16.x).

Before you clone the repo, ensure you have latest stable node, npm, and yarn installed.

Once cloned, run 'yarn' and it should install all necessary dependencies.

Notes:

- linting config is set up in .eslintrc and .prettierrc
- 2 dotenv files are needed to store the CMS endpoint and auth token(s) so for security they are not stored in Git:

    *.env.development*
    
    *.env.development*

Contents of each .env will have, for example:

    #.env.development
    CMS_ENDPOINT="https://cms-endpoint-here"
    CMS_TOKEN="token_string_here"
