cd oauth
nohup node ../oauth > log.txt &
cd ../files
nohup node ../files > log.txt &
cd ../mail
nohup node ../mail > log.txt &
cd ../log
nohup node ../log > log.txt &
cd ../dynamic
nohup node ../dynamic > log.txt &
cd ../auto-script
nohup node ../auto-script > log.txt &
cd ../api-monitor
nohup node ../api-monitor > log.txt &

