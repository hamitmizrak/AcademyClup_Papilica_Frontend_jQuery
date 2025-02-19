# Papilica - Academy Clup  Web 
[GitHub Link](https://github.com/hamitmizrak/AcademyClup_Papilica_Frontend_jQuery.git)
---

> npm run dev:start

## Persist Url
```sh
http://localhost:3000
http://localhost:8888
```
---


## Git Teminal Codes
```sh
git init
git add .
git commit -m "frontend init"
git remote add origin GIT_HUB_URL
git branch
git push -u origin master

git clone https://github.com/hamitmizrak/AcademyClup_Papilica_Frontend_jQuery.git
```
---

## Create Project
```sh
mkdir todo-app && cd todo-app
```
---

## package.json
```sh
npm init -y
veya
npm init 
```
---

## Best Practice
```sh
NOT 1: npm install yaparken mutlaka proje kapalı olsun
```
---

## Npm
```sh
npm install --save json-server
npm install --save json-server jquery typescript
npm install -g json-server jquery typescript
npm install --save-dev live-server  #1.YOL
npm install --save-dev http-server  #2.YOL
npm install --save-dev typescript@5.4.3  @types/jquery@3.5.32 
npm install --save-dev @babel/core @babel/cli @babel/preset-env
@babel/core → Babel’in çekirdeğidir.
@babel/cli → Komut satırından Babel kullanmanıza olanak tanır.
@babel/preset-env → ES6+ kodlarını ES5'e çevirir.
```
---

## Version
```sh
git -v
node -v
npm -v
tsc -v VEYA npx tsc --version

```
---

## Npm node_modules cache deleted
```sh
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

npm uninstall @types/jquery
npm install --save-dev @types/jquery
```
---

## package.json Script
```sh
  "scripts": {
    "build": "tsc && babel dist/src --out-dir dist/es5 --presets=@babel/preset-env",
    "start": "node dist/es5/index.js",
    "dev": "tsc --watch",
    "babel:watch": "babel dist/src --out-dir dist/es5 --presets=@babel/preset-env --watch",
    "json-server": "json-server --watch db.json --port 3000",
    "start-server": "live-server --port=8888 --no-browser --open=index.html",
    "dev:start": "concurrently \"tsc --watch\" \"babel dist/src --out-dir dist/es5 --presets=@babel/preset-env --watch\" \"json-server --watch db.json --port 3000\" \"npm run start-server\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```
---

## dependency and dev-dependency
```sh
"dependencies": {
    "jquery": "^3.7.1",
    "json-server": "^1.0.0-beta.3",
    "typescript": "^5.7.3"
  },
  "devDependencies": {
    "@babel/cli": "^7.26.4",
    "@babel/core": "^7.26.9",
    "@babel/preset-env": "^7.26.9",
    "@types/jquery": "^3.5.32",
    "concurrently": "^7.6.0",
    "live-server": "^1.2.2",
    "typescript": "^5.4.3"
  }
```
---

## tsc
```sh
npx tsc --version
npx tsc --init
```
---

## tsconfig.json
```sh
{
  "compilerOptions": {
    "lib": ["ES6", "DOM"],
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "./",
    "strict": true,
    "skipLibCheck": false,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```
---


## Git
```sh

```
---


## Git
```sh

```
---

## Git
```sh

```
---


## Git
```sh

```
---



