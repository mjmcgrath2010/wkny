# Build Process

## Installation

```
npm install
```

## Simple Build Process

for development
```
npm run dev
```

for production
```
npm run prod
```

## Advanced Build Process

create a copy of the file 'wkny-sample.env', name the file 'wkny.env' and edit the variables
```
ENV=prod
BUILD_PATH=./rollout/
WATCH=true
SOURCEMAPS=false
UGLIFY=true
```

then run
```
npm run build
```