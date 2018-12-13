import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import EventType from "../../common/EventType";
import AwardsBox from "./AwardsBox";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";
import UserData from "../../common/UserData";
import Utils from "../../core/Utils";


export default class RechargeLogic extends ViewBase {

    // isCloseAnimation: boolean = true;

    private amount;     //金额

    async  onEnable() {

        this.setLazyLoad();

        $('#goBack').on('click', () => {
            Core.viewManager.openView(ViewConfig.personal);
        })

        //关闭自己单独定义类名
        // this.node.on('click', '.closeSelf', () => {
        //     Core.viewManager.closeView(ViewConfig.recharge);
        //     if(Core.currentView.name != 'personal')Core.eventManager.event(EventType.updateBottomNav, { hide: false });
        // });


        //充值记录
        this.node.on('click', '#recordBtn', () => {
            Core.viewManager.openView(ViewConfig.rechargeRecord);
        })

        //当前魅力币
        let userInfo = await Net.getData(Api.userInfo, { uid: 1 });
        let coin: any = userInfo['coin'] / 100;
        let coins: any = parseInt(coin);
        $(".wordList dd").eq(0).find("span").text(coins);


        //充值首页列表
        let recharge = await Net.getData(Api.recharge);
        this.setRecharge(recharge['rechargeList']);

        //充值Banner
        this.setBanner(recharge['bannerList']);

        //选中充值
        $("#rechargeList").on("click", "li", function () {
            $(this).addClass("cur").siblings().removeClass('cur');
        })

        //好友代充跳转
        this.node.on('click', '#rechargeLink', () => {
            Core.viewManager.openView(ViewConfig.friendRecharge);
        });

        //充值成功按钮 微信
        await Utils.ajax({
            url: '/src/jweixin-1.4.0.js',
            dataType: 'script'
        });

        let wxJsdk = await Net.getData(Api.wxJsdk);
        wx.config({
            //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxJsdk['appId'], // 必填，公众号的唯一标识
            timestamp: wxJsdk['timestamp'], // 必填，生成签名的时间戳
            nonceStr: wxJsdk['nonceStr'], // 必填，生成签名的随机串
            signature: wxJsdk['signature'],// 必填，签名
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
        })

        this.node.on('click', '#okRechargeBtn', async () => {
            this.amount = this.node.find(".cur").data("price");
            let userPay = await Net.getData(Api.userPay, {
                amount: this.amount,
                toUid: UserData.uid,
                type: '42'
            })

            //微信充值
            wx.chooseWXPay({
                timestamp: userPay['timestamp'], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: userPay['nonceStr'], // 支付签名随机串，不长于 32 位
                package: userPay['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: userPay['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: userPay['sign'], // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    Core.viewManager.openView(ViewConfig.rechargeSuccess);
                },
                cancel: function (res) {
                    // 取消支付后的回调函数
                    Core.viewManager.openView(ViewConfig.recharge);
                }
        
            });

            // Core.viewManager.openView(ViewConfig.rechargeSuccess);
        });



        this.setLazyLoad();

        Core.eventManager.event(EventType.viewScroll, true);
    }

    /**
     * 充值广告
     * @param bannerList 
     */
    private setBanner(bannerList: any) {
        if (bannerList.length <= 0) return;
        let html = `<img class="lazy" data-src="${Config.imgBase + bannerList[0]['src']}" >`;
        $("#rechargeBanner").append(html);
    }


    /**
     * 充值列表
     * @param rechargeList 
     */
    private setRecharge(rechargeList: any) {
        let html = '';
        for (let x = 0; x < rechargeList.length; x++) {
            html += `<li class="item" data-price="${rechargeList[x]['amount'] / 100}">
                    <a href="javascript:void(0)">
                    <span class="price">¥${rechargeList[x]['amount'] / 100}</span>
                    <p>共${rechargeList[x]['money_coin'] / 100}魅力币</p>
                </a></li>`
        }
        $("#rechargeList").html(html);
    }

    /**
     * 设置懒加载 
     */
    private setLazyLoad() {
        lazyload($(".lazy"));
    }

    onClick(e) {
        console.log(e)
    }

    onRemove() {
        Core.eventManager.event(EventType.viewScroll, false);
    }
} 