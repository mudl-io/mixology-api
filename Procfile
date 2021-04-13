release: python ./api/manage.py migrate
web: gunicorn --pythonpath api api.wsgi --log-file -
