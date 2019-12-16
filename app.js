import { ENV } from './profile.js'
App({

  onLaunch(options) {
    console.info('App onLaunch');



    // 
    dd.getAuthCode({
      success: (res) => {
        my.httpRequest({
          // url: 'http://39.100.242.205:8072/metering/authCode', // 目标服务器url
          url: ENV.domain + '/metering/authCode', // 目标服务器url
          data: {
            authCode: res.authCode,
          },
          success: (res) => {
            console.log(res)
            my.setStorage({
              key: 'user', // 缓存数据的key
              data: {
                userid: res.data.userid,
                unionid: res.data.unionid,
                name: res.data.name,
                tel: res.data.tel,
                workPlace: res.data.workPlace,
                remark: res.data.remark,
                mobile: res.data.mobile,
                email: res.data.email,
                orgEmail: res.data.orgEmail,
                orderInDepts: res.data.orderInDepts,
                isAdmin: res.data.isAdmin,
                isBoss: res.data.isBoss,
                isLeaderInDepts: res.data.isLeaderInDepts,
                isHide: res.data.isHide,
                department: res.data.department,
                position: res.data.position,
                avatar: res.data.avatar,
                jobnumber: res.data.jobnumber,
                extattr: res.data.extattr,
                isSenior: res.data.isSenior,
                roles: res.data.roles,

              }, // 要缓存的数据
              success: (res) => {

              },
            });
          },
        });
      },
    });
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },




});
