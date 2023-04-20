import * as Yup from 'yup';
import { useState, useRef, useCallback } from "react";
import { useForm, yupResolver } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { TextInput, Box, Group, Button, FileButton } from '@mantine/core';
import { useAuth } from "@clerk/nextjs";
import { addPantry } from "@/modules/Data";
import { useRouter } from "next/router";
import Webcam from "react-webcam";



export default function Add(){
    const [imageUpload, setImageUpload] = useState(null);
    const [camUpload, setCamUpload] = useState(null);
    const webcamRef = useRef(null);

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

        if(camUpload){
            vals.image = camUpload;
        } else if(imageUpload){
            vals.image = await convertBase64(imageUpload);
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
          setCamUpload(webcamRef.current.getScreenshot());
          alert('photo taken')
        },
        [webcamRef]
      );
    return(<>
        <Box maw={640} mx="auto">
            <h1>Enter product info</h1>
            <form onSubmit={form.onSubmit((values) => addItem(values))}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                /><br />
                
                <Button onClick={capture}>Capture photo</Button>
                <FileButton name="fileButton" onChange={setImageUpload} accept="image/png,image/jpeg,image/jpg">
                    {(props) => <Button {...props}>Upload image</Button>}
                </FileButton>
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