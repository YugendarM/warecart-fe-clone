import React, { useEffect, useState } from 'react' 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js' 
import { Bar } from 'react-chartjs-2' 
import axios from 'axios' 

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
) 

const TopPerformingProductsBarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Interactions',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
            }
        ]
    }) 

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await axios.get(
                    '/userActivity/analytics/top-performing-products',
                    {
                        withCredentials: true
                    }
                ) 
                const products = response.data 

                const labels = products.map(product => product._id.productName)  
                const data = products.map(product => product.interactions) 

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Total Interactions',
                            data,
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        }
                    ]
                }) 
            } catch (error) {
                console.error('Error fetching top performing products:', error) 
            }
        } 

        fetchTopProducts() 
    }, []) 

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
    } 

    return <Bar options={options} data={chartData} /> 
} 

export default TopPerformingProductsBarChart 
