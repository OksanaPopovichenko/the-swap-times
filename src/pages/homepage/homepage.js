import React, { useState, useEffect } from "react";
import { Grid, Typography } from '@material-ui/core';
import News from '../../components/News/News';
import TinderCard from 'react-tinder-card'
import logo from "../../images/logo.svg";
import axios from 'axios';
import { Categories, NewsSuggetions } from "./components";
import { loaderService } from "../../services";
import '../../styles/responsive.scss';

const ACCESS_KEY = '0903149d2c4fc6ac74bffc7410592d70';

const apiUrl = `https://api.mediastack.com/v1/news?access_key=${ACCESS_KEY}`;
const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

const Homepage = () => {
    const [allLiked, setAllLikedCategories] = useState([]); // with duplication
    const [likedList, setLikes] = useState([]); // without duplication

    const [allDisliked, setAllDislikedCategories] = useState([]); // with duplication
    const [dislikedList, setDislikes] = useState([]); // without duplication

    const [suggestions, setSuggestions] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        getAllNews();
    }, []);

    useEffect(() => {
        setLikes([...new Set(allLiked)]); // eliminate duplication of categories
    }, [allLiked]);

    useEffect(() => {
        checkDislikes([...new Set(allLiked)]);
        setDislikes([...new Set(allDisliked)]); // eliminate duplication of categories
        hideDislikedNews([...new Set(allDisliked)]);
    }, [allDisliked]);

    /* Get news for all available categories */
    const getAllNews = async () => {
        let categoryParams = categories.filter(function (x) {
            return allDisliked.indexOf(x) < 0;
        }).join(',-');

        let url = apiUrl + `&categories=${categoryParams}` + `&countries=us,-fr&languages=en,-fr&limit=10&offset=${randomNumber()}`;

        loaderService.setLoaderState(true);
        let result = await axios.get(url);
        setNews(result.data.data);
        loaderService.setLoaderState(false);
    }

    /* News swipe function */
    const swiped = (direction, category) => {
        if (direction == "right") {
            setAllLikedCategories(likedArr => [...likedArr, category]);
        } else {
            setAllDislikedCategories(dislikedArr => [...dislikedArr, category]);
        }
    }

    /* Get new news based on categories preferences */
    const getMainNews = async () => {
        let categoryParams = categories.filter(function (x) {
            return [...new Set(allDisliked)].indexOf(x) < 0;
        }).join(',-');

        let url = apiUrl + `&categories=${categoryParams}` + `&countries=us,-fr&languages=en,-fr&limit=10&offset=${randomNumber()}`;
        loaderService.setLoaderState(true);
        let result = await axios.get(url);
        setNews(result.data.data);
        loaderService.setLoaderState(false);
    }

    /* Get suggestions news based on categories preferences */
    const hideDislikedNews = (arr) => {
        let categoryParams = categories.filter(function (x) {
            return arr.indexOf(x) < 0;
        }).join(',-');

        getSuggestions(categoryParams);
        getMainNews();
    }

    /* Check if the category you don't like is in the like list */
    const checkDislikes = (items) => {
        likedList.some(item => {
            if (items.includes(item)) {
                likedList.splice(likedList.indexOf(item), 1);
                setAllLikedCategories(likedList);
            }
        });
    }

    /* Remove category from Liked and Disliked lists */
    const removeCategory = (category, direction) => {
        let categoryIndex;
        if (direction == "like") {
            categoryIndex = likedList.indexOf(category);
            if (categoryIndex > -1) {
                likedList.splice(categoryIndex, 1);
            }
            setAllLikedCategories(likedList);
        } else {
            categoryIndex = dislikedList.indexOf(category);
            if (categoryIndex > -1) {
                dislikedList.splice(categoryIndex, 1);
            }
            setAllDislikedCategories(dislikedList);
        }
    }

    /* Generate a random number for an offset for an API call */
    const randomNumber = () => {
        return Math.round(Math.random() * (100 - 1) + 1);
    }

    /* Get news suggetions */
    const getSuggestions = async (categories) => {
        const url = apiUrl + `&categories=${categories}` + `&countries=us,-fr&languages=en,-fr&limit=10&offset=${randomNumber()}`;
        loaderService.setLoaderState(true);
        let result = await axios.get(url);
        setSuggestions(result.data.data);
        loaderService.setLoaderState(false);
    }

    /* On Swipe news get relevant news */
    const getRelevant = async (id) => {
        let categoryName = suggestions[id].category;

        const url = apiUrl + `&categories=${categoryName}&countries=us,-fr&languages=en,-fr&limit=1&offset=${randomNumber()}`;
        loaderService.setLoaderState(true);
        let newItem = await axios.get(url);
        suggestions[id] = newItem.data.data[0];
        setSuggestions(suggestions);
        loaderService.setLoaderState(false);

        return suggestions;
    }

    return (
        <Grid>
            <Grid className="main-block"
                container
                alignItems="center"
                direction="column">
                <img src={logo} alt="logo" className="logo" />
                <Grid className="news-block container"
                    container
                    alignItems='stretch'
                    justifyContent="space-between">
                    <Grid className="categories-wrap swipe-left">
                        <Typography variant="h5">Swipe Left</Typography>
                        <Typography variant="body1" className="text">if you are not interested in this news</Typography>
                        <Typography variant="h6">You don’t like</Typography>

                        <Categories data={{
                            list: dislikedList,
                            color: 'red'
                        }}
                        removeCategory={removeCategory} />
                    </Grid>

                    <Grid className="swapper">
                        {news.map((item, id) =>
                            <TinderCard
                                className='swipe'
                                key={id}
                                preventSwipe={["up", "down"]}
                                onSwipe={(dir) => swiped(dir, item.category)}>
                                <News size="big" news={item} />
                            </TinderCard>
                        )}
                    </Grid>

                    <Grid className="categories-wrap swipe-right">
                        <Typography variant="h5">Swipe Right</Typography>
                        <Typography variant="body1" className="text">if you are interested in this news</Typography>
                        <Typography variant="h6">You like</Typography>

                        <Categories data={{
                            list: likedList,
                            color: 'green'
                        }}
                            removeCategory={removeCategory} />
                    </Grid>
                </Grid>
            </Grid>


            <Grid className="suggestions-block">
                <Grid className="container">
                    <Typography variant="h6">News suggestions</Typography>
                    <Typography variant="body1" className="text">Based on what you like</Typography>
                </Grid>


                <NewsSuggetions data={{
                    size: "small",
                    news: suggestions
                }}
                getRelevant={getRelevant} />
            </Grid>
        </Grid>
    );
};

export default Homepage;