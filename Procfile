release: python ./backend/api/manage.py migrate
web: gunicorn --pythonpath backend/api api.wsgi --log-file -
