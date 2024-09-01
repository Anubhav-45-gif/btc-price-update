import React, { useState } from 'react';
import { Col, Row, Typography, Select, Menu } from 'antd';
import { 
  MoneyCollectOutlined, 
  DollarCircleOutlined, 
  FundOutlined, 
  ExclamationCircleOutlined, 
  StopOutlined, 
  TrophyOutlined, 
  CheckOutlined, 
  NumberOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';
import { Button } from 'antd'; // Import Button from antd

import HTMLReactParser from 'html-react-parser';
import millify from 'millify';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const LineChartComponent = ({ coinHistory, currentPrice, coinName, timeperiod, setTimeperiod }) => {
  const timePeriods = ['3h', '24h', '7d', '30d', '3m', '3y'];

  return (
    <div className="container">
      <div className="time-period-nav">
        {timePeriods.map((period) => (
          <Button 
            key={period} 
            className={`time-period-button ${period === timeperiod ? 'active' : ''}`} 
            onClick={() => setTimeperiod(period)}
          >
            {period}
          </Button>
        ))}
      </div>
      <LineChart coinHistory={coinHistory} currentPrice={currentPrice} coinName={coinName} />
    </div>
  );
};


const Statistics = ({ cryptoDetails, stats, btcPrice }) => (
  <div className="coin-value-statistics">
    <div className="coin-value-statistics-heading">
      <Title level={3} className="coin-details-heading">
        {cryptoDetails.name} Value Statistics
      </Title>
      <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
    </div>
    {stats.map(({ icon, title, value }) => (
      <div className="coin-stats" key={title}>
        <div className="coin-stats-name">
          <Text>{icon}</Text>
          <Text>{title}</Text>
        </div>
        <Text className="stats">{value}</Text>
      </div>
    ))}
  </div>
);

const OtherStats = ({ cryptoDetails, genericStats, btcPrice }) => (
  <div className="other-stats-info">
    <div className="coin-value-statistics-heading">
      <Title level={3} className="coin-details-heading">Other Stats Info</Title>
      <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
    </div>
    {genericStats.map(({ icon, title, value }) => (
      <div className="coin-stats" key={title}>
        <div className="coin-stats-name">
          <Text>{icon}</Text>
          <Text>{title}</Text>
        </div>
        <Text className="stats">{value}</Text>
      </div>
    ))}
  </div>
);


const About = ({ cryptoDetails, btcPrice }) => (
  <Row className="coin-desc">
   
    <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>
    {HTMLReactParser(cryptoDetails.description)}
  </Row>
);

const Links = ({ cryptoDetails, btcPrice }) => (
  <Col className="coin-links">
    
    <Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Title>
    {cryptoDetails.links?.map((link) => (
      <Row className="coin-link " key={link.name}>
        <Title level={5} className="link-name">{link.type}</Title>
        <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
      </Row>
    ))}
  </Col>
);

const CryptoDetails = () => {
  const coinId = 'Qwsogvtv82FCd';
  const btcId = 'Qwsogvtv82FCd'; // Replace with actual BTC ID
  const [timeperiod, setTimeperiod] = useState('7d');
  const [currentTab, setCurrentTab] = useState('linechart');
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timeperiod });
  const { data: btcData } = useGetCryptoDetailsQuery(btcId);
  const cryptoDetails = data?.data?.coin;
  const btcPrice = btcData?.data?.coin.price;

  if (isFetching) return <Loader />;

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails?.volume && millify(cryptoDetails?.volume)}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Approved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Col className="coin-detail-container mx-auto w-full flex flex-col items-center justify-center">
      <Col className="coin-heading-container">
      <Title level={2} className="coin-name">
  <div className="price-container">
    <span className="price">${millify(btcPrice)}</span>
  </div>
  <div className="price-change-container">
    Change: {coinHistory?.data?.change ?? 'N/A'}%
  </div>
</Title>

</Col>



      <Menu mode="horizontal" defaultSelectedKeys={['linechart']} onClick={(e) => setCurrentTab(e.key)} className="navigation">
        <Menu.Item key="linechart">Line Chart</Menu.Item>
        <Menu.Item key="statistics">Statistics</Menu.Item>
        <Menu.Item key="otherstats">Other Stats</Menu.Item>
        <Menu.Item key="about">About</Menu.Item>
        <Menu.Item key="links">Links</Menu.Item>
      </Menu>

      {currentTab === 'linechart' && (
        <LineChartComponent
          coinHistory={coinHistory}
          currentPrice={millify(cryptoDetails?.price)}
          coinName={cryptoDetails?.name}
          timeperiod={timeperiod}
          setTimeperiod={setTimeperiod}
        />
      )}
      {currentTab === 'statistics' && <Statistics cryptoDetails={cryptoDetails} stats={stats} btcPrice={btcPrice} />}
      {currentTab === 'otherstats' && <OtherStats cryptoDetails={cryptoDetails} genericStats={genericStats} btcPrice={btcPrice} />}
      {currentTab === 'about' && <About cryptoDetails={cryptoDetails} btcPrice={btcPrice} />}
      {currentTab === 'links' && <Links cryptoDetails={cryptoDetails} btcPrice={btcPrice} />}
    </Col>
  );
};

export default CryptoDetails;
