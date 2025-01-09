import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpinWheel } from 'spin-wheel-game';
import { Modal, Radio, message, Alert } from 'antd';
import '../App.css';

const segments = [
  { segmentText: 'Gift1', segColor: '#008571' },
  { segmentText: 'Gift2', segColor: '#d88f84' },
  { segmentText: 'Gift3', segColor: '#bccfcf' },
  { segmentText: 'Gift4', segColor: 'lightcoral' },
  { segmentText: 'Gift5', segColor: 'lightpink' },
];
const prizes = ['00', '11', '55', '66', '77'];

// 示例：用于获取券码的异步函数
async function fetchCouponCode(prize) {
  try {
    const response = await fetch(`http://49.233.190.253:3000/get-coupon/${prize}`);
    const data = await response.json();
    if (data.couponCode) {
      return data.couponCode; // 返回券码
    } else {
      throw new Error('无法获取券码');
    }
  } catch (error) {
    console.error('获取券码失败:', error);
    message.warning('无法获取券码');
    return null; // 如果获取失败返回 null
  }
}
  /*
 * ============================
 *   注释掉的console log别删
 * ============================
 * 后续扩展排查时会用到。
 */
  
function Roll3() {
  const [wishedPrize, setWishedPrize] = useState(''); // 用户选择的许愿角色，初始为空
  const wishedPrizeRef = useRef(wishedPrize); // 使用useRef保存最新的wishedPrize值
  const [spinResults, setSpinResults] = useState([]); // 存储所有转盘结果及券码
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [spinCount, setSpinCount] = useState(0); 
  const spinCountRef = useRef(spinCount);
  const [isHidden, setIsHidden] = useState(false); 

  // 刷新检测（首次不监听）
const navigate = useNavigate();

  useEffect(() => {
    // 检查是否是刷新操作
    if (sessionStorage.getItem('page2Visited')) {
      // 如果是刷新，跳转回首页
      navigate('/');
    } else {
      // 页面首次访问时，设置标记
      sessionStorage.setItem('page2Visited', 'true');
    }

    // 清理页面访问标记
    return () => {
      sessionStorage.removeItem('page2Visited');
    };
  }, [navigate]);

  // 使用useEffect监听wishedPrize和spinCount
  useEffect(() => {
    wishedPrizeRef.current = wishedPrize;
    console.log('Updated Wished Prize:', wishedPrize);
  }, [wishedPrize]);

  useEffect(() => {
    spinCountRef.current = spinCount;
    console.log('次数:', spinCount);
  }, [spinCount]);

  // 计算抽奖结果（每三次抽奖必有一次是许愿角色）
  const calculatePrize = async () => {
    const randomNum = Math.random(); // 生成0-1的随机数
    console.log('Random Number for Prize:', randomNum); // 检查概率逻辑
    // console.log("User's Wished Prize:", wishedPrizeRef.current); 

    if (spinCountRef.current === 2) {
      // console.log('强执行:', spinCountRef.current);
      return wishedPrizeRef.current;
    }

    const randomIndex = Math.floor(Math.random() * prizes.length);
    // console.log('随机:', spinCountRef.current, 'Prize:', prizes[randomIndex]);
    return prizes[randomIndex];
  };

  // 转盘结束时的回调
  // const handleSpinFinish = async () => {
  //   if (!wishedPrizeRef.current) {
  //     message.warning('请先选择许愿角色！');
  //     return; 
  //   }

  //   const couponCode = await fetchCouponCode(wishedPrizeRef.current);
  //   if (!couponCode) {
  //     message.warning('无法获取券码，请重试');
  //     return;
  //   }

  //   // 使用当前spinCount值来获取正确的许愿角色
  //   const result = await calculatePrize(spinCount);

  //   // 存储每个转盘的结果和券码
  //   setSpinResults((prevResults) => [
  //     ...prevResults,
  //     { result, couponCode },
  //   ]);

  //   setIsModalVisible(true);

  //   setSpinCount((prevCount) => {
  //     const newCount = prevCount + 1;
  //     // console.log('Updated Spin Count:', newCount); 
  //     if (newCount >= 3) {
  //       setIsHidden(true);
  //     }
  //     return newCount;
  //   });
  // };

  const handleSpinFinish = async () => {
    if (!wishedPrizeRef.current) {
      message.warning('请先选择许愿角色！');
      return; 
    }
  
    // 先计算抽奖结果
    const result = await calculatePrize(spinCount);
  
    // 然后根据结果获取券码
    const couponCode = await fetchCouponCode(result);
  
    if (!couponCode) {
      message.warning('无法获取券码，请重试');
      return;
    }
  
    // 存储每个转盘的结果和券码
    setSpinResults((prevResults) => [
      ...prevResults,
      { result, couponCode },
    ]);
  
    // 显示弹窗
    setIsModalVisible(true);
  
    // 增加转盘次数
    setSpinCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= 3) {
        setIsHidden(true); // 达到三次后隐藏转盘
      }
      return newCount;
    });
  };  

  const spinWheelProps = {
    segments,
    onFinished: handleSpinFinish,
    primaryColor: '#a53a2d',
    contrastColor: '#fbfbf4',
    buttonText: 'start',
    isOnlyOnce: false,
    size: 290,
    upDuration: 100,
    downDuration: 600,
    fontFamily: 'Arial',
    arrowLocation: 'top',
    showTextOnSpin: false,
    isSpinSound: false,
    spinIndex: spinResults.length > 0
      ? segments.findIndex((segment) => segment.segmentText === spinResults[spinResults.length - 1].result)
      : null, 
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>光夜盲盒转盘-三抽</h1>
      <br />
    <Alert
      message="三抽转盘使用指北"
      description="此转盘可以转三次，点击【转盘任意处】都可以触发旋转（。＾▽＾）三次后消失。记得要先选择自推再开始哦~（未选择许愿角色则不计数）"
      type="warning"
      style={{fontWeight:'bold'}}
      showIcon
      closable
    />
    <br />
      <div style={{ marginBottom: '20px' }}>
        <label>选择许愿角色：</label>
        <Radio.Group
          value={wishedPrize}
          onChange={(e) => setWishedPrize(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          {prizes.map((prize) => (
            <Radio key={prize} value={prize}>
              {prize}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {!isHidden && <SpinWheel {...spinWheelProps} />}

      <Modal
        title="抽奖结果"
        open={isModalVisible} 
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        okText="确认"
        cancelText="关闭"
      >
        <p>许愿角色：{wishedPrize || '未选择角色'}</p> 
        <p>转盘结果：{spinResults[spinResults.length - 1]?.result || '无结果'}</p>
        <p>奖励券码：{spinResults[spinResults.length - 1]?.couponCode || '无券码'}</p>
      </Modal>

      <div style={{ marginTop: '30px' }}>
        <h3>抽奖结果：</h3>
	<p>要记得保存奖励券码哦~</p>
        <p>许愿角色：{wishedPrize || '未选择角色'}</p> 
        {spinResults.length > 0 ? (
          spinResults.map((item, index) => (
            <p key={index}>
              转盘结果 {index + 1}：{item.result || '无结果'}，奖励券码 {index + 1}：{item.couponCode || '无券码'}
            </p>
          ))
        ) : (
          <p>暂无抽奖结果</p>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
        <p>转盘次数: {spinCount}</p>
      </div>
    </div>
  );
}

export default Roll3;