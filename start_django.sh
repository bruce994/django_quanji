#!/bin/bash
docker rm django-test --force
cd /home2/ryynet_docker/www/django.yy.lanrenmb.com
#docker run --name django-test -v "$PWD":/usr/src/app -w /usr/src/app -p 8000:8000 -d django bash -c "pip install -r requirements.txt && python manage.py runserver 0.0.0.0:8000" --link mysql:mysql
docker run --name django-test -v "$PWD":/usr/src/app -w /usr/src/app -p 8000:8000 -d dd80ff3585ea  bash -c "python manage.py runserver 0.0.0.0:8000" --link mysql:mysql
