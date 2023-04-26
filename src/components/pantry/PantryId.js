import { Card, TextInput, Image, Button, Badge, FileButton, Center } from "@mantine/core";
import {useInputState} from '@mantine/hooks';
import { updatePantry, deletePantry } from "@/modules/Data";
import { useState, useEffect, useRef, useCallback } from "react";
import {useAuth} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { DateInput } from "@mantine/dates";
import Webcam from "react-webcam";

export default function PantryId({item}){
    const DEFAULT_IMAGE = './food.jpg'
    const [imageUpload, setImageUpload] = useState(null);
    const [imageSrc, setImageSrc] = useState(item.image);
    const [webcam, setWebcam] = useState(false);
    const webcamRef = useRef(null);
    const [name, setName] = useInputState(item.name);
    const [quantity, setQuantity] = useInputState(item.quantity);
    const [expiration, setExpiration] = useState(null);
    const {getToken} = useAuth();
    const router = useRouter();


    useEffect(() => {
        if(item.image == null){
            setImageSrc(DEFAULT_IMAGE);
        }
        if(item.expiration != null){
            setExpiration(new Date(item.expiration));
        }
    }, []);

    useEffect(() => {
        async function processImage(){
            if(imageUpload){
                setImageSrc(await convertBase64(imageUpload));
            }
        }
        processImage();
    }, [imageUpload])

    //source: https://stackoverflow.com/questions/36580196/reactjs-base64-file-upload
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
      }

    async function update() {
        const token = await getToken({template: "codehooks"});
        if(imageSrc != null){
            item.image = imageSrc;
        }
        item.name = name;
        item.quantity = quantity;
        item.expiration = expiration;
        const updated = await updatePantry(token, item);
    }

    async function deleteItem() {
        const token = await getToken({template: "codehooks"});
        const deleted = await deletePantry(token, item);
        router.push('/pantry');
    }

    const videoConstraints = {
        width: 120,
        height: 120,
        facingMode: "user"
      };

      {/* https://www.npmjs.com/package/react-webcam */}
      const capture = useCallback(
        () => {
          setImageSrc(webcamRef.current.getScreenshot());
          setWebcam(false);
        },
        [webcamRef]
      );

  
    return(<><Card sx={{
        'button': {
            justifyContent: 'center',
            marginLeft: '5px',
            marginRight: '5px',
            marginTop: '10px',
            marginBottom: '5px'
        },

        'img': {
            marginBottom: '10px'
        }
    }}>
                <Center>
                    <Image src={imageSrc} width={200}/>
                </Center>
            
                {webcam ? (<>
                    <Center>
                    <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    /></Center><br />
                    <Button onClick={capture}>Capture photo</Button>
                </>) : (
                    <Button onClick={() => setWebcam(!webcam)}>Take picture</Button>
                )}
                <FileButton name="fileButton" onChange={setImageUpload} accept="image/png,image/jpeg,image/jpg">
                    {(props) => <Button {...props}>Upload image</Button>}
                </FileButton><br/>
                <Badge>{item.group}</Badge>
                <TextInput label="Name" value={name} onChange={setName} />
                <TextInput label="Quantity" value={quantity} onChange={setQuantity} />
                <DateInput label="Expiration" value={expiration} valueFormat="YYYY-MM-DD" onChange={setExpiration} /><br />
                <Button onClick={update}>Save</Button>
             </Card></>)
}