python manage.py collectstatic --noinput
python manage.py migrate
gunicorn --access-logfile - --error-logfile - -w 4 -b 0.0.0.0:8000 project.wsgi:application