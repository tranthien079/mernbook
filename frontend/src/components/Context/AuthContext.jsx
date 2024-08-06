import React, { createContext, useState } from 'react'

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        _id: "",
        email: "",
        user_name: "",
        role: "",
        avatar: ""

    },
     appLoading: true
})
export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            _id: "",
            email: "",
            user_name: "",
            role: "",
            avatar: ""

        } 
    });
    const [appLoading, setAppLoading] = useState(true);
    return (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    )
}