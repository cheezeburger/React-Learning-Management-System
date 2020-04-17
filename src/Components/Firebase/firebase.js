import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/storage';
import { Alert } from "rsuite";

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID
};

class Firebase {
	constructor() {
		app.initializeApp(config);
		this.auth = app.auth();
		this.db = app.database();
		this.storage = app.storage();
	}

	doCreateUserWithEmailAndPassword = (email, password) => {
		return this.auth.createUserWithEmailAndPassword(email, password);
	};
	doSignInWithEmailAndPassword = (email, password) => {
		return this.auth.signInWithEmailAndPassword(email, password);
	};

	doSignOut = () => {
		this.auth.signOut();
		Alert.success('Successfully signed out...')
	};

	doPasswordReset = email => {
		return this.auth.sendPasswordResetEmail(email);
	};

	doPasswordUpdate = password => {
		return this.auth.currentUser.updatePassword(password);
	};

	user = uid => this.db.ref(`users/${uid}`);
	users = () => this.db.ref("users");

	course = cid => this.db.ref(`courses/${cid}`);
	courses = () => this.db.ref("courses");
	courseCurriculums = cid => this.db.ref(`courses/${cid}/curriculum`);

	assignments = cid => this.db.ref(`courses/${cid}/assignments`)
	// Database ref
	assignmentRef = () => this.storage.ref().child('assignments');
	
	onAuthUserListener = (next, fallback) =>{
		this.auth.onAuthStateChanged(authUser => {
			if (authUser) {
				this.user(authUser.uid).on('value', snapshot => {
					const dbUser = snapshot.val();
					if (dbUser) {
						if (!dbUser.roles) {
							dbUser.roles = {};
						}

						authUser = {
							uid: authUser.uid,
							email: authUser.email,
							...dbUser
						};

						next(authUser);
					} 
				});
			}
			else {
				fallback();
			}
		});
	}
	
	onAuthCourseListener = (next, fallback) => {
		this.auth.onAuthStateChanged(() => {
			this.courses().on("value", (snapshot, prevChildKey) => {
				const coursesObject = snapshot.val();

				if(coursesObject){
                    const coursesList = Object.keys(coursesObject).map(key => ({
                        ...coursesObject[key],
                        uid: key,
                    }));
					next(coursesList);
				}
				else{
					fallback();
				}
			});
		});
	};
}

export default Firebase;
