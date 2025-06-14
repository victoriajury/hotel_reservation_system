# Hotel Reservation System - Version 2.0.0

This project stems from work I did as part of my Open University TM470 Final IT Project.

It is a full-stack application using the Flask framework for the REST API backend and React frontend for the user admin panel and booking pages.

## Changes from Version 1.0.0

- ### Flask REST API

    The Flask application now serves the reservation system data to the React frontend via a REST API instead of populating Jinga2 html templates.

  - [Flask-RESTful](https://flask-restful.readthedocs.io/en/latest/)

- ### SQLAlchemy

    The database connection is now handled with SQLAlchemy, instead of directly with the SQLite database.

  - [Flask-SQLAlchemy](https://flask-sqlalchemy.readthedocs.io/en/stable/)

- ### React

    The frontend is built with a React app which consumes the data from the Flask API.

- ### Frontend component library

    I had used a Bootstrap/jQuery dashboard template (<https://adminlte.io/>) to style the frontend, but I am considering using the Material UI React library (<https://mui.com/>) instead.

  - [Joy UI Installation Guide](https://v6.mui.com/joy-ui/getting-started/installation/)

## Setup environment

This project was developed using Linux. Commands for running in a Windows enviroment will be a little different. I will put instructions here later.

### Python Dependencies

- Python 3.11+
- pip
- pipenv

### Check Python version

``` bash
$ python --version
Python 3.12.3
```

### React Dependencies

- Node v22+
- npm v10+

## Installing the Python Flask Server

### Install pip

<https://packaging.python.org/en/latest/guides/installing-using-linux-tools/>

``` bash
$ sudo dnf install python3-pip python3-wheel

$ pip --version
pip 22.2.2
```

#### Install pipenv

<https://pipenv.pypa.io/en/latest/index.html>

``` bash
$ pip install pipenv --user

$ pipenv --version
pipenv, version 2023.12.1
```

Create and activate the virtual environment and spawn a shell within it

``` bash
pipenv shell
```

Install packages and dev dependencies from the `Pipfile` with:

``` bash
pipenv install --dev
```

## Installing the React client

### Install Node and npm

I have used the nvm version manager to install Node and npm.

Install nvm, with:

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

Install the current stable LTS release of Node.js (recommended for production applications):

``` bash
nvm install --lts
```

Check installation is successful with:

``` bash
$ node --version
v22.15.0
$ npm --version
10.9.2
```

## Run the application

### Initialise database

The application can be initialised with dummy data by running the following command:

``` bash
flask --app server/app.py init-db
```

**TODO**: set up this command to accept other sql database files to initialised the application.

### Run backend app with debugger

``` bash
flask --app server/app run --debug
```

###

If flask runs successfully, you should see:

``` bash
* Running on http://127.0.0.1:5000
```

### Run the React frontend

Run the following to start the React frontend:

``` bash
  cd react_client
  npm run dev
```

If running successfully, you should be able to open the link in your browser:

```bash
  VITE v6.3.5  ready in 211 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Log in to the system as username 'admin' with password 'dev'.

### Running the tests

#### Coverage with Pytest

``` bash
coverage run -m pytest
```

#### View report in terminal

``` bash
coverage report
```

#### Generate reports

This then works with Coverage Gutters VS Code extension to view coverage in module's python files.

``` bash
coverage xml
```

## TODO / Features

- ### Business set-up

  - [ ] Add users
  - [ ] Set user permissions

- ### Dashboard

  - [ ] Notifications
  - [ ] Arrivals
  - [ ] Departures
  - [ ] Stays
  - [ ] New Bookings
  - [ ] Cancellations
  - [ ] Revenue overview & Comparison
  - [ ] Search

- ### Rooms & Rates

  - [ ] Unit types
  - [ ] Amenities
  - [ ] Rates and prices
  - [ ] Rate restrictions (min. stays etc)
  - [ ] Special offers
  - [ ] Discounts/Voucher codes
  - [ ] Image / Video galleries

- ### Bookings

  - [ ] Special request / Notes
  - [ ] Colour coded flags
  - [ ] Track history

- ### Booking management

  - [ ] Calendar view
  - [ ] Modify & cancel bookings
  - [ ] Block rooms
  - [ ] Group bookings
  - [ ] Store guest information
  - [ ] Housekeeping
  - [ ] Statistics & trends reports

- ### Customer communication

  - [ ] Booking page
  - [ ] Website booking and availability widgets
  - [ ] Confirmation emails
  - [ ] Reminders
  - [ ] Newsletter
  - [ ] Reviews

- ### Payments

  - [ ] Invoicing
  - [ ] Extra sale items
  - [ ] Integrate with 3rd-party payment gateways
  - [ ] Accounting reports

- ### Python API

  - [x] Refactor row query functions
  - [ ] Would type hints help?
  - [ ] Write tests
