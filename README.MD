# 🏆Golden Raspberry Awards - API RESTful


## 📦 Introduction

The Golden Raspberry Awards (also known as the Razzies and Razzie Awards) is a parody award show honoring the worst of cinematic "failures". 


## ✒️ About

RESTful API to enable reading the list of nominees and winners of the Worst Movie category at the Golden Raspberry Awards.

Read the CSV file containing movie data and insert the information into a database upon application startup.

It should be implemented based on Richardson's maturity level 2.


## 🕸️ API Requirements:

Find the producer who has the longest interval between two consecutive awards. Find the producer who has won two awards in the shortest amount of time, using the predefined format.


## 🚀 Getting Started

The following steps are required for testing and execution of project scripts from the command line


## 📋 Prerequisites

This project requires Node v18.x (LTS) and access to the Internet to download the packages needed to run the project.


---


## 🔧 Installation

⬇️ Download Node

> Binaries, installers, and source tarballs are available at https://nodejs.org/en/download/.

🐑 Clone repository locally

```sh
$ git clone https://github.com/mcneillbr/api-golden-raspberry-awards.git
```

To install the packages to run the API use npm.

```sh
$ cd api-golden-raspberry-awards

$ cp .env.sample .env

$ npm install
```

## ⚡ Quick start


### ✨ Development

For easier developing you can launch the server with command:

```sh
$ npm run dev
```

### 🛠️ Building

To build the project use the command:

```sh
$ npm run build
```

### 🏃‍♂️ Running 

```sh
$ npm run server
```

### 🃏 Integration Tests

```sh
$ npm run test
```


---


## 📚 API Documentation


### ⚙️ Open Endpoints

######  Open endpoints require no Authentication.

---

### 🔨 Endpoints

#### Get all movie award

> Get a list of nominees and winners in the Worst Movie category of the Golden Raspberry Awards.
>
> **URL** : /get-all-movie-award
>
> **Method** : `GET`
>
> **Parameters** : None
>
> **Auth required** : NO

**Data example**

```json
[
    {
        "id": "65b064bd7f9b521259ed040f",
        "title": "Can't Stop the Music",
        "year": 1980,
        "studios": [
            "Associated Film Distribution"
        ],
        "producers": [
            "Allan Carr"
        ],
        "winner": 1
    }
]
```

### Success Response

**Code** : `200 OK`

### Sample request

```sh
$ curl --location 'http://localhost:3000/get-all-movie-award'
```


#### Get the movie award interval
> Get the producer with the longest interval between two consecutive awards, and the one who
obtained two awards faster

> **URL** : /get-movie-interval
>
> **Method** : `GET`
>
> **Parameters** : None
>
> **Auth required** : NO

**Data example**

```json
[
    {
        "min": [
            {
                "producer": "Joel Silver",
                "interval": 1,
                "previousWin": 1990,
                "followingWin": 1991
            }
        ],
        "max": [
            {
                "producer": "Bo Derek",
                "interval": 6,
                "previousWin": 1984,
                "followingWin": 1990
            },
            {
                "producer": "Buzz Feitshans",
                "interval": 9,
                "previousWin": 1985,
                "followingWin": 1994
            },
            {
                "producer": "Matthew Vaughn",
                "interval": 13,
                "previousWin": 2002,
                "followingWin": 2015
            }
        ]
    }
]
```

### Success Response

**Code** : `200 OK`

### Sample request

```sh
$ curl --location 'http://localhost:3000/get-movie-interval'
```


## 📃 License

Distributed under the MIT license

## External links

- [Wiki Golden Raspberry Awards](https://en.wikipedia.org/wiki/Golden_Raspberry_Awards)

- [Razzie Awards](https://www.razzies.com/index.html)

