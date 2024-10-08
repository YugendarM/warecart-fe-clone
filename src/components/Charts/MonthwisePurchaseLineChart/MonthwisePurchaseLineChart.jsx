import React, { useEffect, useState } from 'react' 
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js' 
import { Line } from 'react-chartjs-2' 
import axios from 'axios' 

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
) 

const MonthwisePurchaseLineChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            { label: 'Purchases', data: [], borderColor: 'rgba(255, 99, 132, 1)', fill: false },
            { label: 'Wishlisted', data: [], borderColor: 'rgba(53, 162, 235, 1)', fill: false },
            { label: 'Add to Cart', data: [], borderColor: 'rgba(255, 206, 86, 1)', fill: false },
        ],
    }) 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    '/userActivity/analytics/monthly-product-activity', 
                    {
                        withCredentials: true
                    }
                )  
                const monthlyData = response.data 

                const currentDate = new Date() 
                const lastSixMonths = [] 
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ] 

                for (let i = 5;  i >= 0;  i--) {
                    const date = new Date() 
                    date.setMonth(currentDate.getMonth() - i) 
                    lastSixMonths.push({ month: date.getMonth() + 1, label: monthNames[date.getMonth()] }) 
                }

                const purchaseData = new Array(6).fill(0) 
                const wishlistData = new Array(6).fill(0) 
                const addToCartData = new Array(6).fill(0) 

                monthlyData.forEach(item => {
                    const monthIndex = lastSixMonths.findIndex(m => m.month === item.month) 
                    if (monthIndex !== -1) { // Check if the month is in the last six months
                        purchaseData[monthIndex] += item.purchases || 0 
                        wishlistData[monthIndex] += item.wishlists || 0 
                        addToCartData[monthIndex] += item.addToCarts || 0 
                    }
                }) 

                const labels = lastSixMonths.map(month => month.label) 

                setChartData({
                    labels,
                    datasets: [
                        { label: 'Purchases', data: purchaseData, borderColor: 'rgba(255, 99, 132, 1)', fill: false },
                        { label: 'Wishlisted', data: wishlistData, borderColor: 'rgba(53, 162, 235, 1)', fill: false },
                        { label: 'Add to Cart', data: addToCartData, borderColor: 'rgba(255, 206, 86, 1)', fill: false },
                    ],
                }) 
            } catch (error) {
                console.error('Error fetching data:', error) 
            }
        } 

        fetchData() 
    }, []) 

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: '',
            },
        },
    } 

    return <Line options={options} data={chartData} /> 
} 

export default MonthwisePurchaseLineChart 