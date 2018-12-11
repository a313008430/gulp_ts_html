import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import EventType from "../../common/EventType";
import ViewConfig from "../../common/ViewConfig";
import Config from "../../common/Config";
import { Net, Api } from "../../common/Net";


export default class PersonalLoogic extends ViewBase {

  async  onEnable() {
        // Core.viewManager.closeView(Core.preView);

        //更新底部导航状态
        Core.eventManager.event(EventType.updateBottomNav, { type: 'personal' });

        //返回上一个界面 或是 上一步
        $('#goBack').on('click', () => {
            if (Core.preView) {
                // window.location.href =  '#' + Core.preView.name;
                history.go(-1);
            } else {
                window.location.href = '#index';
            }
           
        });
      
        this.bindClick();

        //用户信息
        let userInfo = await Net.getData(Api.userInfo)
        this.setUserInfo(userInfo)   
        
    }

    /**
     * 用户信息
     */
    private setUserInfo(userInfo:any[]){
        let html='';
        let coin: any = userInfo['coin'] / 100;
        let coins: any = parseInt(coin);
        html=`<div class="headport">
                 <img src="${Config.imgBase + userInfo['avatar']}" alt="">
            </div>
            <div class="tit">
                <h3>${userInfo['nick_name']}</h3>
                <p>我的魅力币：${coins}</p>
            </div>`
       $("#headportbox").html(html);
    }

    /**
     * 按钮绑定
     */
    private bindClick() {
        let self = this;
        //头像下面按钮绑定
        $('#userBtnList').on('click', 'li', function () {
            self.onClickEvent(this)
        });
        //广告图片下面按钮绑定
        $('#userBtnList2').on('click', 'li', function () {
            self.onClickEvent(this)
        });
        //充值按钮
        $('#rechargeBtn').on('click', function () {
            self.onClickEvent(this)
        })
    }

    /**
     * 所有按钮点击事件
     */
    private onClickEvent(target: HTMLElement) {
        let view: viewConfig;
        switch (target.id) {
            case 'mySign'://我的签到
                view = ViewConfig.mySign;
                break
            case 'rechargeBtn'://充值
                view = ViewConfig.recharge;
                break;
            case 'integralBtn'://积分
                view = ViewConfig.integral;
                break;
            case 'awardsBox'://奖励柜
                view = ViewConfig.awardsBox;
                break;
            case 'email'://邮箱
                view = ViewConfig.email;
                break;
            case 'orderBtn'://订单
                view = ViewConfig.myOrder;
                break;
            case 'collectBtn'://我的收藏
                view = ViewConfig.collect;
                break;
            case 'shareBtn'://我的分享
                view = ViewConfig.myShare;
                break;
            case 'addressBtn'://地址管理
                view = ViewConfig.addresses;
                break;
            case 'serviceBtn'://联系客服
                view = ViewConfig.customer;
                break;
            default:
                return;
        }
        if (!view) {
            console.error('界面丢失');
            return;
        }
        Core.viewManager.openView(view);
    }

    onRemove() {
        $('#userBtnList').off();

        $('#goBack').off();
    }

}   