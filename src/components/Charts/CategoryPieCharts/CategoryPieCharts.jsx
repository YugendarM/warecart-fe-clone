import React, { useEffect, useState } from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js' 
  import { Bar, Pie } from 'react-chartjs-2' 
import axios from 'axios' 
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  ) 

const CategoryPieCharts = () => {
    const [chartData, setChartData] = useState(null) 
    ChartJS.register(ArcElement, Tooltip, Legend) 

    const options = {
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            enabled: true, 
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
          },
        },
      } 

      useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get(
                    "/userActivity/analytics/category-counts",
                    {
                      withCredentials: true
                    }
                  )
              const categories = response.data.map(item => item._id) 
              const purchaseCounts = response.data.map(item => item.purchaseCount) 
      
              setChartData({
                labels: categories,
                datasets: [
                  {
                    data: purchaseCounts,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                      'rgba(54, 162, 235, 0.8)',
                      'rgba(255, 206, 86, 0.8)',
                    ],
                  },
                ],
              }) 
            } catch (error) {
              console.error('Error fetching category data:', error) 
            }
          } 
      
          fetchCategoryData() 
      }, [])
  return (
    <div className="h-[250px]">
      {chartData ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  )
}

export default CategoryPieCharts
