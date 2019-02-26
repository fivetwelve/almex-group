import React from 'react';

const LocationContext = React.createContext({});

export const LocationProvider = LocationContext.Provider;
export const LocationConsumer = LocationContext.Consumer;
