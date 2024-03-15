import ResponsiveAppBar from "./Components/Navbar";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CssBaseline, } from '@mui/material';
import StatusBar from "./Components/Status";
import axios from "axios";
import { Link } from "react-router-dom";

const CollaborationSection = () => {
    const companies = ['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'];

    return (
        <Box sx={{ bgcolor: 'background.paper', padding: '4rem 0' }}>
            <Container minWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(0, 0, 0, 0.1) transparent',
                    }}
                >
                    {companies.map((company, index) => (

                        <CardContent>
                            <Typography variant="h6" color="textPrimary" fontWeight="bold">
                                {company}
                            </Typography>
                        </CardContent>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

const HeroSection = () => {
    return (
        <Box
            sx={{
                bgcolor: 'primary.light', // Set to the light primary color
                color: 'primary.dark', // Set to the dark primary color for text
                padding: '4rem 0',
            }}
        >
        <div className="hero-section">
            <span className="box b1"></span>
            <span className="box b2"></span>
            
            <Container maxWidth="md">

                <Typography sx={{color:"white"}} variant="h2" align="center" gutterBottom>
                    Welcome to Our Platform
                </Typography>
                <Typography sx={{color:"white"}} variant="h5" align="center" paragraph>
                    Discover upcoming contests, explore features!
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <Link to="/contests">  <Button variant="contained" color="secondary">
                            Upcoming Contests
                        </Button></Link>
                    </Grid>
                  
                </Grid>
            </Container>
            </div>
        </Box>
    );
};

const FeaturesSection = () => {
    return (
        <Box sx={{ bgcolor: 'background.paper', padding: '4rem 0' }}>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom>
                    Features
                </Typography>
                {/* Add your feature descriptions and content here */}
            </Container>
        </Box>
    );
};
const Footer = () => {
    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                padding: '2rem 0',
                marginTop: 'auto',
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    {/* Footer content remains the same */}
                </Grid>
            </Container>
        </Box>
    );
};

const HomePage = () => {
    return (
        <>
            <ResponsiveAppBar />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', marginTop: '5rem' }}>
                <CssBaseline />
                <HeroSection />
                <FeaturesSection />
                <CollaborationSection />
                <Footer />
            </div>
        </>
    );
};

export default HomePage;
