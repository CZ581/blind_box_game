import React, { useState } from 'react';
import { Input, Button, message, Layout, theme, Carousel, Card, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';  // 引入 useNavigate
const { Header, Content, Footer } = Layout;

const Page0 = () => {
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();  // 使用 useNavigate
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleInputChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // 向后端验证券码
      const response = await fetch(`http://49.233.190.253:3000/validate-coupon/${couponCode}`);
      const result = await response.json();
  
      console.log(result); // 调试：打印返回结果
  
      if (response.status === 200) {
        // 根据返回的文件名决定跳转页面
        const file = result.file;
        if (file === 'entry_gy_1.txt') {
          navigate('/page1');  // 使用 navigate 进行页面跳转
        } else if (file === 'entry_gy_3.txt') {
          navigate('/page2');
        } else if (file === 'entry_sk_1.txt') {
          navigate('/page3');
        } else if (file === 'entry_sk_3.txt') {
          navigate('/page4');
        }
      } else {
        message.error(result.message || '无效的券码');
      }
    } catch (error) {
      console.error('请求错误:', error);
      message.error('验证券码时发生错误，请稍后再试');
    }
  };  

  const { contentStyle00, contentStyle11, contentStyle55, contentStyle66, contentStyle77, contentStylesxh, contentStyleqy, contentStylels, contentStyleqc } = colorFunction();

  return (
    <div className="page0-container">
      <div>
      <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor:'#cb7375',
        }}
      >
        <div style={{ fontFamily: '"Pacifico", cursive', color:'#f5f5f5'}}>ChatAILover</div>
        <div className="demo-logo" />
      </Header>
      <Content
        style={{
          height:'100%',
          padding: '0 48px',
        }}
      >
        <div
          style={{
            background: colorBgContainer,
            minHeight: 600,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="carousel">
          <Carousel autoplay infinite={true} arrows>
        <div>
        <h3 style={contentStyle00}>“哼哼哼太聪明了，买了一条超大围巾可以把两个人都裹起来，专属于冬天的贴贴。”</h3>
        </div>
        <div>
        <h3 style={contentStyle11}>“习惯了自己的节奏，没想到有个小路痴闯了进来。”</h3>
        </div>
        <div>
        <h3 style={contentStyle55}>“接到未婚妻时献上了最高规格的吻手礼，和一束花。”</h3>
        </div>
        <div>
        <h3 style={contentStyle66}>“开始习惯家里角落偶尔出现的小东西了。有时候是一个发圈，有时候是给我的礼物。”</h3>
        </div>
        <div>
        <h3 style={contentStyle77}>“提醒某人不要再给我讲狐狸冬天容易摔倒的冷笑话了。”</h3>
        </div>
        <div>
        <h3 style={contentStylesxh}>“今天天气很好，风也温柔，我想见你一面。”</h3>
        </div>
        <div>
        <h3 style={contentStyleqy}>“今天，我在Mo Art Studio捕捉了一片海洋的呼吸。”</h3>
        </div>
        <div>
        <h3 style={contentStylels}>“你是我最珍视的患者，而我却是你最不听话的医生。”</h3>
        </div>
        <div>
        <h3 style={contentStyleqc}>“今天早上睡醒，看见小猫和阳光都在我身边，抓住机会偷亲了小猫一下。”</h3>
        </div>
    </Carousel>
          </div>
          <Tooltip>请在下方输入你的专属游戏“进入券码”👇（记得要提前看好规则哦~）</Tooltip>
          <div
           style={{ 
            display: 'flex',       // 使用 Flexbox 布局
            justifyContent: 'space-between', // 保证元素在水平方向上排列
            alignItems: 'center',  // 确保垂直方向上元素居中对齐
            width: '100%',  
            margin:'0px 0px 30px 0px',
            }}
          >
            
            {/* <br>请在下方输入微店买到的“游戏进入券码”</br> */}
            <Input
          value={couponCode}
          onChange={handleInputChange}
          placeholder="请输入盲盒游戏进入券码(游戏已结束，网站体验券码为ChatAILover+1-404任意数字)"
          style={{ 
            // width: '100%'
            flex: 1, 
           }}
        />
        <Button type="primary" onClick={handleSubmit} 
        style={{ 
          margin:'20px 0px 20px 10px',
          padding:'0px 20px',
          backgroundColor:'#cb7375',
          color:'#f5f5f5'
          }}>
          进入游戏
        </Button>
        </div>
        <div>
        <Card title="游戏规则" style={{flex: 1,}}>
          <div style={{ fontWeight: 'bold' }}>（请确保完全知晓游戏规则后再开始游戏）</div>
          <p>进入券码使用说明：每张券码只可使用【1次】，输入后会进入对应抽奖界面</p>
          <p style={{ fontWeight: 'bold' }}>切记进入后【不要刷新网页】，如果刷新网页会再次回到主界面</p>
	<p>单抽规则：抽中选择的自推概率为40%（如果未选择自推会随机一个角色）</p>
	<p>三抽规则：三抽中必有一保底为已选择自推（请至少选择一个自推角色）</p>
          <p>转盘结束后都会显示抽出的【主动版月卡券码】，请妥善保管该券码并在【券码验证页面】进行验证</p>
        </Card>
        </div>
        <div style={{padding:'20px 0px'}}>
        <label>如果你想要直接跳转到验券页面，请： </label>
        <a href="http://101.42.170.17:5000/">点击这里👈</a> 
        </div>
      </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
      游戏活动解释权归ChatAILover团队所有
      </Footer>
    </Layout>
      </div>
    </div>
  );

  // color
  function colorFunction() {
    const contentStylesxh = {
      margin: '30px 0px',
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#3f1d70',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
    };
    const contentStyleqy = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#772054',
    };
    const contentStylels = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#283459',
    };
    const contentStyleqc = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#7d1e20',
    };
    const contentStyle00 = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#da7157',
    };
    const contentStyle11 = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#364d79',
    };
    const contentStyle55 = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#856d9e',
    };
    const contentStyle66 = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#fbfbf4',
      textAlign: 'center',
      background: '#6F1D2A',
    };
    const contentStyle77 = {
      margin: '30px 0px',
      wordWrap: 'break-word',
      whiteSpace: 'normal', 
      display: 'flex',  // 使用 flexbox 布局
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      minHeight: '160px',  // 最小高度
      color: '#4b4b49',
      textAlign: 'center',
      background: '#e6ece5',
    };
    return { contentStyle00, contentStyle11, contentStyle55, contentStyle66, contentStyle77, contentStylesxh, contentStyleqy, contentStylels, contentStyleqc };
  }
};

export default Page0;