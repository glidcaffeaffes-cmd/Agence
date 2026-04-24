import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCUaicexGRjgBftHdU69pcgvoCKn9ePnXM",
    authDomain: "agence-2a560.firebaseapp.com",
    projectId: "agence-2a560",
    storageBucket: "agence-2a560.firebasestorage.app",
    messagingSenderId: "502442263010",
    appId: "1:502442263010:web:58cb205bf2ef26dd2f79bb"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Provide to the app context
  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth
    }
  }
});
