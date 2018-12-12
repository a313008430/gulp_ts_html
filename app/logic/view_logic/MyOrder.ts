import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import EventType from "../../common/EventType";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";
import Utils from "../../core/Utils";


export default class MyOrder extends ViewBase {

    private orderNum; //物流号
    async  onEnable() {
        // Core.viewManager.closeView(Core.preView);
        $('#goBack').on('click', () => {
            Core.viewManager.openView(ViewConfig.personal);
        })

        $('#orderList').on('click', '.infot', function () {
            this.orderNum = $(this).data('sn');
            Core.viewManager.openView(ViewConfig.orderDetail, {
                orderNum: this.orderNum
            });
        })
        $('#orderList').on('click', '.logis-btn', (e) => {
            Core.viewManager.openView(ViewConfig.logistics);
            e.stopPropagation();
        })

        let OrderList = await Net.getData(Api.OrderList);
        let awardsBox = await Net.getData(Api.awardsBox);
        this.setOrderList(OrderList, awardsBox);
    }


    /**
     * 订单列表
     * @param OrderList  订单列表
     * @param awardsBox  奖品柜列表
     */

    private setOrderList(OrderList: any, awardsBox: any) {
        let html = '';
        let html1 = '';
        let num = [];

        for (let x = 0; x < OrderList.length; x++) {
            num.push(x)
            html += `<li>
                    <div class="top">
                        <p class="time">${OrderList[x]['c_time']}</p>
                    </div>
                    <div class="con">
                        <div class="list">`
            let goodLists = OrderList[x]['goodLists'];  //订单
            let goodId = [];
            for (let y = 0; y < goodLists.length; y++) {           //订单id
                goodId.push(parseInt(goodLists[y]['goods_id']));
            }
            let orderGoods = goodId.sort(function (a, b) {   //倒序
                return b - a;
            });
            for (let z = 0; z < awardsBox.length; z++) {
                if (orderGoods.indexOf(parseInt(awardsBox[z]['id']))!=-1) {
                    html += `<div class="infot" data-sn='${OrderList[x]['sn']}' data-id="${num[x]}">
                                                <div class="pic"><img src="${Config.imgBase + awardsBox[z]['src']}" /></div>
                                                <div class="info">
                                                    <p class="t">${awardsBox[z]['title']}</p>
                                                </div>
                                            </div>`
                }
            }
            html += `</div>
                        <div class="bottom">
                            <span>共计${OrderList[x]['goodLists'].length}件商品</span>
                        </div>
                    </div>
                </li>`
        }
        $("#orderList").html(html);
    }

    onClick(e) {
        console.log(e)
    }
}   