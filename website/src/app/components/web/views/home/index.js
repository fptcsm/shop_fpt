import React, { Component } from 'react'
import Bannerslider from '../banner-carousel';
import Topsavers from './top-section';
import Bestofferbanner from './best-offers-banner';
import Topstample from './top-stample';

export default class Home extends Component {
    render() {
        return (
            <div className="wrapper">
                <Bannerslider />
                <Topsavers />
                <Bestofferbanner />
                {/* <Topstample /> */}
            </div>
        )
    }
}
