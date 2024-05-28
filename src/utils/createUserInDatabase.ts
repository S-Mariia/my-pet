import {child, get, getDatabase, ref, set} from "@firebase/database";
import {showErrorToast} from "@/utils/tostify";

//@ts-ignore
export const handleCreateUserCard=(user)=>{
    const db = getDatabase();
    set(ref(db, 'users/' + user.uid), {
        username: user.displayName,
        email: user.email,
        profile_picture : user.photoURL,
    });
}
//@ts-ignore
export const getPetList=(user, setFunc)=>{
    const db = getDatabase();
    const dbRef = ref(db);
    if(user?.uid){
        get(child(dbRef, 'users/' + user?.uid + '/pets')).then((snapshot) => {

            if (snapshot.exists()) {
                setFunc(Object.values(snapshot.val()))
            } else {
                console.log("No data available");
                return []
            }
        }).catch((error) => {
            console.error(error);
            showErrorToast(error.message)
        })
    }else return[]
}

//@ts-ignore
export const getPet = (user, id, setFunc) => {
    const db = getDatabase();
    const dbRef = ref(db);
    if (user?.uid) {
        get(child(dbRef, 'users/' + user?.uid + '/pets/' + id)).then((snapshot) => {
            if (snapshot.exists()) {
                setFunc(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}