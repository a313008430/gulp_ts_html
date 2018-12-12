import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import EventType from "../../common/EventType";
import AwardsBox from "./AwardsBox";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";


export default class FriendRecharge extends ViewBase {

    async  onEnable() {

        this.setLazyLoad();

        this.node.css({ zIndex: 200, 'height': '100%' });
        //返回上一个界面 或是 上一步
        $('#goBack').on('click', () => {
            if (Core.preView) {
                window.location.href = '#' + Core.preView.name;
            } else {
                window.location.href = '#index';
            }

        });

        //充值首页列表
        let recharge = await Net.getData(Api.recharge);
        this.setRecharge(recharge['rechargeList']);

        //充值Banner
        this.setBanner(recharge['bannerList']);

        //选中充值
        $("#friendRecharges").on("click", "li", function () {
            $(this).addClass("cur").siblings().removeClass('cur');
        })

        this.setLazyLoad();

    }

    /**
     * 充值广告
     * @param bannerList 
     */
    private setBanner(bannerList: any) {
        if (bannerList.length<=0) return; 
        let html = `<img class="lazy" data-src="${Config.imgBase + bannerList[0]['src']}" >`;
        $("#friendBanner").html(html)
    }

    /**
     * 充值列表
     * @param rechargeList 
     */
    private setRecharge(rechargeList: any) {
        let html = '';     
        for (let x = 0; x < rechargeList.length; x++) {
            let goodList = rechargeList[x]['goodsList'];    
            for (let y = 0; y <goodList.length; y++) { 
                if (goodList[y]['recharge_amount_attribute_id'] == 77) {
                    html+=`<li class="item">
                            <a href="javascript:void(0)">
                            <span class="icon"><em>${goodList[y]['recharge_amount_goods_title']}</em></span>
                            <span class="price">¥${rechargeList[x]['amount'] / 100}</span>
                            <p>共${rechargeList[x]['money_coin'] / 100}魅力币</p>
                        </a></li>`
                }
            }
        }
        $("#friendRecharges").html(html)      
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
}   