
<img style="margin-top: 20px;" src="./apps/relario-pay-integration/src/assets/img/logo.png" alt="Relario Pay Logo"/>

This project showcases an OTP authentication mechanism using **Relario Pay** with fallback to traditional phone number verification using Vonage.

It is built using Angular and NestJs

This project was generated using [Nx](https://nx.dev). You will need to have `nx` installed globally

`npm install -g nx`

## prerequisites 
You will need Api Key from Relario Pay dashboard.

To have the fully functional application, you will also need a vonage account to send SMS for verification fallback.

To detect the user's network and get the mccmnc, you can use an IP detection service, for example Ip2Location.

## Development server
Run `nx serve api` for api dev server. The api will run on http://localhost:3333/

Run `nx serve` for angular application. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Build
Run `nx build api` to build api server. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `ng build` to build the angular application. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
