import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './TimelineChart.css';

const TimelineChart = ({ selectedDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dates, setDate] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level state
  const [configDate , setConfigDate] = ''
  const deviceId = '543ff470-54c6-11ef-8dd4-b74d24d26b24';

  const formatDateForAPI = (date) => moment(date).format('YYYY-MM-DD');

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const findGaps = (intervals) => {
    const sortedIntervals = intervals.map(item => ({
      start: timeToMinutes(item.startTime),
      end: timeToMinutes(item.endTime),
    })).sort((a, b) => a.start - b.start);

    const gaps = [];
    const dayStart = 0;
    const dayEnd = 24 * 60;
    let lastEnd = dayStart;

    sortedIntervals.forEach(({ start, end }) => {
      if (start > lastEnd) {
        gaps.push({
          status: 'offline',
          startTime: formatTime(lastEnd),
          endTime: formatTime(start),
        });
      }
      lastEnd = Math.max(lastEnd, end);
    });

    if (lastEnd < dayEnd) {
      gaps.push({
        status: 'offline',
        startTime: formatTime(lastEnd),
        endTime: formatTime(dayEnd),
      });
    }
    return gaps;
  };

  const formatTime = (minutes) => {
    const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
    const mins = String(minutes % 60).padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://192.168.1.9:5001/api/telemetry?deviceId=${deviceId}&startDate=${formatDateForAPI(startDate)}&endDate=${formatDateForAPI(endDate)}`
      );

      const processedData = response.data.map(entry => {
        const gaps = findGaps(entry.intervals);
        const intervalsWithGaps = [...entry.intervals, ...gaps].sort((a, b) => moment(a.startTime, 'HH:mm') - moment(b.startTime, 'HH:mm'));
        return { ...entry, intervals: intervalsWithGaps };
      });

      setData(processedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chạy':
        return '#00ff07';
      case 'Dừng':
        return 'red';
      case 'offline':
        return '#E7E7E7';
      default:
        return '#ffffff';
    }
  };

  const calculatePercentage = (startTime, endTime) => {
    const startInMinutes = moment.duration(startTime).asMinutes();
    const endInMinutes = moment.duration(endTime).asMinutes();
    const duration = endInMinutes - startInMinutes;
    return {
      startPercent: (startInMinutes / 1440) * 100,
      durationPercent: (duration / 1440) * 100,
    };
  };

  const createGradientStops = (intervals) => intervals.map(item => {
    const { startTime, endTime, status } = item;
    const { startPercent, durationPercent } = calculatePercentage(startTime, endTime);
    const color = getStatusColor(status);
    return `${color} ${startPercent}%, ${color} ${startPercent + durationPercent}%`;
  }).join(', ');

  useEffect(() => {
    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(d => d.toDate());
      if (startDate && endDate) {
        const startDate2 = moment(startDate);
        const endDate2 = moment(endDate);
        const newArrDate = [];
  
        for (let m = startDate2; m.isBefore(endDate2) || m.isSame(endDate2); m.add(1, 'days')) {
          newArrDate.push(m.clone());
        }
        setDate(newArrDate.reverse()); // Đảo ngược danh sách ngày để sắp xếp từ ngày gần nhất
        fetchData(startDate, endDate);
      }
    }
  }, [selectedDate, configDate]);
  

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
      const delta = event.deltaY; // Scroll direction
      setZoomLevel(prevZoom => {
        const newZoom = prevZoom + (delta < 0 ? 0.1 : -0.1); // Adjust zoom level
        return Math.max(1, Math.min(newZoom, 3)); // Limit zoom level between 1 and 3
      });
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  const chartWidth = '100%';
  const chartHeight = '400px'; // Keep height constant

  const renderXAxisLabels = useMemo(() => (
    Array.from({ length: 24 }, (_, i) => (
      <div key={i} style={{
        display: 'inline-block',
        width: '4.16%', // Đặt chiều rộng cố định cho mỗi nhãn trục X
        textAlign: 'center',
        fontSize: '10px',
        marginTop: '5px'
      }}>
        {`${i}:00`}
      </div>
    ))
  ), []);

  const renderYAxisLabels = useMemo(() => (
    dates.map((date, index) => (
      <div key={index} style={{ textAlign: 'right', fontSize: '10px' }}>
        {date.format('YYYY-MM-DD')}
      </div>
    ))
  ), [dates]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleUpArrowClick = () => {
    if (Array.isArray(selectedDate) && selectedDate.length === 2) {
      const [startDate, endDate] = selectedDate.map(d => moment(d)); // Convert to moment objects
        const newStartDate = startDate.add(1, 'days');
      const newEndDate = endDate.add(1, 'days');
      fetchData(newStartDate , newEndDate)
    }
  };
  return (
    <div style={{ position: 'relative', width: chartWidth, height: chartHeight }}>
      <div className="y-axis-arrow" style={{ position: 'absolute', top: 0, left: 60, height: '100%', borderLeft: '2px solid black' }}>
        <span className="arrow up-arrow"  onClick={() => handleUpArrowClick()}>↑</span>
      </div>
      <div className="x-axis-arrow" style={{ position: 'absolute', bottom: 0, left: 60, width: '93%', borderBottom: '2px solid black' }}>
        {renderXAxisLabels}
        <span className="arrow right-arrow">→</span>
      </div>
      <div style={{ paddingLeft: '75px', position: 'relative', height: '100%' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '60px', height: '93%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {renderYAxisLabels}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '93%' }}>
          {data.length > 0 ? data.map((entry, index) => (
            <div key={index} style={{
              height: `${32 * zoomLevel}px`, // Tăng chiều cao của thẻ div theo zoom level
              background: `linear-gradient(to right, ${createGradientStops(entry.intervals)})`,
              marginTop: '10px',
              width: '100%', // Set width to 100% of the parent container
              marginLeft: `${(100 / (24 * zoomLevel)) * entry.intervals[0]?.startTime / 1440}%` // Adjust position based on start time
            }} />
          )) : (
            <div style={{ height: '32px', backgroundColor: '#E7E7E7', marginTop: '10px', width: '100%' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;
 