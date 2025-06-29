"use client"
import AxiosTransactions from "@/components/axios/axiosTransactions";
import lineChartData from "@/components/classes/chart.js/lineChart.data";
import listRequestGraphsDTO from "@/components/classes/database/dto/listRequestGraphs.dto";
import listReponseGraphsDTO from "@/components/classes/database/dto/listResponseGraphs.dto";
import { RequestListGroupByAccountAndTimeStamp } from "@/components/classes/transactions/dto/list/requestListGroupByAccountAndTimeStamp.dto";
import { ResponseListGroupByAccountAndTimeStamp } from "@/components/classes/transactions/dto/list/responseListGroupByAccountAndTimeStamp.dto";
import { Chart, ChartItem } from "chart.js/auto";
import moment from "moment";
import { useEffect, useState } from "react";

export default function GraphGroupByAccountsAndTimeStamp() {
    const [graphData, setGraphData] = useState(null as listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp> | null);
    const [requestGraphsDTO, setRequestGraphsDTO] = useState({ data: { secondsFrom: 500, type: "seconds" } } as listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>);

    useEffect(() => {
        getGraphData();
    }, []);

    /**
     * Connect to WebSockets
     */

    async function getGraphData() {
        const graphResponse = await AxiosTransactions.listGraphsAccounts(requestGraphsDTO);
        setGraphData({ ...graphResponse });
        refreshGraph(graphResponse.data)
    }

    async function refreshGraph(responseListGroupByAccountAndTimeStamp: ResponseListGroupByAccountAndTimeStamp[]) {
        //Convert Data To Chart.js Data
        const addressSet=new Set(responseListGroupByAccountAndTimeStamp.map(x=>x.address));
        
        const data = responseListGroupByAccountAndTimeStamp.reduce((data: Map<string, lineChartData>, x, index) => {

            const dataAddress = data.get(x.address as string);
            if (dataAddress) {
                (data.get(x.address as string) as lineChartData).data?.push({x:x.date as number,y:x.totalcount as number,r:x.totalvalue as number});
            } else {
                data.set(x.address as string, { data: [{x:x.date as number,y:x.totalcount as number,r:x.totalvalue as number}], label: x.address });
            }

            return data;
        }, new Map<string, lineChartData>)

        const dataFormated: any = [];
        data.forEach(x => {
            dataFormated.push(x)
        })


        /*
        const dataBubbleFormated: any = [];
        data.forEach(x => {
            dataBubbleFormated.push({...x,type:"bubble"});
        })
            */
        new Chart(
            document.getElementById("chart") as ChartItem,
            {
                type: "line",
                data: {
                    //labels: Array.from(addressSet),
                    datasets: dataFormated
                },
                options: {
                    scales: {
                        x: {
                            type: "linear",
                            ticks: {
                                callback(tickValue, index, ticks) {
                                    return moment.unix(tickValue as number).format("hh:mm:ss")
                                },
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: function (context) {
                                    const time=context[0].parsed.x
                                    return moment.unix(time as number).format("hh:mm:ss")
                                }
                            }
                        }
                    }
                },

            }
        )
    }

    return (
        <div>
            <canvas id="chart"></canvas>
        </div>
    )
}