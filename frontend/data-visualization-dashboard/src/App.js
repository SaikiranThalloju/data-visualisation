import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js";
import "./App.css";
import "chart.js/auto";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedPestle, setSelectedPestle] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      renderCharts();
    }
  }, [data]);

  useEffect(() => {
    const filterData = () => {
      const filteredData = data.filter((item) => {
        let match = true;
        if (selectedTopic && item.topic !== selectedTopic) {
          match = false;
        }
        if (selectedSector && item.sector !== selectedSector) {
          match = false;
        }
        if (selectedRegion && item.region !== selectedRegion) {
          match = false;
        }
        if (selectedPestle && item.pestle !== selectedPestle) {
          match = false;
        }
        if (selectedSource && item.source !== selectedSource) {
          match = false;
        }
        return match;
      });
      setFilteredData(filteredData);
    };

    filterData();
  }, [
    data,
    selectedTopic,
    selectedSector,
    selectedRegion,
    selectedPestle,
    selectedSource,
  ]);

  const renderCharts = () => {
    if (chartRef.current) {
      Chart.getChart(chartRef.current)?.destroy();
    }

    const barChart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.map((item) => item.topic),
        datasets: [
          {
            label: "Intensity",
            data: data.map((item) => item.intensity),
            backgroundColor: "darkBlue",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "category",
          },
        },
      },
    });

    if (pieChartRef.current) {
      Chart.getChart(pieChartRef.current)?.destroy();
    }

    const sectorCounts = data.reduce((counts, item) => {
      counts[item.sector] = (counts[item.sector] || 0) + 1;
      return counts;
    }, {});

    const sectors = Object.keys(sectorCounts);
    const counts = Object.values(sectorCounts);

    const pieChart = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: sectors,
        datasets: [
          {
            data: counts,
            backgroundColor: [
              "#FF0000",
              "#FFA500",
              "#FFFF00",
              "#008000",
              "#0000FF",
              "#4B0082",
              "#9400D3",
              "#FF1493",
              "#00FFFF",
              "#00CED1",
              "#32CD32",
              "#FFD700",
              "#FF4500",
              "#00FF00",
              "#1E90FF",
              "#8A2BE2",
              "#FF69B4",
              "#B22222",
            ],
          },
        ],
      },
    });
  };

  const topics = [...new Set(data.map((item) => item.topic))];
  const sectors = [...new Set(data.map((item) => item.sector))];
  const regions = [...new Set(data.map((item) => item.region))];
  const pestles = [...new Set(data.map((item) => item.pestle))];
  const sources = [...new Set(data.map((item) => item.source))];

  return (
    <div className="container">
      <h1>Data Visualization Dashboard</h1>
      <div className="filters-container">
        <label htmlFor="selectedTopic">Select Topic:</label>
        <select
          id="selectedTopic"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">All</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <label htmlFor="selectedSector">Select Sector:</label>
        <select
          id="selectedSector"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option value="">All</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
        <label htmlFor="selectedRegion">Select Region:</label>
        <select
          id="selectedRegion"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">All</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <label htmlFor="selectedPestle">Select Pestle:</label>
        <select
          id="selectedPestle"
          value={selectedPestle}
          onChange={(e) => setSelectedPestle(e.target.value)}
        >
          <option value="">All</option>
          {pestles.map((pestle) => (
            <option key={pestle} value={pestle}>
              {pestle}
            </option>
          ))}
        </select>
        <label htmlFor="selectedSource">Select Source:</label>
        <select
          id="selectedSource"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option value="">All</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div className="chart-container">
            <canvas id="bar-chart" ref={chartRef} />
          </div>
          <div className="chart-container">
            <canvas id="pie-chart" ref={pieChartRef} />
          </div>
        </div>

        <div className="data-container">
          {filteredData.map((item) => (
            <div className="data-item" key={item.title}>
              <h2>{item.title}</h2>
              <p>Intensity: {item.intensity}</p>
              <p>Likelihood: {item.likelihood}</p>
              <p>Relevance: {item.relevance}</p>
              <p>Country: {item.country}</p>
              <p>Topic: {item.topic}</p>
              <p>Region: {item.region}</p>
              <a href={item.url}>Click here</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
