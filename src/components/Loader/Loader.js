import React, { useEffect, useState } from "react";
import { loaderService } from "../../services";
import './Loader.scss';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const GlobalLoader = () => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
       const sub$ = loaderService.loaderState$.subscribe(state => {
            setShowLoader(state);
        });
            
        return () => {
            sub$ && sub$.unsubscribe();
        }
    });

    return (
        <div>
            {
                showLoader && <div className="loader">
                    <Loader
                        type="Oval"
                        color="#1976d2"
                        height={100}
                        width={100}
                    />
                </div>
            }
        </div>
    )
}
