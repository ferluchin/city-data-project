
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
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        const fetchCityDetails = async () => {
            let fetchedCities = [...cityDetails];

            for (const city of citiesData) {
                let delayNeeded = false; // Indica si es necesario aplicar el delay
                let cityDataToCache = {
                    ...city,
                    details: {
                        name: city.name,
                        country: 'Data not available',
                        population: 'N/A',
                        image: city.image 
                    }
                };

                const cachedData = localStorage.getItem(city.id);
                if (cachedData) {
                    console.log(`Using cached data for: ${city.name}`);
                    cityDataToCache = JSON.parse(cachedData);
                } else {
                    delayNeeded = true; // Solo se necesita el delay si se va a hacer fetch de nuevos datos
                    setLoadingMessage(`Getting data from Geo Cities API for ${city.name}...`);
                    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${city.id}`;
                    const options = {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': API_KEY,
                            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
                        },
                    };

                    try {
                        const response = await fetch(url, options);
                        if (!response.ok) {
                            throw new Error(`API request failed with status ${response.status}`);
                        }
                        const data = await response.json();
                        console.log(`Data received for ${city.name}:`, data);

                        cityDataToCache.details = data.data;
                        localStorage.setItem(city.id, JSON.stringify(cityDataToCache));
                    } catch (error) {
                        console.error('Error fetching city details:', error);
                    }
                }
                fetchedCities.push(cityDataToCache);
                //setCityDetails(fetchedCities);
                setCityDetails(prevCities => [...prevCities, cityDataToCache]);
                if (delayNeeded) await new Promise(resolve => setTimeout(resolve, 500)); // Aplica el delay solo si es necesario
            }

            setLoadingMessage('');
        };

        fetchCityDetails();
    }, []);

    if (loadingMessage) {
        return <div>{loadingMessage}</div>;
    }

    return (
        <Grid container spacing={2} className="gridContainer">
            {cityDetails.map((city, index) => {

                const cityImageSrc = city.details && city.image ? require(`./${city.image}`) : cityImage;
                //const cityImageSrc = city.details && city.image ? city.image : cityImage;
                //const cityImageSrc = city.details?.image ?? cityImage;

                return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card className="darkCard">
                            <CardMedia
                                component="img"
                                height="140"
                                image={cityImageSrc}
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
