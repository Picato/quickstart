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
   
* Install MongoDb
   ```
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
   ```
   ```
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
    ```
    
    ```
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    ```
    
    ```
    echo "mongodb-org hold" | sudo dpkg --set-selections
    echo "mongodb-org-server hold" | sudo dpkg --set-selections
    echo "mongodb-org-shell hold" | sudo dpkg --set-selections
    echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
    echo "mongodb-org-tools hold" | sudo dpkg --set-selections
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
