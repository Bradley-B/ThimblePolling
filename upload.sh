rm client/build.zip
cd client
zip -r build.zip build
cd ..
scp -i ~/.ssh/id_rsa_webserver.pub server/server.js server/tools.js server/database.js client/build.zip bradxdut@webserver:/home/bradxdut/bettervoting
ssh bradxdut@webserver 'cd /home/bradxdut/bettervoting; rm -r build; unzip build.zip'
