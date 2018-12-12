import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import EventType from "../../common/EventType";
import AwardsBox from "./AwardsBox";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";



export default class RechargeLogic extends ViewBase {

    isCloseAnimation: boolean = true;


    async  onEnable() {



        this.setLazyLoad();

        this.node.css({ zIndex: 200, 'height': '100%' });
        //关闭自己单独定义类名
        this.node.on('click', '.closeSelf', () => {
            Core.viewManager.closeView(ViewConfig.recharge);
            if(Core.currentView.name != 'personal')Core.eventManager.event(EventType.updateBottomNav, { hide: false });
        });

        //充值成功按钮
        this.node.on('click', '#okRechargeBtn', () => {
            Core.viewManager.openView(ViewConfig.rechargeSuccess);
        });

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
   

        this.setLazyLoad();

        Core.eventManager.event(EventType.viewScroll, true);
    }

    /**
     * 充值广告
     * @param bannerList 
     */
    private setBanner(bannerList: any) {
        if (bannerList.length<=0) return; 
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
            html += `<li class="item">
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