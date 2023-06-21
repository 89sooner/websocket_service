import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

function WebSocketComponent() {
    const [data, setData] = useState(null);
    const [ws, setWs] = useState(null);
    const props = useSpring({ number: data, from: { number: 0 }});

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:9002');

        ws.onopen = () => {
            console.log('connected');
            ws.send('request');

        };

        ws.onmessage = (message) => {
            const newData = JSON.parse(message.data);
            setData(newData[0].value);
          };

        ws.onclose = () => {
            console.log('disconnected');
        };

        // Save WebSocket instance to state to use in other effects
        setWs(ws);

        // Cleanup function will be called when the component unmounts
        return () => {
            ws.close();
        };
    }, []);

    return (
        // <div>
        //     {data ? JSON.stringify(data) : 'Loading...'}
        // </div>
        <animated.div>
            {props.number.to(n => n.toFixed(2))}
        </animated.div>
    );
}

export default WebSocketComponent;
