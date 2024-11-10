set ip=10.0.0.40

docker save g3tech:latest > ./g3tech.tar

scp g3tech.tar matthewweisfeld@%ip%:~/Documents/G3Tech/Server/G3Tech

scp docker-compose.yml matthewweisfeld@%ip%:~/Documents/G3Tech/Server/G3Tech
scp .env matthewweisfeld@%ip%:~/Documents/G3Tech/Server/G3Tech
scp deploy/remoteDeploy.sh matthewweisfeld@%ip%:~/Documents/G3Tech/Server/G3Tech

ssh matthewweisfeld@%ip% chmod +x /home/matthewweisfeld/Documents/G3Tech/Server/G3Tech/remoteDeploy.sh
ssh matthewweisfeld@%ip% /home/matthewweisfeld/Documents/G3Tech/Server/G3Tech/remoteDeploy.sh
