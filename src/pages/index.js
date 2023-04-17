import {Button} from "@mantine/core";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    async function process() {
      if (userId) {
        router.push('/pantry')
      }
    }
    process();
  }, [userId]);
  
  return (
    <Button>Testing</Button>
  )
}
