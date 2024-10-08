import React, { useEffect, useState } from 'react' 
import { Line } from 'react-chartjs-2' 
import axios from 'axios' 

const ProductPopularityByRegion = () => {
  const [chartData, setChartData] = useState(null) 

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const response = await axios.get(
            '/userActivity/analytics/top-regions', 
            {
                withCredentials: true
            }
        )  
        const regionData = response.data.data 

        const labels = regionData.map(item => item._id.region) 
        const data = regionData.map(item => item.totalInteractions) 

        setChartData({
          labels,
          datasets: [
            {
              label: 'Product Popularity by Region',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: true,
            },
          ],
        }) 
      } catch (error) {
        console.error('Error fetching region data:', error) 
      }
    } 

    fetchRegionData() 
  }, []) 

  return (
    <div>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  ) 
} 

export default ProductPopularityByRegion 
