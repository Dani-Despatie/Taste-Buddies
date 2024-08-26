import {createContext} from "react";
import {useState, useEffect} from "react";

export const LoggedInUserContext = createContext();

const LoggedInUserProvider = ({children}) => {

    const [loggedInUser, setLoggedInUser] = useState(null);

    const login = async (email, password) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-type", "application/json");

        try {
            const res = await fetch("/login", {
                method: "PATCH",
                body: JSON.stringify({ email, password }),
                headers: myHeaders
            });

            if (res.status === 200) {
                const user = await res.json();
                setLoggedInUser(user.data);
            }
            return res.status;            
        } catch (err) {
            console.log(err);
        } 
    }

    const logout = () => {
        console.log(loggedInUser);
        setLoggedInUser(null);
    }

    return (
        <LoggedInUserContext.Provider value={{ loggedInUser, login, logout }} >
            {children}
        </LoggedInUserContext.Provider>
    )

};

export default LoggedInUserProvider;