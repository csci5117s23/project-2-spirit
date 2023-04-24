import Webcam from "react-webcam";
import { React, useEffect, useState } from "react";
import {Html5Qrcode} from "html5-qrcode";

// https://scanapp.org/html5-qrcode-docs/docs/intro

export default function Scan() {
    const [devicesArray, changeDevices] = useState([]);
    const [cameraId, changeCamera] = useState(null);
    const [content, changeContent] = useState(null);
    const [responseValue, setResponse] = useState(null);

    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            /**
             * devices would be an array of objects of type:
             * { id: "id", label: "label" }
             */
            if (devices && devices.length) {
                changeDevices(devices);
                changeCamera(devices[0].id);
                // .. use this to start scanning.
            }
          }).catch(err => {
            // handle err
          });        
    }, [])

    if(cameraId) {
        const html5QrCode = new Html5Qrcode(/* element id */ "reader");
        html5QrCode.start(
        cameraId, 
        {
            fps: 10,    // Optional, frame per seconds for qr code scanning
            qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
            // do something when code is read
            changeContent(decodedText);
            html5QrCode.stop().then((ignore) => {
                // QR Code scanning is stopped.
            }).catch((err) => {
                // Stop failed, handle it.
            });
        },
        (errorMessage) => {
            // parse error, ignore it.
        })
        .catch((err) => {
        // Start failed, handle it.
        });  
    }

    const fetchData = async () => {
        const response = await fetch("https://api.barcodelookup.com/v3/products", {
            "mode": "no-cors",
            "method" : "GET",
            "headers": {
                "formatted": "y",
                "barcode": content,
                "key": "gq2hop3d54a3a3y6018l3mq6gi0a1n",
        }});
        // setResponse(response);
        const data = await response.json;
        console.log("test");
        console.log(data);
    };

    return (<>
        {!content && <>
            <div id="reader" style={{width: "600px"}}></div>
            <select name="devices" id="devices" onChange={() => changeCamera(document.getElementById("devices").value)}>
                {Object.values(devicesArray).map(value => {
                    return <option key={value.label} value={value.id}>{value.label}</option>
                })}
            </select>
        </>}
        {content && <>
            <p>{content}</p>
            <button onClick={() => fetchData()}>Click to fetch</button>
        </>}
    </>);
}