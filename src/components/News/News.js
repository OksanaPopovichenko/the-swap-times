import React, { useState, useEffect } from "react";
import { Grid, Typography } from '@material-ui/core';
import swap from '../../images/icons/swap.svg';
import './News.scss';
import ReactCardFlip from 'react-card-flip';

const News = (props) => {
    const [isFlipped, setFlipped] = useState(false);
    const [list, setList] = useState([]);

    const { news, getRelevant, id, size } = props;
    
    useEffect(() => {
        setList(news);
    }, [news]);

    const handleClick = async () => {
        setFlipped(!isFlipped);
        let newArr = await getRelevant(id);
        setList(newArr[id]);
    }

    return (
        <Grid container
            direction="column"
            className={`news-${size}`}
            wrap="nowrap"
            justifyContent="center">
            <ReactCardFlip isFlipped={isFlipped} infinite={true}>
                <Card news={list} size={size} />
                <Card news={list} size={size} />
            </ReactCardFlip>

            {size !== "big" ?
                <Grid className="swap-block"
                    container
                    justifyContent="center"
                    alignItems="center"
                    onClick={handleClick}>
                    <img src={swap} alt="swap" className="swap-icon" />
                    <Typography variant="body1">Swap news</Typography>
                </Grid>
                : null}
        </Grid>
    );
};
export default News;

function Card(props) {
    const { news, size } = props;

    return (
        <Grid container
            direction="column"
            className={`news news-${size}`}
            justifyContent="flex-end"
            style={{ backgroundImage: news.image ? `url(${news.image})` : 'url(https://ik.imagekit.io/7xe1jiffo71/no-image_xp4URuufd.png?updatedAt=1628851158021)' }}>

            <Grid className="content-wrap">
                <Typography variant="h6" align="left" className="title">
                    {news.title}
                </Typography>
                <Typography variant="body1" align="left" className="description">
                    {news.description}
                </Typography>
            </Grid>
        </Grid>
    );
}
