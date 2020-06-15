# todo-list
## Preview
See it [here](https://todo-fd9db.web.app)!

## .env (Create it and paste there your firebase config data)
```
VUE_APP_apiKey=
VUE_APP_authDomain=
VUE_APP_databaseURL=
VUE_APP_projectId=
VUE_APP_storageBucket=
VUE_APP_messagingSenderId=
VUE_APP_appId=
VUE_APP_measurementId=
```

## Firestore rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // This rule allows anyone on the internet to view, edit, and delete
    // all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // your app will lose access to your Firestore database
    match /todo/{document=**} {
     	allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
