import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const [feedback, setFeedback] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const chartInstance = useRef(null);

  const getFeedback = async () => {
    try {
      const response = await axios.get("https://2hn6tjlz-5000.asse.devtunnels.ms/feedback");
      return response.data?.data ?? [];
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      return [];
    }
  };

  const renderSentimentChart = (sentimentResults = []) => {
    let positiveCount = 0;
    let negativeCount = 0;

    sentimentResults.forEach((result) => {
      if (result.sentiment === "Positif") {
        positiveCount++;
      } else {
        negativeCount++;
      }
    });

    const total = positiveCount + negativeCount;
    const positivePercentage = total > 0 ? ((positiveCount / total) * 100).toFixed(1) : 0;
    const negativePercentage = total > 0 ? ((negativeCount / total) * 100).toFixed(1) : 0;

    const data = {
      labels: [`Positive (${positivePercentage}%)`, `Negative (${negativePercentage}%)`],
      datasets: [
        {
          data: [positiveCount, negativeCount],
          backgroundColor: ["#10B981", "#EF4444"],
          hoverBackgroundColor: ["#059669", "#DC2626"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };

    const ctx = document.getElementById("sentimentPieChart")?.getContext("2d");

    if (ctx) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                font: {
                  size: 14,
                  family: "'Inter', sans-serif",
                },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            title: {
              display: true,
              text: [`Sentiment Distribution`, `Total Feedback: ${total}`],
              font: {
                size: 16,
                weight: "600",
                family: "'Inter', sans-serif",
              },
              padding: {
                top: 20,
                bottom: 10
              },
              color: "#1F2937"
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `Count: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: "65%"
        }
      });
    }
  };

  useEffect(() => {
    getFeedback()
      .then((fetchedFeedback) => {
        setFeedback(fetchedFeedback);
        renderSentimentChart(fetchedFeedback);
      })
      .catch((error) => {
        console.error("Error fetching feedback data:", error);
        renderSentimentChart([]);
      });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedback = feedback.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(feedback.length / itemsPerPage);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chart Section */}
          <div className="lg:w-5/12">
            <div className="bg-colorAbout rounded-3xl shadow-lg shadow-gray-200/60 overflow-hidden border border-gray-100 backdrop-blur-xl">
              <div className="bg-navColor px-6 py-5">
                <h2 className="text-white text-lg font-semibold tracking-wide">
                  Sentiment Analysis
                </h2>
              </div>
              <div className="p-8">
                <canvas
                  id="sentimentPieChart"
                  className="max-w-full"
                  width="400"
                  height="400"
                ></canvas>
              </div>
            </div>
          </div>

          {/* Feedback List Section */}
          <div className="lg:w-7/12">
            <div className="bg-colorAbout rounded-3xl shadow-lg shadow-gray-200/60 overflow-hidden border border-gray-100 backdrop-blur-xl">
              <div className="bg-navColor px-6 py-5">
                <h2 className="text-white text-lg font-semibold tracking-wide">
                  Feedback Results
                </h2>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {currentFeedback.length > 0 ? (
                    currentFeedback.map((result, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        key={index}
                        className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                          result.sentiment === "Positif"
                            ? "bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100"
                            : "bg-red-50/50 hover:bg-red-50 border border-red-100"
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {result.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="ml-3 font-medium text-gray-700">
                            {result.name}
                          </span>
                        </div>
                        <p className={`${
                          result.sentiment === "Positif"
                            ? "text-emerald-800"
                            : "text-red-800"
                          } leading-relaxed`}
                        >
                          {result.text}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-3">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">
                        No feedback data available
                      </p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    <span className="text-gray-600 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                      }`}
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;