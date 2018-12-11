import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import EventType from "../../common/EventType";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";
import Utils from "../../core/Utils";


export default class OrderDetail extends ViewBase {

    async onEnable() {

        $('#goBack').on('click', () => {
            Core.viewManager.openView(ViewConfig.myOrder);
        })

        await Utils.ajax({
            url: '/src/address.js',
            dataType: 'script'
        });

        await Utils.ajax({
            url: '/src/clipboard.min.js',
            dataType: 'script'
        });
       

        //订单详情
        let awardsBox = await Net.getData(Api.awardsBox);  
        let orderNum = this.dataSource['orderNum'];
        let OrderInfo = await Net.getData(Api.OrderInfo, {
            sn: orderNum
        });
        this.orderList(OrderInfo['addressInfo'],OrderInfo['orderInfo']);
        this.awardsGood(awardsBox,OrderInfo['goodLists']);
        
        $("#distrInformTion").on("click",'#copyBtn',function(){
            
            console.log(11111)
        })
    }

    /**
     * 地址信息
     * @param OrderInfo 
     */

    private orderList(addressInfo: any,OrderInfo: any) {

       //城市
        let html = ''
        for (let x = 0; x < addressInfo.length; x++) {
            let province_cn: Array<string> = [], //省份
                city_cn: Array<string> = [],      //市区
                area_cn: Array<string> = [];      //县

            /**城市拼接遍历 */
            city.forEach(function (item, index) {
                if (index == addressInfo[x]['province']) {
                    province_cn = item['name'];
                    if (item.hasOwnProperty('child')) {
                        item['child'].forEach(function (item1, index1) {
                            if (index1 == addressInfo[x]['city']) {
                                city_cn = item1['name'];
                                if (item1.hasOwnProperty('child')) {
                                    item1['child'].forEach(function (item2, index2) {
                                        if (index2 == addressInfo[x]['area']) {
                                            area_cn = item2['name'];
                                        }
                                    })
                                }
                            }

                        });

                    }
                }
            })
            html += `<div class="info">
                        <div class="name">${addressInfo[x]['name']}<span>${addressInfo[x]['phone']}</span></div>
                        <div class="address">${province_cn + '' + city_cn + '' + area_cn + addressInfo[x]['address']}</div>
                    </div>`;
        }
        $(".orderaddress").append(html);
     
        //下单信息
        let orderHtml=`<dd class="tip">
                        订单编号：
                        <span id="txt" class="wl">${OrderInfo['sn']}</span>
                        <span id="copyBtn" class="fz" data-clipboard-action="copy" data-clipboard-text="213312313">复制</span>
                    </dd>
                    <dd class="tip">
                        订单时间：
                        <span class="wl">${OrderInfo['c_time']}</span>  
                    </dd>`
             $("#distrInformTion").html(orderHtml);
    }

    /**
     * 订单列表
     */
    private awardsGood(awardsBox: any,goodLists: any) {
        let html = '' 
        let goodId=[];
        
        for(let x=0;x<goodLists.length;x++){
            goodId.push(parseInt(goodLists[x]['user_goods_id']));
        } 
        let orderGoods = goodId.sort(function (a, b) {
            return b-a;
        });
        for (let x = 0; x < awardsBox.length; x++) {  
            if(orderGoods.indexOf(parseInt(awardsBox[x]['id']))!=-1){
                html+=`<li class="item">
                        <div class="imgbox">
                            <img src="${Config.imgBase+awardsBox[x]['src']}" alt="">
                        </div>
                        <div class="infoword">
                            <p>${awardsBox[x]['title']}</p>
                        </div>
                    </li>`
            }      
        }
        $("#comList").html(html);
    }

    onClick(e: Event) {

    }
} 