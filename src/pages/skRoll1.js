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
];

const prizes = ['⭐', '🐟', '🍐', '🚗'];

function Roll1() {
  const [wishedPrize, setWishedPrize] = useState(''); // 用户选择的许愿角色，初始为空
  const wishedPrizeRef = useRef(wishedPrize); // 使用useRef保存最新的wishedPrize值
  const [spinResults, setSpinResults] = useState([]); // 存储所有转盘结果及券码
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制弹窗

  // 刷新检测（首次不监听）
  const navigate = useNavigate();
  
    useEffect(() => {
      // 检查是否是刷新操作
      if (sessionStorage.getItem('page3Visited')) {
        // 如果是刷新，跳转回首页
        navigate('/');
      } else {
        // 页面首次访问时，设置标记
        sessionStorage.setItem('page3Visited', 'true');
      }
  
      // 清理页面访问标记
      return () => {
        sessionStorage.removeItem('page3Visited');
      };
    }, [navigate]);

  // 使用useEffect监听wishedPrize和spinCount
  useEffect(() => {
    wishedPrizeRef.current = wishedPrize; 
    console.log("Updated Wished Prize:", wishedPrize);
  }, [wishedPrize]); 

  /*
 * ============================
 *   注释掉的console log别删
 * ============================
 * 后续扩展排查时会用到。
 */

  // 后端获取券码
  const fetchCouponCode = async (prize) => {
    try {
      const response = await fetch(`http://49.233.190.253:3000/get-coupon/${prize}`);
      const data = await response.json();
      if (response.ok) {
        return data.couponCode;
      } else {
        throw new Error(data.message || '获取券码失败');
      }
    } catch (error) {
      console.error(error);
      message.error('获取券码失败');
      return null;
    }
  };

  // 计算抽奖结果（40%概率是许愿角色）
  const calculatePrize = async() => {
    const randomNum = Math.random(); // 0-1
    // console.log("Random Number for Prize:", randomNum);  // 检查概率逻辑
    // console.log("User's Wished Prize:", wishedPrizeRef.current); 

      if (!wishedPrizeRef.current) {
        message.info("未选择(⊙o⊙)？给你随机一个");
        const randomIndex = Math.floor(Math.random() * prizes.length);
        console.log("返回随机奖品:", prizes[randomIndex]);
        // return prizes[randomIndex];
        // 获取券码
        const couponCode = await fetchCouponCode(prizes[randomIndex]);
        return { prize: prizes[randomIndex], couponCode };
      }

    if (randomNum <= 0.4) {
      // console.log("返回许愿角色:", wishedPrizeRef.current);
      // return wishedPrizeRef.current;
      const couponCode = await fetchCouponCode(wishedPrizeRef.current);
      return { prize: wishedPrizeRef.current, couponCode };
    }

    const randomIndex = Math.floor(Math.random() * prizes.length);
    // console.log("随机奖品:", prizes[randomIndex]);
    // return prizes[randomIndex];
    const couponCode = await fetchCouponCode(prizes[randomIndex]);
    return { prize: prizes[randomIndex], couponCode };
  };

  // 转盘结束时的回调
  const handleSpinFinish = async() => {
    const { prize, couponCode } = await calculatePrize();
    if (!couponCode) return;
    setSpinResults((prevResults) => [
      ...prevResults,
      { result: prize, couponCode },
    ]);


    // const result = calculatePrize();
    // const generatedCoupon = `券码-${Math.floor(Math.random() * 1000000)}`;
    // setSpinResults((prevResults) => [
    //   ...prevResults,
    //   { result, couponCode: generatedCoupon },
    // ]);

    setIsModalVisible(true);
  };

  const spinWheelProps = {
    segments, 
    onFinished: handleSpinFinish,
    primaryColor: '#a53a2d',
    contrastColor: '#fbfbf4',
    buttonText: 'start',
    isOnlyOnce: true, 
    size: 290,
    upDuration: 100,
    downDuration: 600,
    fontFamily: 'Brush Script MT',
    arrowLocation: 'top',
    showTextOnSpin: false,
    isSpinSound: false,
    spinIndex: spinResults.length > 0
      ? segments.findIndex((segment) => segment.segmentText === spinResults[spinResults.length - 1].result)
      : null, 
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>深空盲盒转盘-单抽</h1>

      <br />
    <Alert
      message="单抽转盘使用指北"
      description="此转盘只能转一次，点击【转盘任意处】都可以触发旋转（。＾▽＾）记得要先选择自推再开始哦~（没选的话会给你【随机】一个）"
      type="warning"
      style={{fontWeight:'bold'}}
      showIcon
      closable
    />
    <br />

      <div style={{ marginBottom: '20px' }}>
        <label>请选择许愿角色：</label>
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

      {<SpinWheel {...spinWheelProps} />}

      {/* 抽奖结果弹窗 */}
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
    </div>
  );
}

export default Roll1;