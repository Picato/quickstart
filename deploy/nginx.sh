sudo mkdir /etc/nginx/conf.d/micro-service/
sudo cp -R ./nginx/* /etc/nginx/conf.d/
sudo cp -R ../api-gateway/deploy/nginx/* /etc/nginx/conf.d/micro-service/
sudo cp -R ../api-monitor/deploy/nginx/* /etc/nginx/conf.d/micro-service/
sudo cp -R ../auto-script/deploy/nginx/* /etc/nginx/conf.d/micro-service/
sudo cp -R ../files/deploy/nginx/* /etc/nginx/conf.d/micro-service/
sudo cp -R ../mail/deploy/nginx/* /etc/nginx/conf.d/micro-service/
sudo cp -R ../log/deploy/nginx/* /etc/nginx/conf.d/micro-service/
sudo cp -R ../oauth/deploy/nginx/* /etc/nginx/conf.d/micro-service/