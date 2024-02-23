
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import cityImage from './images/city.png';
import citiesData from './citiesData.json';
import CitySummaryPopup from './CitySummaryPopup';

const API_KEY = process.env.REACT_APP_API_KEY;

function formatPopulation(population) {
    if (population >= 1000000) {
        return `${(population / 1000000).toFixed(1)} million`;
    } else {
        return new Intl.NumberFormat().format(population);
    }
}

export default function CityCards() {
    const [cityDetails, setCityDetails] = useState([]);

    useEffect(() => {
        const fetchCityDetails = async () => {
            const fetchedCities = await Promise.all(citiesData.map(async (city) => {
                // Try to get the city details from localStorage
                const cachedData = localStorage.getItem(city.id);
                if (cachedData) {
                    console.log(`Using cached data for: ${city.name}`);
                    return JSON.parse(cachedData); // returns data from localStorage
                }

                const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${city.id}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': API_KEY,
                        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
                    },
                };

                try {
                    console.log(`Fetching details for: ${city.name}`);
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }
                    const data = await response.json();
                    console.log(`Data received for ${city.name}:`, data);

                    // Stores the received data in localStorage
                    const cityDataToCache = { ...city, details: data.data };
                    localStorage.setItem(city.id, JSON.stringify(cityDataToCache));

                    return cityDataToCache;
                } catch (error) {
                    console.error('Error fetching city details:', error);
                    return { ...city, details: { name: city.name, country: 'Data not available', population: 'N/A' } };
                }
            }));

            setCityDetails(fetchedCities);
            console.log('All city details fetched:', fetchedCities);
        };

        fetchCityDetails();
    }, []);

    return (
        <Grid container spacing={2} className="gridContainer">
            {cityDetails.map((city, index) => {
                return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card className="darkCard">
                            <CardMedia
                                component="img"
                                height="140"
                                image={city.image || cityImage}
                                alt={city.name}
                            />
                            <CardContent className="cardContent">
                                <Typography gutterBottom variant="h5" component="div">
                                    {city.details ? city.details.name : city.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Country: {city.details ? city.details.country : 'N/A'}<br />
                                    Population: {city.details && city.details.population ? formatPopulation(city.details.population) : 'N/A'}<br />
                                    Region: {city.details ? city.details.region : 'N/A'}<br />
                                    Region Code: {city.details ? city.details.regionCode : 'N/A'}<br />
                                    Timezone: {city.details ? city.details.timezone : 'N/A'}<br />
                                    Latitude: {city.details ? city.details.latitude : 'N/A'}<br />
                                    Longitude: {city.details ? city.details.longitude : 'N/A'}<br />
                                    Elevation Meters: {city.details ? city.details.elevationMeters : 'N/A'}<br />

                                </Typography>
                            </CardContent>
                            <CardActions>
                                <CitySummaryPopup cityId={city.id} />
                                <Button size="small">Compare </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}
