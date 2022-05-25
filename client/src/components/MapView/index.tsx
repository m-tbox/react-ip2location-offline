import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { VectorMap } from "@react-jvectormap/core"
import { worldMill } from "@react-jvectormap/world"

import './styles.css'

const MapView = () => {
    const [loading, setLoading] = useState<boolean>();
    const [locData, setLocData] = useState()
    const [markers, setMarkers] = useState<any>()

    // const fetchCsv = async () => {
    //     const response = await fetch('/IP2LOCATION-LITE-DB5.csv') as any;
    //     const reader = response.body.getReader();
    //     const result = await reader.read();
    //     const decoder = new TextDecoder('utf-8');
    //     const csv = await decoder.decode(result.value);
    //     return csv;
    // }


    async function getGraphData() {
        setLoading(true)

        let graphData = [] as any
        graphData = await readAndParseData()

        console.log(graphData, 'ggg')
        fetch('/ip.txt')
            .then((r) => r.text())
            .then(textData => {

                let ipAddressesFromFile = textData.split('\n')

                if (graphData.length) {

                    let ipNumber = 0
                    let markersArr: any[] = []

                    ipAddressesFromFile.map(ip => {
                        const splitIp = ip.split('.')

                        const w = splitIp?.[0] as any
                        const x = splitIp?.[1] as any
                        const y = splitIp?.[2] as any
                        const z = 0

                        ipNumber = (16777216 * w) + (65536 * x) + (256 * y) + z


                        let index = graphData.findIndex(function (el: any) {
                            return el[0] == ipNumber
                        });

                        if (index > -1 && graphData[index]) {
                            markersArr.push([
                                graphData[index][6],
                                graphData[index][7]
                            ])
                            console.log('Data found at index', index)
                            console.log('Data', graphData[index])
                        }
                    })

                    setMarkers(markersArr)
                }
            })

        setLoading(false)

        console.log('length', markers)
        setLocData(graphData)
    }

    const readAndParseData = async () => {
        const response = await fetch('/IP2LOCATION-LITE-DB5.csv') as any
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')

        let csvText = ""
        let value, done;
        while (!done) {
            ({ value, done } = await reader.read());
            if (done) {
                break
            }

            const csv = decoder.decode(value)
            csvText = csvText.concat(csv)
        }

        const results = await Papa.parse(csvText, { header: false })
        const rows = results.data

        return rows
    }

    useEffect(() => {
        getGraphData()
    }, [])


    // Format data according to map marker requirements
    // let markers = locData.map((data: any, idx: number) => {

    //     if (data?.ll && data?.ll.length) {
    //         let obj = {
    //             latLng: data?.ll,
    //             name: `lat: ${data?.ll[0]}, lng: ${data?.ll[1]}, ${data?.country}`

    //         }

    //         return obj
    //     } else {
    //         return []
    //     }
    // })

    // console.log('marker', locData)

    return (
        <>
            {
                loading ? <span> ... Loading</span> :
                    <>
                        {/* {
                            locData && locData.length > 0 &&
                            <VectorMap
                                map={worldMill}
                                markers={markers}
                                onRegionTipShow={(e, el, code) => {
                                    e.preventDefault();
                                }}
                            />
                        } */}
                    </>
            }
        </>
    )
}

export default MapView