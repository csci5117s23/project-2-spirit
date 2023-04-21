import * as Yup from 'yup';
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, yupResolver } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { TextInput, Box, Group, Button, FileButton, Image } from '@mantine/core';
import { useAuth } from "@clerk/nextjs";
import { addPantry } from "@/modules/Data";
import { useRouter } from "next/router";
import Webcam from "react-webcam";



export default function Add(){
    const [imageUpload, setImageUpload] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [webcam, setWebcam] = useState(false);
    const webcamRef = useRef(null);
    const resetRef = useRef(null);

    const clearImage = () => {
        setImageSrc(null);
        resetRef.current?.();
    };

    useEffect(() => {
        async function processImage(){
            if(imageUpload){
                setImageSrc(await convertBase64(imageUpload));
            }
        }
        processImage();
    }, [imageUpload])

    const schema = Yup.object().shape({
        name: Yup.string().required(),
        group: Yup.string().required(),
        quantity: Yup.string(),
        expiration: Yup.date(),
        image: Yup.string()
    });

    const form = useForm({ validate: yupResolver(schema), initialValues: { name: '', group: '', quantity: '', expiration: ''} });
    const { userId, getToken } = useAuth();
    const router = useRouter();

    async function addItem(vals){
        const token = await getToken({ template: "codehooks" });
        console.log(imageUpload)

        if(imageSrc){
            vals.image = imageSrc;
        } 
        
        console.log(vals);

        const newPantryItem = await addPantry(token, vals);
        router.push('/pantry');

    }

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

    return(<>
        <Box maw={640} mx="auto">
            <h1>Enter product info</h1>
            <form onSubmit={form.onSubmit((values) => addItem(values))}>
                {imageSrc && (<>
                    <h2>Current image:</h2>
                    <Image src={imageSrc} width={200} height={200}></Image>
                </>)}

                {webcam ? (<>
                    <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    /><br />
                    <Button onClick={capture}>Capture photo</Button>
                </>) : (
                    <Button onClick={() => setWebcam(!webcam)}>Take picture</Button>
                )}

                <FileButton name="fileButton" onChange={setImageUpload} accept="image/png,image/jpeg,image/jpg">
                    {(props) => <Button {...props}>Upload image</Button>}
                </FileButton>
                <Button disabled={!imageSrc} color="red" onClick={clearImage}>Reset</Button>
                <TextInput withAsterisk label="Name" placeholder="Name" {...form.getInputProps('name')} />
                <TextInput withAsterisk label="Group" placeholder="Group" {...form.getInputProps('group')} />
                <TextInput label="Quantity" placeholder="Quantity" {...form.getInputProps('quantity')} />
                <DateInput label="Expiration Date" placeholder="Expires on" valueFormat="YYYY-MM-DD" {...form.getInputProps('expiration')} />
                <Group position="center" mt="md">
                    <Button type="submit">Add product</Button>
                </Group>
            </form> 
        </Box>
    </>);
}