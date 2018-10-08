# Fuel trip calculator
=================================

FullStack Web app based on NodeJS and (M)EAN Stack (not using databases). 
This app uses external APIs in order to work such as <a href="https://www.fueleconomy.gov/ws/">FuelEconomy XML API</a>, <a href="https://www.fuelapi.com/">FuelAPI</a>, and GoogleMaps API (You will be required to place your own API Key on the config.json over /src/app/).

This app calculates distance between two points (origin and destination) and gets the fuel economy average of the specific car given by the user from the FuelEconomy API. 

### Getting up and running
=================================

As easy as following this steps:
Clonning from github:
```
git clone https://github.com/wasmake/fuel-trip-calculator-nolte
```

You can also <a href="https://github.com/wasmake/fuel-trip-calculator-nolte/archive/master.zip">download</a> this as a zip.

Then you will like to open the root directory of the project and run:
```
npm install
npm start
```

or if you want to run it as developer mode "node run dev".

