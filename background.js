/*
 * @description:
 * @project: UEC11
 * @Author: Gouxinyu
 * @Identification: SF3569
 * @Date: 2020-01-22 15:58:54
 */

//将data数据以桌面通知的方式显示给用户
function showNote(data) {
    //显示一个桌面通知
    if (window.webkitNotifications) {
        const notification = window.webkitNotifications.createNotification(
            "icons/icon_48.png", // icon url - can be relative
            "记得填工时哦!", // notification title
            data // notification body text
        );
        notification.show();
        // 设置3秒后，将桌面通知dismiss
        setTimeout(function () {
            notification.cancel();
        }, 3500);
    } else if (chrome.notifications) {
        const opt = {
            type: "basic",
            title: "记得填工时哦!",
            message: data,
            iconUrl: "icons/icon_48.png",
        };
        chrome.notifications.create("", opt, function (id) {
            setTimeout(function () {
                chrome.notifications.clear(id, function () {});
            }, 3500);
        });
    } else {
        alert("亲，你的浏览器不支持啊！");
    }

    chrome.tabs.create({
        url: "http://171.221.203.127:30037/jobhoursmanage/static/index.html#/",
        selected: true,
    });
}

/**
 * 定时执行
 * @param {} config
 * @param {*} func
 */
function showNoteOnTime(config, func) {
    if (config.runNow) func();

    let nowTime = new Date().getTime();

    let timePoints = config.time.split(":").map((i) => parseInt(i));

    let recent = new Date().setHours(...timePoints);

    recent >= nowTime || (recent += 24 * 3600000);

    console.log(recent - nowTime);
    window.setGapDay = setTimeout(() => {
        func();

        window.setAutoDayTimer = setInterval(func, config.interval * 3600000);
    }, recent - nowTime);
}

function setTime(time) {
    console.log(time);
    if (window.setGapDay) clearTimeout(window.setGapDay);
    if (window.setAutoDayTimer) {
        clearInterval(window.setAutoDayTimer);
    }
    showNoteOnTime(
        {
            interval: 1, //间隔天数，间隔为整数

            runNow: false, //是否立即运行

            time, //执行的时间点 时在0~23之间
        },
        () => {
            showNote("又是辛苦板砖的一天，别忘了填工时哦~");
        }
    );
}

setTime("01:11");
