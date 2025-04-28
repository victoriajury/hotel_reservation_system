# Hotel Reservation System - Version 2.0.0

This project stems from work I did as part of my Open University TM470 Final IT Project.

It is a full-stack application using the Flask framework for the REST API backend and React frontend for the user admin panel and booking pages.

## Changes from Version 1.0.0

- ### Flask REST API

    The Flask application now serves the reservation system data to the React frontend via a REST API instead of populating Jinga2 html templates.

- ### SQLAlchemy

    The database connection is now handled with SQLAlchemy, instead of directly with the SQLite database.

- ### React

    The frontend is built with a React app which consumes the data from the Flask API.

- ### Frontend component library

    I had used a Bootstrap/jQuery dashboard template (https://adminlte.io/) to style the frontend, but I am considering using the Material UI React library (https://mui.com/) instead.

## Setup environment

This project was developed using Linux. Commands for running in a Windows enviroment will be a little different. I will put instructions here later.

### Dependencies:
- Python 3.11+
- pip
- pipenv


### Check Python version
```
$ python --version
Python 3.12.3
```

### Install pip 
https://packaging.python.org/en/latest/guides/installing-using-linux-tools/

```
$ sudo dnf install python3-pip python3-wheel

$ pip --version
pip 22.2.2
```

#### Install pipenv 
https://pipenv.pypa.io/en/latest/index.html

```
$ pip install pipenv --user

$ pipenv --version
pipenv, version 2023.12.1
```

Create and activate the virtual environment and spawn a shell within it
```
pipenv shell
```
Install packages
```
pipenv install [OPTIONS] [PACKAGES]...
```

## Steps for creating the initial Flask application

### Install Flask
```
$ pipenv install Flask
```
#### Developing a hotel reservation application

The application builds upon steps from tutorial https://flask.palletsprojects.com/en/3.0.x/tutorial/


## Run the application

### Initialise database
```
$ flask --app reservation_system init-db
$ flask --app reservation_system dummy-data
```
### Run backend app with debugger
```
$ flask --app reservation_system run --debug
```
###
If flask runs successfully, you should be able to click the link in terminal:

```
* Running on http://127.0.0.1:5000
```

Log in to the system as username 'admin' with password 'dev'.


### Run the tests

#### Coverage with Pytest
```
$ coverage run -m pytest
```
#### View report in terminal
```
$ coverage report
```
#### Generate reports

This then works with Coverage Gutters VS Code extension to view coverage in module's python files.
```
$ coverage xml
```

## Styles

Admin dashboard views are styled with AdminLTE (https://adminlte.io/)

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
        
- ### Code
    - [x] Refactor row query functions
    - [ ] Would type hints help?
    - [ ] Write tests
