import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/complaints');
        const tickets = res.data;
        
        // Process categories for chart
        const catMap = {};
        tickets.forEach(t => {
          catMap[t.categoryName] = (catMap[t.categoryName] || 0) + 1;
        });
        
        const chartData = Object.keys(catMap).map(name => ({
          name,
          value: catMap[name]
        }));
        
        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#22c55e'];

  return (
    <div className="analytics-page fade-in">
      <div className="section-header">
        <h2>System Insights</h2>
        <p>Visualizing complaint categories and system performance</p>
      </div>

      <div className="charts-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
        <div className="card chart-container" style={{height: '400px'}}>
          <h3>Complaints by Category</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-container" style={{height: '400px'}}>
          <h3>Ticket Volume</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
