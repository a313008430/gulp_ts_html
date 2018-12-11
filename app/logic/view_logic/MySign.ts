import ViewBase from "../../core/ViewBase";
import Core from "../../core/Core";
import ViewConfig from "../../common/ViewConfig";
import { Net, Api } from "../../common/Net";
import Config from "../../common/Config";


export default class MySign extends ViewBase {

    async  onEnable() {

        $('#goBack').on('click', () => {
            Core.viewManager.openView(ViewConfig.personal);
        })

        //我的签到
        let sign = await Net.getData(Api.signature);
        //按照Id倒序排序
        let signOrder = sign['list'].sort(function (a, b) {
            return a.id - b.id;
        });
        this.getSignList(signOrder, sign['dayList']);
    }

    /**
     * 我的签到
     */
    private getSignList(list: any, dayList: any[]) {
        let html = '';
        let num;
        if (dayList[0]['num']) {
            num = parseInt(dayList[0]['num']);
        }
        for (let x = 0; x < list.length; x++) {
            html += `<li class="days-small ${num > 0 ? 'days-disable' : ''}">
                        <div class="t">第${x + 1}天</div>
                        <div class="${num > 0 ? 'complete' : ''}"></div>    
                        <p class="signicon"></p>
                        <p class="money">${list[x]['title']}</p>
                    </li>`
            num--;
        }
        $("#mySignDays").html(html);
        $("#mySignDays").children("li").eq(2).addClass("days-big");
        $("#mySignDays").children("li").eq(6).addClass("days-big");
    }



    onClick(e) {
        console.log(e)
    }
}   