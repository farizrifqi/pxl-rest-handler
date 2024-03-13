"use client"
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const AppContext = createContext();

export default function SocketContextProvider({ children }) {
    const [bots, setBots] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null)
    const [monitorLogs, setMonitorLogs] = useState([]);
    const [isLoaded, setIsloaded] = useState(false)
    const [socketUrl, setSocketUrl] = useState("ws://localhost:2601");
    const [locations, setLocations] = useState([]);
    const [os, setOS] = useState("null")
    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) setIsloaded(true)

        if (socket) {
            socket.on("connect", () => {
                setConnected(true);
                socket.emit("requestData", "botsData");

            });

            socket.on("disconnect", () => {
                setBots([]);
                setConnected(false);
            });
            socket.on("botsData", (data) => {
                setConnected(true);

                setBots(JSON.parse(data));
            });
            socket.on("regularData", (data) => {
                try {
                    data = JSON.parse(data)
                    setOS(data.device)
                } catch (err) { }
            });
            socket.on("locationData", (data) => {
                setLocations(JSON.parse(data));
            });
            socket.on("logs", (data) => {
                setMonitorLogs((old) => [data, ...old]);
            });
        }
    }, [connected, socketUrl]);


    const initializeSocket = (link) => {
        localStorage.setItem("socketUrl", link);
        setSocketUrl(link)
        setBots([])
        const s = io(link, {
            transports: ["websocket"],
            forceNew: false,
        });

        setConnected(true)
        setSocket(s)
        // setTimeout(() => { console.log({ bots }) }, 5000)
    }

    // useEffect(() => {
    //     socket.on("connect", () => {
    //         setConnected(true)
    //     })
    //     socket.on("disconnect", () => {
    //         setConnected(false)
    //     })
    //     socket.on("botsData", (data) => {
    //         setBots(JSON.parse(data));
    //     });

    // }, [])
    return (
        <AppContext.Provider value={{ bots, setBots, socket, connected, initializeSocket, monitorLogs, isLoaded, socketUrl, setSocketUrl, os, }}>
            {children}
        </AppContext.Provider>
    );
}