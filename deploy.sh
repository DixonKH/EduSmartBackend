
#   PRODUCTION
git reset --hard
git checkout master
git pull origin master
git pull gitlab master

docker compose up -d