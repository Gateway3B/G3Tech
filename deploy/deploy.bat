@echo off
set ip=192.168.87.46

docker save g3tech:latest > ./g3tech.tar

scp g3tech.tar g3tech@%ip%:\Users\g3tech\Server\G3Tech

scp docker-compose.yml g3tech@%ip%:\Users\g3tech\Server\G3Tech
scp deploy/remoteDeploy.bat g3tech@%ip%:\Users\g3tech\Server\G3Tech

ssh g3tech@%ip% \Users\g3tech\Server\G3Tech\remoteDeploy.bat