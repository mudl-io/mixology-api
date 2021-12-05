# Setting Up the Project

## Install Python

- Install python version 3.8.5
  - https://www.python.org/downloads/release/python-385/
  - Choose the "Windows x86-64 executable installer" download
  - Run the installer

## Install PostgreSQL

- Navigate to the below URL and it should automatically start downloading or ask you if you are okay to download it.
  - https://www.enterprisedb.com/postgresql-tutorial-resources-training?uuid=03b13357-9281-4985-baea-17b72a0febc3&campaignId=7012J000001F5IIQA0
- Add the below contents to the end of your `.bashrc` file

  ```
  export POSTGRESQL_USER=postgres
  export POSTGRESQL_PW=password
  export IS_LOCAL="True"
  ```

- Source the `.bashrc` file: `source ~/.bashrc`

## Create virtual environment

- In a new terminal window navigate to `~/dev`
- Create a new folder called "environments" and subfolder called "mudl" and navigate into it
  - `mkdir environments && cd environments && mkdir mudl && cd mudl`
- Run `python3 -m pip install --user virtualenv` to install the virtual environment python package
- Run `python3 -m venv ./` to create a new virtual environment in the current directory
- Create a requirements.txt file and add the below as contents

  ```
  appdirs==1.4.4
  asgiref==3.3.1
  distlib==0.3.1
  Django==3.1.5
  filelock==3.0.12
  psycopg2==2.8.6
  pytz==2020.5
  six==1.15.0
  sqlparse==0.4.1
  virtualenv==20.3.1
  virtualenvwrapper-win==1.2.6
  ```

- Run `pip install -r requirements.txt` in order to install the necessary packages

## Start the virtual environment

- Run `source bin/activate`

## Add necessary environment variables

- Reach out to me for this since I will have to give you some secret keys in order for some functionality to work.

## Clone the repository

- Navigate back to `mudl` directory
  - `cd ~/dev/mudl`
- Clone the backend api repository
  - `git clone git@github.com:oFrusch/mixology-api.git`
- Run `cd mixology-api`
- Install the necessary packages by running `pip install -r requirements.txt`

## Create and run database migrations

- Navigate to the `api` directory by running `cd api`
- Create database migrations (they should already be there, but run this just in case)
  - `python manage.py makemigrations`
- Run the database migrations in order to create the necessary tables in your DB
  - `python manage.py migrate`

## Start the backend server

- Start your database
  - `sudo service postgresql start`
- Run `python manage.py runserver`

# Useful scripts

I've created a couple of scripts locally (that maybe I should add to one of these repos) that I use to mitigate running a lot of these individual steps.

### updjango

Activates the python virtual environment and starts the django server in one command

- Navigate to `/usr/local/bin` and run `touch updjango` and then `nano updjango`
- Paste in

  ```
  #!/bin/bash

  cd ~/dev/environments/mudl/;
  source bin/activate;

  cd ~/dev/mudl/mixology-api/api;
  python manage.py runserver;
  ```

- Save the file and then exit your nano window
- You can now run `source updjango` from any directory to start your django server

### openmudlbe

This just opens up VSCode with all the files for the backend api

- Navigate to `/usr/local/bin` and run `touch openmudlbe` and then `nano openmudlbe`
- Paste in
  ```
  cd ~/dev/mudl/mixology-api/api;
  code .;
  ```
