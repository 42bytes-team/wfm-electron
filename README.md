# WFM Electron (Demo)

This is a simple Electron app that uses the [WFM](https;//warframe.market) OAuth2 flow to authenticate with the **WFM API v2**

**Disclaimer**  
I have no idea how to properly write Electron app, built this within a few hours, so don't expect anything fancy.  
Feel free to send PR and fix whatever you want.  
[Contribute](#contributing)

> :warning: This app was tested only on Archlinux, so I don't know if it works on other OSes.

## Knowledge requirements

Basic knowledge of:

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/) 
- [Typescript](https://www.typescriptlang.org/)  
  
To understand auth flow, read about [OAuth2 with PKCE](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-proof-key-for-code-exchange-pkce)

I purposefully didn't use any state management library, because I don't want to overcomplicate things.  
But maybe we would add it in the future to make code more clean and better structured.

## Running

To build and run Electron app, i am using [Electron Forge](https://www.electronforge.io/)

Setup:

```bash
yarn install
```

Then run the app in dev mode:

```bash
yarn start
```

If you need to debug something, use launch configs for Vscode.

## Build and install

To build the app, use

```bash
yarn make && yarn package
```

To install into **Archlinux** system:

1. Copy built deb pkg from `./out/make/deb/x64/wfm-app_0.0.X_amd64.deb` into `./aur/`
2. Edit `./aur/PKGBUILD` and change `pkgver` to the current version
3. Lunch `makepkg` in `./aur/` folder
4. If everything is okay, install it with `makepkg -i`

## Contributing

Pull requests are welcome.  
For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
