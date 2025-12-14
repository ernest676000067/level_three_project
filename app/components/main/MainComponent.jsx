"use client";

import React from 'react'
import RecentResearch from './../recentResearch/RecentResearch';
import InterestedProperties from './../interest/InterestedProperties';
import OfferComponent from './../offers/OfferComponent';
import UniqueProperty from './../unique properties/UniqueProperty';
import CardMap from './../cardmap/CardMap';
import RentalCategories from './../visitareas/RentalCategories';
import ExtraSection from './../extra/ExtraSection';
import WellReviewed from './../wellreviewed/WellReviewed';
import TrendingPlaces from './../trendings/TrendingPlaces';
import ByPropertyType from './../byPropertyType/ByPropertyType';
import PerfectStay from './../perfectStay/PerfectStay';
import WeekendDeals from './../deals/WeekendDeals';
import HomeGuestLove from './../homeguestLove/HomeGuestLove';
import PromotionalBanners from './../promotionalBanners/PromotionalBanners';
import FooterComponent from './../footer/FooterComponent';



export default function MainComponent() {
  return (
    <div className='px-4 lg:px-14 my-30 '>
       <RecentResearch />
        <InterestedProperties />
        <OfferComponent />
       
        <UniqueProperty />
        <CardMap />
        
        <RentalCategories />
        <ExtraSection />
        <WellReviewed />
        <TrendingPlaces />
        <ByPropertyType />
        <PerfectStay />
        <WeekendDeals />
        <HomeGuestLove />
        <PromotionalBanners />
        <FooterComponent />
        
    </div>
  )
}
