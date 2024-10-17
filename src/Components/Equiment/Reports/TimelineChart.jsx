import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './TimelineChart.css';

const TimelineChart = ({ selectedDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dates, setDate] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(60); // Đơn vị phút, mặc định là 60 phút
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const deviceId = '543ff470-54c6-11ef-8dd4-b74d24d26b24';

  const formatDateForAPI = (date) => moment(date).format('YYYY-MM-DD');

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiUrl}/telemetry?deviceId=${deviceId}&startDate=${formatDateForAPI(startDate)}&endDate=${formatDateForAPI(endDate)}`
      );

      // Kiểm tra xem dữ liệu có hợp lệ không
      if (response.data && Array.isArray(response.data)) {
        const processedData = response.data.map(entry => {
          const gaps = findGaps(entry.intervals);
          const intervalsWithGaps = [...entry.intervals, ...gaps].sort((a, b) => moment(a.startTime, 'HH:mm') - moment(b.startTime, 'HH:mm'));
          return { ...entry, intervals: intervalsWithGaps };
        });
        setData(processedData);
      } else {
        setData([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        setDate(newArrDate.reverse());
        fetchData(startDate, endDate);
      }
    }
  }, [selectedDate]);

  // Thêm chức năng zoom khi người dùng cuộn chuột
  const handleScroll = (event) => {
    event.preventDefault();
    const delta = event.deltaY;
    setZoomLevel(prevZoom => {
      const newZoom = prevZoom + (delta < 0 ? -15 : 15); // Zoom theo 15 phút mỗi lần
      return Math.max(15, Math.min(newZoom, 1440)); // Zoom trong khoảng 15 phút đến 1 ngày
    });
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  const renderXAxisLabels = useMemo(() => {
    const labels = [];
    const step = zoomLevel; // Khoảng cách giữa mỗi nhãn phụ thuộc vào zoomLevel
    for (let i = 0; i < 1440; i += step) {
      const time = moment().startOf('day').add(i, 'minutes').format('HH:mm');
      labels.push(
        <div key={i} style={{
          display: 'inline-block',
          width: `${(step / 1440) * 100}%`,
          textAlign: 'center',
          fontSize: '10px',
        }}>
          {time}
        </div>
      );
    }
    return labels;
  }, [zoomLevel]);

  const renderChartData = () => {
    return data.map((entry, index) => (
      <div key={index} style={{
        height: `${32 * zoomLevel}px`,
        background: `linear-gradient(to right, ${createGradientStops(entry.intervals)})`,
        marginTop: '10px',
        width: '100%',
      }} />
    ));
  };

  const createGradientStops = (intervals) => intervals.map(item => {
    const { startTime, endTime, status } = item;
    const { startPercent, durationPercent } = calculatePercentage(startTime, endTime);
    const color = getStatusColor(status);
    return `${color} ${startPercent}%, ${color} ${startPercent + durationPercent}%`;
  }).join(', ');

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <div className="x-axis-arrow" style={{ position: 'absolute', bottom: 0, left: 60, width: '93%', borderBottom: '2px solid black' }}>
        {renderXAxisLabels}
      </div>
      <div style={{ paddingLeft: '75px', position: 'relative', height: '100%' }}>
        {renderChartData()}
      </div>
    </div>
  );
};

export default TimelineChart;
