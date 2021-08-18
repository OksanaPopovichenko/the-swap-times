import React, { useState, useEffect } from "react";
import { Grid, Typography } from '@material-ui/core';
import cross from '../../images/icons/cross.svg';
import './Category.scss';

const Category = (props) => {
    const { color, data, removeCategory } = props;

    const deleteItem = (item) => {
        if(color == "green") {
            removeCategory(item, "like");
        } else {
            removeCategory(item, "dislike");
        }
    }

    return (
        <Grid container
            className={`category category-${color}`}
            direction="row"
            justify="space-between"
            wrap="nowrap">
            <Typography variant="body1" className="category-name">{data}</Typography>
            <img src={cross} alt="cross" onClick={() => deleteItem(data)}/>
        </Grid>
    );
};

export default Category;