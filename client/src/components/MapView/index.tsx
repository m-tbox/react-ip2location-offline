import { useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios'

import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";


interface ipData {
    range: number[];
    country: string;
    region: string;
    eu: string;
    timezone: string;
    city: string;
    ll: number[];
    metro: number;
    area: number;
}

const BASE_URL = 'http://localhost:8080/location'

const MapView = () => {
    const [locData, setLocData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const callLoginApi = async (ip: string) => {
        const response = await axios.get(`${BASE_URL}/${ip}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        return response.data
    }

    const readFile = () => {
        setLoading(true)

        fetch('/ip.txt')
            .then((r: any) => r.text())
            .then(async (textData: any) => {

                let ipAddressesFromFile = textData.split('\n')

                // Remove empty ip in array if New line is entered at the end of line
                ipAddressesFromFile = ipAddressesFromFile.filter((ip: any) => ip != '')

                let dataArr: ipData[] = await Promise.all(ipAddressesFromFile.map(async (ip: string) => {
                    if (ip) {
                        const response = await callLoginApi(ip);
                        return response.data;
                    }
                }))

                setLocData(dataArr)
                setLoading(false)
            })
    }

    useEffect(() => {
        readFile()
    }, [])


    // Format data according to map marker requirements
    let markers = locData.map((data: any, idx: number) => {

        if (data?.ll && data?.ll.length) {
            let obj = {
                latLng: data?.ll,
                name: `lat: ${data?.ll[0]}, lng: ${data?.ll[1]}, ${data?.country}`

            }

            return obj
        } else {
            return []
        }
    })

    // console.log(markers, 'marker', locData)

    return (
        <>
            {
                loading ? <span> ... Loading</span> :
                    <>
                        {
                            locData && locData.length > 0 &&
                            <VectorMap
                                map={worldMill}
                                markers={markers}
                                onRegionTipShow={(e, el, code) => {
                                    e.preventDefault();
                                }}
                            />
                        }
                    </>
            }
        </>
    )
}

export default MapView