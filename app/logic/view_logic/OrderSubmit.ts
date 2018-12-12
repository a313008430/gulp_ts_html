import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import EventType from "../../common/EventType";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";
import Utils from "../../core/Utils";


export default class OrderSubmit extends ViewBase {

    private orderId;  //商品柜id
    private orderList = {};
    private orderNum; //订单号

    onAwake() {
        Core.eventManager.on(EventType.error, this, this.onError);
    }

    async onEnable() {

        $('#goBack').on('click', () => {
            Core.viewManager.openView(ViewConfig.awardsBox);
        });
        //精品柜列表
        let $this = this;
        let awardsBox = await Net.getData(Api.awardsBox);
        this.awardsGood(awardsBox);

        //地址传参
        this.orderList = this.dataSource;
       // console.log(this.orderList)
        //地址信息
        let addressList = await Net.getData(Api.addressList);
        await Utils.ajax({
            url: '/src/address.js',
            dataType: 'script'
        });
        let html = '';
        if (this.orderList.hasOwnProperty("cityAssress")) {
            //地址信息(点击地址选择时的信息)
            html += `<div class="name">${this.orderList['name']}<span>${this.orderList['phone']}</span></div>
                    <div class="address" data-id="${this.orderList['id']}"> <span style="display:${this.orderList['flag'] == 1 ? 'inline' : 'none'}">默认</span> ${this.orderList['cityAssress'] + this.orderList['address']}</div>`
            $("#orderAddress .info").html(html);
        } else {
            //地址信息(刚进入页面时显示默认地址)
            for (let x = 0; x < addressList.length; x++) {
                let province_cn: Array<string> = [], //省份
                    city_cn: Array<string> = [],      //市区
                    area_cn: Array<string> = [];      //县

                /**城市拼接遍历 */
                city.forEach(function (item, index) {
                    if (index == addressList[x]['province']) {
                        province_cn = item['name'];
                        if (item.hasOwnProperty('child')) {
                            item['child'].forEach(function (item1, index1) {
                                if (index1 == addressList[x]['city']) {
                                    city_cn = item1['name'];
                                    if (item1.hasOwnProperty('child')) {
                                        item1['child'].forEach(function (item2, index2) {
                                            if (index2 == addressList[x]['area']) {
                                                area_cn = item2['name'];

                                            }
                                        })
                                    }
                                }
                            });
                        }
                    }
                })
                if (addressList[x]['flag'] == 1) {
                    html += `<div class="name">${addressList[x]['name']}<span>${addressList[x]['phone']}</span></div>
                         <div class="address" data-id="${addressList[x]['id']}" data-province='${addressList[x]['province']}' data-city='${addressList[x]['city']}' data-area='${addressList[x]['area']}'><span>默认</span>${province_cn + '' + city_cn + '' + area_cn}</div>`
                    $("#orderAddress .info").html(html);
                }
            }
        }



        //地址选择     
        $("#orderAddress").click(function () {
            Core.viewManager.openView(ViewConfig.addresses, {
                orderlistId: $this.orderId['orderlistId']
            });
        })


        //订单列表渲染
        let html1 = '';
        if (this.orderList.hasOwnProperty("cityAssress")) {
            for (let x = 0; x < awardsBox.length; x++) {
                if (awardsBox[x]['goods_id'] == this.orderList['orderlistId'][x]) {
                    html1 += `<li class="item" data-id="${awardsBox[x]['goods_id']}">
                                <div class="imgbox">
                                    <img src="${Config.imgBase + awardsBox[x]['src']}">
                                </div>
                                <div class="infoword">
                                    <p>${awardsBox[x]['title']}</p>
                                </div>
                            </li>`
                }
            }
            $("#orderList").html(html1);
        }

        //提交订单 
        $(".orderbtn").click(async () => {
            let goodsOrder = await Net.getData(Api.goodsOrder, {
                idList: $this.orderId['orderlistId'].join(","),
                addressId: $(".address").data('id')
            })
            
            //信息正确跳转
            if (goodsOrder) {
                $("#orderDialog").show();
                $("#orderDialog .tit").text("订单提交成功");
                $("#orderDialog .tips").text("订单提交成功，请耐心等待发货");
                $this.orderNum=goodsOrder['sn'];
                //下单成功
                $(".surebtn").click(function(){
                    $("#orderDialog").hide();
                    Core.viewManager.openView(ViewConfig.orderDetail,{
                        orderNum:$this.orderNum
                    });
                })
            } 
        })           
    }


    /**
     * 订单列表
     */
    private awardsGood(awardsBox: any) {
        this.orderId = this.dataSource;
        let html = ''
        for (let x = 0; x < awardsBox.length; x++) {
            if (this.orderId['orderlistId'].indexOf(parseInt(awardsBox[x]['goods_id']))!=-1) {
                html += `<li class="item" data-id="${awardsBox[x]['goods_id']}">
                            <div class="imgbox">
                                <img src="${Config.imgBase + awardsBox[x]['src']}">
                            </div>
                            <div class="infoword">
                                <p>${awardsBox[x]['title']}</p>
                            </div>
                        </li>`
            }
        }
        $("#orderList").html(html);
    }

    /**
    * 错误弹窗显示
    * @param data  错误提示信息
    */
    private onError(data: any) {
        switch (data['api']) {
            case Api.goodsOrder.name:
                this.orderFail();
                $("#orderDialog .tips").text(data['data']['mes']);

                break;
        }
    }

    /**
     * 订单提交失败
     * @param e 
     */
    private orderFail(){
        $("#orderDialog").show();
        $("#orderDialog .tit").text("订单提交失败");
        $(".surebtn").html("再逛逛").click(function(){
            Core.viewManager.openView(ViewConfig.awardsBox);
        })
    }



    onClick(e) {
        console.log(e)
    }
}   