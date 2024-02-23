# City Data Summarization Project

## Overview

  

The City Data Summarization project aims to present summarized information about ten selected cities in the United States on a dedicated web page. It leverages publicly available databases along with an AI tool to generate concise summaries of each city, including details such as population, area, and top attractions

## Objective

  

To create a user-friendly web interface that displays essential information about each city, making it easy for users to learn about different locations in the United States.

  

## Features

  

- A simple, responsive web page template for city data display.

- Summarized data for 10 cities in the United States.

- Use of GeoDB Cities API for fetching city data.

- Integration of an AI tool (ChatGPT API) for data summarization.

- Caching mechanism to improve API data fetching performance.

  

## Prerequisites

  

- Node.js and npm (Node Package Manager)

- React.js

- A valid API key for GeoDB Cities API and OpenAI API

  

## Setup and Installation

  

Clone the Repository:

  

git clone https://github.com/yourrepository/city-data-summarization.git

cd city-data-summarization

  

Install Dependencies:

    npm install

  
Set Up Environment Variables:

- Create a .env file in the root directory.

- Add your GeoDB Cities and OpenAI API keys:

> REACT_APP_API_KEY=your_geo_db_api_key_here
> REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

Run the Application:

    npm start

The app will be available at http://localhost:3000.

  

### Usage
Navigate through the web application to explore data about different cities.

 - Click on the "Summarize with AI" button to view a summarized
   description and top attractions for each city, using openAI API 
 - Use the "Compare" button to compare data between cities.
