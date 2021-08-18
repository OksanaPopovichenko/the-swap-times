import React from "react";
import { Grid } from '@material-ui/core';
import './App.scss';
import Homepage from "./pages/homepage/homepage";
import { GlobalLoader } from "./components/Loader/Loader";


function App() {

	return (
		<Grid className="App">
			<GlobalLoader />
			<Homepage />
		</Grid>
	);
}

export default App;
