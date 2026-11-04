import { AddressResponse } from "@/types/address";
import { cookies } from "next/headers";

export async function getAddress():Promise<AddressResponse[] | null>{
        const coookieStore = await cookies();
        const accessToken = coookieStore.get('accessToken')?.value;

        if(!accessToken){
            return null;
        }

    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/address`,{
            headers:{
                Cookie:`accessToken=${accessToken}`
            },
            cache:'no-store'
        })

        if(!response.ok){
            throw new Error('Failed to fetch cart');
        }

        const addresses:AddressResponse[] = await response.json();

        return addresses;

    } catch (error) {
        return null;
    }
}

export async function getAllAddress(): Promise<AddressResponse[] | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/address/all`,
      {
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return null;
  }
}


