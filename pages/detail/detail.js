import { ENV } from '../../profile'
Page({
  data: {
    visibility: "hidden",
    departmentArray: [],
    userListArray: [],
    isAdmin: false,
    statusArray: ['已报废', '封存', '在用', '已送检', '即将过期', '已过期'],
  },

  updateNotes(e) {
    var that = this
    if (e.detail.value !== this.data.item.meteringRecord.notes) {
      my.httpRequest({
        // url: 'http://39.100.242.205:8072/updateNotes',
        url: ENV.domain + '/metering/updateNotes', // 目标服务器url
        data: {
          notes: e.detail.value,
          meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
          log: "[" + that.data.user.name + "]修改备注为：" + e.detail.value,

        },
      })
    }

  },

  datePickerYMD() {
    var that = this

    if (this.data.item.meteringRecord.meteringStatus === "3") {
      my.datePicker({
        startDate: that.data.item.meteringRecord.meteringValidity,
        endDate: '2039-12-12',
        success: (res) => {

          if (res.date != null) {
            my.httpRequest({
              // url: 'http://39.100.242.205:8072/updateValidity',
              url: ENV.domain + '/metering/updateValidity', // 目标服务器url
              data: {
                meteringValidity: res.date,
                meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
                log: "[" + that.data.user.name + "]修改有效期为" + res.date
              },
            })
            my.httpRequest({
              // url: 'http://39.100.242.205:8072/updateStatus',
              url: ENV.domain + '/metering/updateStatus', // 目标服务器url
              data: {
                meteringStatus: "2",
                meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
                log: "[" + that.data.user.name + "]修改状态为在用",
},
            })
            my.alert({
              content: '已修改工具有效期至\n' + res.date,
              complete: () => {
                that.onPullDownRefresh();
              }

            })
          }
        },

      });
    }
    else {
      dd.alert({
        content: '请送检后再修改工具有效期'
      });
    }
  },
  onStatusTap() {
    var that = this
    my.showActionSheet({
      title: '选择要修改的状态',
      items: that.data.statusArray,

      success: (res) => {

        if (res.index >= 0) {
          my.httpRequest({

            url: ENV.domain + '/metering/updateStatus', // 目标服务器url
            data: {
              meteringStatus: res.index,
              meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
              log: "[" + that.data.user.name + "]修改状态为" +that.data.statusArray[res.index],
            },

            success: (res) => {

              if (res.status === 200) {
                my.alert({
                  title: '修改成功'
                });

                that.onPullDownRefresh();

              }

            }
          })
        }


      },
    });

  },
  status3() {
    var that = this
    if (this.data.item.mStatusCode == 3) {
      dd.alert({
        content: '您的工具已送检'
      });
    }
    else {
      dd.confirm({
        title: "",
        content: "确认您的计量工具已送检",
        confirmButtonText: "已送检",
        cancelButtonText: "返回",
        success: (res) => {
          if (res.confirm) {
            my.httpRequest({

              url: ENV.domain + '/metering/updateStatus', // 目标服务器url
              data: {
                meteringStatus: "3",
                meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
                log: "["+that.data.user.name+"]修改状态为已送检",
              },
              success: (res) => {
                that.onPullDownRefresh();
              },
            });
          }

        },
        fail() {
          console.log('fail');
        },
      });
    }

  },
  status0() {
    var that = this
    dd.confirm({
      title: "",
      content: "确认您的计量工具已报废",
      confirmButtonText: "已报废",
      cancelButtonText: "返回",
      success: (res) => {
        if (res.confirm) {
          my.httpRequest({
            // url: 'http://39.100.242.205:8072/updateStatus', // 目标服务器url
            url: ENV.domain + '/metering/updateStatus', // 目标服务器url
            data: {
              meteringStatus: "0",
              meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
              log: "[" + that.data.user.name + "]修改状态为已报废",
            },
            success: (res) => {
              that.onPullDownRefresh();
            },
          });
        }
      },
    });
  },
  // 转让
  makeOver() {
    var that = this
    my.httpRequest({
      // 获取部门列表
      url: ENV.domain + '/metering/getDepartments', // 目标服务器url
      data: {

      },
      success: (res) => {
        // list转数组
        for (var i = 0; i < res.data.length; i++) {
          that.data.departmentArray[i] = res.data[i].name

        }
        that.setData({
          departments: res.data,
          departmentArray: that.data.departmentArray,
        })

        // 显示部门列表
        my.showActionSheet({
          items: that.data.departmentArray,
          success: (res) => {
            that.setData({
              departmentArrayIndex: res.index,
            })
            // 获取员工列表
            my.httpRequest({

              url: ENV.domain + '/metering/getUserList', // 目标服务器url
              data: {
                department: that.data.departments[res.index].id
              },
              success: (res) => {
                // list转数组
                that.data.userListArray = []
                for (var i = 0; i < res.data.userlist.length; i++) {
                  that.data.userListArray[i] = res.data.userlist[i].name

                }
                that.setData({
                  userList: res.data.userlist,
                  userListArray: that.data.userListArray,
                })
                // 显示员工列表
                my.showActionSheet({
                  items: that.data.userListArray,
                  success: (res) => {
                    that.setData({
                      userListArrayIndex: res.index,
                    })
                    // 确认
                    my.confirm({
                      title: "",
                      content: "您确定要将工具转让给" + that.data.userList[res.index].name + "吗？",
                      confirmButtonText: "确认",
                      cancelButtonText: "取消",
                      success: (res) => {
                        if (res.confirm) {
                          // 更新持有人
                          my.httpRequest({
                            url: ENV.domain + '/metering/makeOver', // 目标服务器url
                            data: {
                              makeOverUser: that.data.userList[that.data.userListArrayIndex].name,
                              makeOverUserId: that.data.userList[that.data.userListArrayIndex].userid,
                              department: that.data.departments[that.data.departmentArrayIndex].name,
                              meteringRecordId: that.data.item.meteringRecord.meteringRecordId,
                              log: "[" + that.data.user.name + "]转让工具给" +that.data.userList[that.data.userListArrayIndex].name,
                            },
                            success: (res) => {
                              my.alert({
                                title: '转让成功'
                              });
                              that.onPullDownRefresh();


                            }
                          });
                        }
                      },
                    });


                  },
                });


              }
            });
          },
        });
      },
    });



  },

  onLoad(option) {
    var that = this

    this.setData({
      item: JSON.parse(option.item)
    })

    switch (this.data.item.meteringRecord.meteringStatus) {
      case "0":
        that.setData({
          mStatus: "已报废"
        })
        break;
      case "1":
        that.setData({
          mStatus: "封存"
        })
        break;
      case "2":
        that.setData({
          mStatus: "在用"
        })
        break;
      case "3":
        that.setData({
          mStatus: "已送检"
        })
        break;
      case "4":
        that.setData({
          mStatus: "即将过期"
        })
        break;
      case "5":
        that.setData({
          mStatus: "已过期"
        })
        break;

    }
    my.getStorage({
      key: 'user', // 缓存数据的key
      success: (res) => {
        that.setData({
          user: res.data

        })

        if (res.data.isAdmin === true) {
          that.setData({
            isAdmin: true,
          })
        }
        else {
          for (var i = 0; i < res.data.roles.length; i++) {
            console.log(res.data.roles[i].id)
            if (res.data.roles[i].id === 385870218) {
              that.setData({
                isAdmin: true
              })
            }
          }

        }


        if (res.data.jobnumber === that.data.item.meteringRecord.userId && that.data.item.meteringRecord.meteringStatus > 1||that.data.isAdmin) {
          that.setData({
            visibility: "visible",
          })
        }

      },
    });


  },
  onPullDownRefresh() {
    var that = this
    // 页面被下拉
    my.httpRequest({

      url: ENV.domain + '/metering/findRecord', // 目标服务器url
      data: {
        meteringRecordId: that.data.item.meteringRecord.meteringRecordId
      },
      success: (res) => {
        console.log(res)
        dd.stopPullDownRefresh();
        that.setData({
          item: res.data[0]
        })
        switch (that.data.item.meteringRecord.meteringStatus) {
          case "0":
            that.setData({
              mStatus: "已报废"
            })
            break;
          case "1":
            that.setData({
              mStatus: "封存"
            })
            break;
          case "2":
            that.setData({
              mStatus: "在用"
            })
            break;
          case "3":
            that.setData({
              mStatus: "已送检"
            })
            break;
          case "4":
            that.setData({
              mStatus: "即将过期"
            })
            break;
          case "5":
            that.setData({
              mStatus: "已过期"
            })
            break;
        }

        if (that.data.user.jobnumber === that.data.item.meteringRecord.userId && that.data.item.meteringRecord.meteringStatus > 1||that.data.isAdmin) {
          that.setData({
            visibility: "visible",
          })
        }
        else {
          that.setData({
            visibility: "hidden",
          })
        }
      },
    });

  },

});
