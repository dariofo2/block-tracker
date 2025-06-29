"use client"
import AxiosTransactions from "@/components/axios/axiosTransactions";
import lineChartData from "@/components/classes/chart.js/lineChart.data";
import listRequestGraphsDTO from "@/components/classes/database/dto/listRequestGraphs.dto";
import listReponseGraphsDTO from "@/components/classes/database/dto/listResponseGraphs.dto";
import { RequestListGroupByAccountAndTimeStamp } from "@/components/classes/transactions/dto/list/requestListGroupByAccountAndTimeStamp.dto";
import { ResponseListGroupByAccountAndTimeStamp } from "@/components/classes/transactions/dto/list/responseListGroupByAccountAndTimeStamp.dto";
import SocketIoClient from "@/components/socket.io/socket.io";
import { Chart, ChartItem } from "chart.js/auto";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

export default function GraphGroupByAccountsAndTimeStamp() {
    const [graphData, setGraphData] = useState(null as listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp> | null);
    const [requestGraphsDTO, setRequestGraphsDTO] = useState({ data: { secondsFrom: 500, type: "seconds" } } as listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>);
    const [graph, setGraph] = useState(null as Chart | null);
    let doOnce = false;

    useEffect(() => {
        getGraphData();
        /*
        setInterval(() => {
            getGraphData();
        }, 5000)
        */
    }, []);

    useEffect(() => {
        if (graphData) {
            if (graph) {
                refreshGraph();
            } else {
                initializeGraph();
            }
        }

    }, [graphData]);
    /**
     * Connect to WebSockets
     */

    async function getGraphData() {
        const graphResponse = await AxiosTransactions.listGraphsAccounts(requestGraphsDTO);
        setGraphData({ ...graphResponse });
    }

    async function initializeGraph() {
        const dataFormated = await convertDataToChartJsData(graphData?.data as ResponseListGroupByAccountAndTimeStamp[]);
        createGraphByTimeStamp(dataFormated);
    }

    async function refreshGraph() {
        const dataFormated = await convertDataToChartJsData(graphData?.data as ResponseListGroupByAccountAndTimeStamp[]);
        (graph as Chart).data.datasets = dataFormated as any;
        (graph as any).update("none")
    }

    async function convertDataToChartJsData(responseListGroupByAccountAndTimeStamp: ResponseListGroupByAccountAndTimeStamp[]) {
        //Convert Data To Chart.js Data
        //const addressSet=new Set(responseListGroupByAccountAndTimeStamp.map(x=>x.address));

        const data = responseListGroupByAccountAndTimeStamp.reduce((data: Map<string, lineChartData<ResponseListGroupByAccountAndTimeStamp>>, x, index) => {

            const dataAddress = data.get(x.address as string);
            if (dataAddress) {
                (data.get(x.address as string) as lineChartData<ResponseListGroupByAccountAndTimeStamp>).data?.push(x);
            } else {
                data.set(x.address as string, { data: [x], label: x.address, tension: 0.2, pointRadius: 2 });
            }

            return data;
        }, new Map<string, lineChartData<ResponseListGroupByAccountAndTimeStamp>>)

        const dataFormated: any = [];
        data.forEach(x => {
            dataFormated.push(x)
        })

        return dataFormated;
    }
    /**
     * 
     * @param responseListGroupByAccountAndTimeStamp 
     */
    async function createGraphByTimeStamp(dataFormated: any) {
        setGraph(new Chart(
            document.getElementById("chart") as ChartItem,
            {
                type: "line",
                data: {
                    datasets: dataFormated
                },
                options: {
                    parsing: {
                        xAxisKey: 'date',
                        yAxisKey: 'totalcount'
                    },
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
                                    const time = context[0].parsed.x
                                    return moment.unix(time as number).format("hh:mm:ss")
                                },
                                afterTitle: function (context) {
                                    const valueTotal = (context[0].raw as any).valuetotal;
                                    return "Total Value: " + valueTotal;
                                }
                            }
                        }
                    }
                },

            }
        ))
    }



    return (
        <div>
            <canvas id="chart"></canvas>
            <SocketIoClient onUpdate={getGraphData}/>
        </div>
    )
}