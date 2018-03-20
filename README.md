# hinos-services
Project include all microservice (oauth, files, mail, log...)

# Setup
Set ```NODE_ENV=production``` when run production

# Pre-Installation
* Install concurrently, tsc, rimraf
    ```
    npm install -g concurrently typescript rimraf
    ```

* Install Redis server
   ```
   sudo apt install redis-server
   ```

# Installation
* Run all (clone, install, build)
    ```sh
    npm run all
    ```
* Run each period
    1. Clone microservice from git
        ```sh
        npm run clone
        ```
    2. Install lib in microservice
        ```sh
        npm install
        ```
    3. Build source
        ```sh
        npm run build
        ```
* Start all services
    ```sh
    npm start
    ```
* Start all services on PM2
    ```sh
    npm run pm2
    ```
* Start web dashboard to manage service
    ```sh
    npm run start:web
    ```
# Configuration
File config at config.cfg for all microservices
