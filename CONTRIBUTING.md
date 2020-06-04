Contributing
================================================================================




Set up environment
--------------------------------------------------------------------------------

1. Install [node](http://nodejs.org)
2. Install [yarn](http://yarnpkg.com)
3. (optional) install [VSCode](https://code.visualstudio.com/Download) to get recommended extensions.
4. Prepare repository
    ```sh
    git clone https://gitlab.com/space-engineers-community/sepraisal.git
    cd sepraisal
    yarn bootstrap
    cp .env.example .env
    ```
5. Edit `.env` file (comments inside)
6. Read further any of READMEs of specific module
    - `app` is the web application. You most likely want to start here.
    - `storybook` are the stories of app. This is the easiest thing to get up and running.
    - `cli` are the scripts to do the backend thing: fetch and praise blueprints, update database.
    - `praisal` is where all the praisal logic lives. Feel free to use in your own projects.
    - `common` defines data model and blueprint classes that's used everywhere.


*Note:* As I'm developing on Linux machine only, I may have forgotten some cross-compatibility and it may not work out as smooth for Windows users. In that case, just open a issue or even better add PR if you know how to fix that.
