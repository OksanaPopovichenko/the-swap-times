import React, { useState, useEffect } from "react";
import { Grid } from '@material-ui/core';
import Category from '../../components/Category/Category';
import News from '../../components/News/News';

export const Categories = (props) => {
    const [ categoriesList, setList ] = useState([]);
    const { list, color } = props.data;

    useEffect(() => {
        setList(list);
    }, [list])

    return (
        <Grid className="categories">
            {categoriesList.map((item, id) => {
                return (
                    <Category key={id} color={color} data={item} removeCategory={props.removeCategory} />
                )
            })}
        </Grid>

    )
}

export const NewsSuggetions = (props) => {
    const [newsList, setNewsList] = useState([]);
    const { news, size } = props.data;

    useEffect(() => {
        setNewsList(news);
    }, [news])

    return (
        <Grid className="wrapper"
            container
            direction="row"
            wrap="nowrap">
            {newsList.map((item, id) => {
                return <News key={id}
                    size={size}
                    news={item}
                    id={id}
                    getRelevant={props.getRelevant}
                />
            })}
        </Grid>

    )
}
